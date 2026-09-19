import { useState, useRef, useEffect, Fragment } from "react";
import type { KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User, RotateCcw } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

const GREETING: Message = {
  id: "greeting",
  role: "assistant",
  content:
    "Hi! 👋 I'm Muzammil's AI assistant. Ask me anything about his skills, projects, or experience!",
};

const QUICK_REPLIES = [
  "Tell me about Muzammil",
  "What are his skills?",
  "Show me his projects",
  "How can I contact him?",
];

const FALLBACK_ERROR =
  "I couldn't reach the AI right now. You can contact Muzammil directly at 210muzammilabbas@gmail.com or on WhatsApp +92 3118911228.";

const REQUEST_TIMEOUT_MS = 25000;
const HISTORY_LIMIT = 10;

/** Max messages one visitor may send per browser session (also enforced on the server). */
const SESSION_LIMIT = 15;
const LOW_WARNING_AT = 5;
/** Same window the server uses before it forgets a session. */
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

const LIMIT_MESSAGE = `You've reached the limit of ${SESSION_LIMIT} messages for this session. To keep chatting, please email Muzammil at 210muzammilabbas@gmail.com or message him on WhatsApp +92 3118911228.`;

const storage = {
  get: (key: string) => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      /* storage unavailable (private mode); the counter stays in memory */
    }
  },
};

const getSessionId = () => {
  let id = storage.get("chat_session_id");
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    storage.set("chat_session_id", id);
  }
  return id;
};

/** Messages used so far; resets once the 12-hour session window has passed. */
const readUsed = () => {
  const started = Number(storage.get("chat_started") ?? 0);
  if (started && Date.now() - started > SESSION_TTL_MS) {
    storage.set("chat_used", "0");
    storage.set("chat_started", "");
    return 0;
  }
  const n = Number(storage.get("chat_used") ?? 0);
  return Number.isFinite(n) ? Math.min(Math.max(Math.floor(n), 0), SESSION_LIMIT) : 0;
};

