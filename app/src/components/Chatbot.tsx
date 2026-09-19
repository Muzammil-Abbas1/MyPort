import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

/* ===============================
   n8n AI API
================================ */
const sendMessageToAI = async (message: string) => {
  try {
    const response = await fetch(
      "https://muzu.app.n8n.cloud/webhook/portfolio-ai",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: message,
        }),
      }
    );

    const data = await response.json();

    return data.output || "I couldn't generate a response.";
  } catch (error) {
    console.error(error);
    return "⚠️ AI service unavailable right now.";
  }
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! 👋 I'm Muzammil's AI assistant. Ask me anything about his skills, projects, or experience!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  /* ===============================
     Send Message
  =================================*/
  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const aiReply = await sendMessageToAI(userText);

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiReply,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "⚠️ Something went wrong.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const quickReplies = [
    "Tell me about Muzammil",
    "What are his skills?",
    "Show me his projects",
    "How can I contact him?",
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 rotate-90"
            : "bg-gradient-to-r from-cyan to-purple hover:opacity-90 animate-pulse-glow"
        }`}
        size="icon"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>

      {/* Chat Window - FIXED POSITIONING */}
      {isOpen && (
        <div className="fixed bottom-[4.5rem] right-4 sm:bottom-20 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm sm:w-96 max-h-[75dvh] sm:max-h-[70vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan to-purple p-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">
                  Muzammil's AI Assistant
                </h3>
                <p className="text-xs text-white/70">Ask me anything!</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background min-h-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.isUser ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isUser ? "bg-cyan/20" : "bg-purple/20"
                  }`}
                >
                  {message.isUser ? (
                    <User className="w-4 h-4 text-cyan" />
                  ) : (
                    <Bot className="w-4 h-4 text-purple" />
                  )}
                </div>

                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-sm whitespace-pre-line ${
                    message.isUser
                      ? "bg-cyan text-background rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-purple/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-purple" />
                </div>

                <div className="bg-muted p-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-purple rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-purple rounded-full animate-bounce delay-150" />
                    <span className="w-2 h-2 bg-purple rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 bg-background border-t border-border flex-shrink-0">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => {
                    setInput(reply);
                    setTimeout(handleSend, 100);
                  }}
                  className="text-xs px-3 py-1.5 bg-muted hover:bg-cyan/20 text-muted-foreground hover:text-cyan rounded-full transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-card border-t border-border flex-shrink-0">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 bg-background border-border focus:border-cyan focus:ring-cyan/20"
              />

              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
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