/** Renders **bold** and turns URLs/emails into safe clickable links (no HTML injection). */
const renderWithLinks = (text: string) =>
  text.split(/(\*\*[^*\n]+\*\*)/g).map((chunk, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold">
        {chunk.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{linkify(chunk)}</Fragment>
    )
  );

const linkify = (text: string) => {
  const parts = text.split(/(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g);
  return parts.map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    const trimmed = part.replace(/[.,;:!?)]+$/, "");
    const tail = part.slice(trimmed.length);
    const href = trimmed.startsWith("http") ? trimmed : `mailto:${trimmed}`;
    return (
      <Fragment key={i}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-medium text-cyan underline underline-offset-2 hover:opacity-80"
        >
          {trimmed}
        </a>
        {tail}
      </Fragment>
    );
  });
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [used, setUsed] = useState(readUsed);

  const remaining = SESSION_LIMIT - used;
  const limitReached = remaining <= 0;

  const recordUsed = (n: number) => {
    const value = Math.min(Math.max(n, 0), SESSION_LIMIT);
    setUsed(value);
    storage.set("chat_used", String(value));
    if (value > 0 && !storage.get("chat_started")) storage.set("chat_started", String(Date.now()));
    if (value === 0) storage.set("chat_started", "");
  };

  // If the tab stays open past the session window, unlock the chat again.
  useEffect(() => {
    if (used <= 0) return;
    const started = Number(storage.get("chat_started") ?? 0);
    if (!started) return;
    const wait = Math.max(0, started + SESSION_TTL_MS - Date.now()) + 500;
    const timer = setTimeout(() => setUsed(readUsed()), Math.min(wait, 2 ** 31 - 1));
    return () => clearTimeout(timer);
  }, [used]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => () => abortRef.current?.abort(), []);

  /** Sends the conversation to /api/chat and appends the reply (or an error). */
  const requestReply = async (history: Message[]) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    setIsTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          sessionId: getSessionId(),
          messages: history
            .filter((m) => !m.error)
            .slice(-HISTORY_LIMIT)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        reply?: string;
        error?: string;
        code?: string;
        remaining?: number;
      } | null;

      if (data?.code === "session_limit") {
        recordUsed(SESSION_LIMIT);
        setMessages((prev) => [
          ...prev.filter((m) => !m.error),
          { id: `${Date.now()}-l`, role: "assistant", content: LIMIT_MESSAGE },
        ]);
        return;
      }
      if (!res.ok || !data?.reply) {
        throw new Error(data?.error || FALLBACK_ERROR);
      }
      // A message only counts once it was answered successfully.
      recordUsed(
        typeof data.remaining === "number" ? SESSION_LIMIT - data.remaining : readUsed() + 1
      );
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-a`, role: "assistant", content: data.reply as string },
      ]);
    } catch (err) {
      if (controller.signal.aborted && !timedOut) return; // cancelled on purpose
      const text = timedOut
        ? "The AI took too long to answer. Please try again."
        : err instanceof Error && err.message
          ? err.message
          : FALLBACK_ERROR;
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-e`, role: "assistant", content: text, error: true },
      ]);
    } finally {
      clearTimeout(timer);
      if (abortRef.current === controller) setIsTyping(false);
    }
  };

  const send = (raw: string) => {
    const text = raw.trim();
    const current = readUsed(); // also applies the 12-hour expiry
    if (current !== used) setUsed(current);
    if (!text || isTyping || current >= SESSION_LIMIT) return;
    const next: Message[] = [...messages, { id: `${Date.now()}-u`, role: "user", content: text }];
    setMessages(next);
    setInput("");
    void requestReply(next);
  };

  const retry = () => {
    const current = readUsed();
    if (current !== used) setUsed(current);
    if (isTyping || current >= SESSION_LIMIT) return;
    const history = messages.filter((m) => !m.error);
    setMessages(history);
    void requestReply(history);
  };

  const reset = () => {
    abortRef.current?.abort();
    setIsTyping(false);
    setMessages([GREETING]);
    setInput("");
    inputRef.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const hasUserMessage = messages.some((m) => m.role === "user");

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 rotate-90"
            : "bg-gradient-to-r from-cyan to-purple hover:opacity-90 animate-pulse-glow"
        }`}
        size="icon"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat with Muzammil's AI assistant"
          className="fixed bottom-[4.5rem] right-4 sm:bottom-20 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm sm:w-96 h-[70dvh] max-h-[560px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan to-purple p-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-white truncate">Muzammil's AI Assistant</h3>
                <p className="text-xs text-white/80 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Online · powered by AI
                </p>
              </div>
              {hasUserMessage && (
                <button
                  onClick={reset}
                  aria-label="Start a new chat"
                  title="New chat"
                  className="rounded-full p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div
            role="log"
            aria-live="polite"
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-background min-h-0"
          >
            {messages.map((message) => {
              const isUser = message.role === "user";
              return (
                <div key={message.id} className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isUser ? "bg-cyan/20" : "bg-purple/20"
                    }`}
                  >
                    {isUser ? (
                      <User className="w-4 h-4 text-cyan" />
                    ) : (
                      <Bot className="w-4 h-4 text-purple" />
                    )}
                  </div>

                  <div className={`max-w-[80%] ${isUser ? "" : "min-w-0"}`}>
                    <div
                      className={`p-3 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                        isUser
                          ? "bg-cyan text-background rounded-br-none"
                          : message.error
                            ? "bg-red-500/10 text-red-200 border border-red-500/30 rounded-bl-none"
                            : "bg-muted text-foreground rounded-bl-none"
                      }`}
                    >
                      {isUser ? message.content : renderWithLinks(message.content)}
                    </div>
                    {message.error && (
                      <button
                        onClick={retry}
                        disabled={isTyping}
                        className="mt-1.5 flex items-center gap-1.5 text-xs text-cyan hover:underline disabled:opacity-50"
                      >
                        <RotateCcw className="h-3 w-3" /> Try again
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2" aria-label="The assistant is typing">
                <div className="w-8 h-8 rounded-full bg-purple/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-purple" />
                </div>
                <div className="bg-muted p-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-purple rounded-full animate-bounce motion-reduce:animate-none" />
                    <span
                      className="w-2 h-2 bg-purple rounded-full animate-bounce motion-reduce:animate-none"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-purple rounded-full animate-bounce motion-reduce:animate-none"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies (only before the first question) */}
          {!hasUserMessage && !limitReached && (
            <div className="px-4 py-2 bg-background border-t border-border flex-shrink-0">
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => send(reply)}
                    disabled={isTyping}
                    className="text-xs px-3 py-1.5 bg-muted hover:bg-cyan/20 text-muted-foreground hover:text-cyan rounded-full transition-colors disabled:opacity-50"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 sm:p-4 bg-card border-t border-border flex-shrink-0">
            {!limitReached && remaining <= LOW_WARNING_AT && (
              <p className="mb-2 text-center text-xs text-amber-300/90">
                {remaining} message{remaining === 1 ? "" : "s"} left in this session
              </p>
            )}
            {limitReached && (
              <p className="mb-2 text-center text-xs text-muted-foreground">
                Message limit reached for this session.
              </p>
            )}
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                maxLength={500}
                disabled={limitReached}
                aria-label="Type your message"
                placeholder={limitReached ? "Message limit reached" : "Ask about Muzammil..."}
                className="flex-1 bg-background border-border focus:border-cyan focus:ring-cyan/20"
              />
              <Button
                onClick={() => send(input)}
                disabled={!input.trim() || isTyping || limitReached}
                aria-label="Send message"
                size="icon"
                className="bg-gradient-to-r from-cyan to-purple hover:opacity-90 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
