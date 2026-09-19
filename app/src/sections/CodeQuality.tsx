import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { X, Check, Copy, CheckCheck } from 'lucide-react';

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ Fixed syntax highlighting - ORDER MATTERS!
  const highlightCode = (code: string) => {
    // First escape HTML to prevent XSS
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Create a token map to preserve replacements
    const tokens: { placeholder: string; html: string }[] = [];
    let tokenCounter = 0;

    const addToken = (html: string) => {
      const placeholder = `___TOKEN_${tokenCounter++}___`;
      tokens.push({ placeholder, html });
      return placeholder;
    };

    // 1. Strings first (to protect content inside them)
    highlighted = highlighted.replace(
      /(".*?"|'.*?')/g,
      (match) => addToken(`<span class="code-string">${match}</span>`)
    );

    // 2. Comments (must be after strings to avoid highlighting # inside strings)
    highlighted = highlighted.replace(
      /(#.*$)/gm,
      (match) => addToken(`<span class="code-comment">${match}</span>`)
    );

    // 3. Numbers (avoid matching parts of words)
    highlighted = highlighted.replace(
      /\b(\d+(?:\.\d+)?)\b/g,
      (match) => addToken(`<span class="code-number">${match}</span>`)
    );

    // 4. Keywords (Python-specific)
    highlighted = highlighted.replace(
      /\b(and|as|assert|break|class|continue|def|del|elif|else|except|False|finally|for|from|global|if|import|in|is|lambda|None|nonlocal|not|or|pass|raise|return|True|try|while|with|yield|print)\b/g,
      (match) => addToken(`<span class="code-keyword">${match}</span>`)
    );

    // 5. Operators
    highlighted = highlighted.replace(
      /(\+|-|\*|\/\/|\/|%|\*\*|==|!=|<=|>=|<|>|=|\+=|-=|\*=|\/=|\/\/=|%=|\*\*=|&|\||\^|~|<<|>>)/g,
      (match) => addToken(`<span class="code-operator">${match}</span>`)
    );

    // 6. Built-in functions
    highlighted = highlighted.replace(
      /\b(len|range|enumerate|zip|map|filter|sum|min|max|abs|round|str|int|float|list|dict|set|tuple)\b/g,
      (match) => addToken(`<span class="code-builtin">${match}</span>`)
    );

    // Restore all tokens
    tokens.forEach(({ placeholder, html }) => {
      highlighted = highlighted.replace(placeholder, html);
    });

    return highlighted;
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-md bg-white/5 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Copy code"
        aria-label={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? (
          <CheckCheck className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <pre className="text-sm leading-relaxed overflow-x-auto p-4 font-mono">
        <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
      </pre>
    </div>
  );
};

const CodeQuality = () => {
  const [activeTab, setActiveTab] = useState('before');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // ❌ BEFORE (imperative style)
 const beforeCode = `# BEFORE: Hard to read, harder to debug
 def get_user_status(user):
    if user:
        if user.is_active:
            if user.subscription:
                if user.subscription.is_valid():
                    if not user.is_banned:
                        return "active"
                    else:
                        return "banned"
                else:
                    return "expired"
            else:
                return "no_subscription"
        else:
            return "inactive"
    else:
        return "not_found"`;

  
  const afterCode = `# Best Practice 

def get_user_status(user):
    if not user:
        return "not_found"
    if not user.is_active:
        return "inactive"
    if not user.subscription:
        return "no_subscription"
    if not user.subscription.is_valid():
        return "expired"
    if user.is_banned:
        return "banned"
    
    return "active"`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="code-quality"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background overflow-x-clip"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Code Quality Matters
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Clean, efficient, and maintainable code is my standard. 
            Less code, fewer bugs, better performance.
          </p>
        </div>

        {/* Code Comparison */}
        <div
          className={`transition-all duration-700 delay-200 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-card border border-border rounded-lg p-1">
              <TabsTrigger
                value="before"
                className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 data-[state=active]:shadow-sm flex items-center gap-2 rounded-md transition-all"
              >
                <X className="w-4 h-4" />
                Before
              </TabsTrigger>

              <TabsTrigger
                value="after"
                className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 data-[state=active]:shadow-sm flex items-center gap-2 rounded-md transition-all"
              >
                <Check className="w-4 h-4" />
                After
              </TabsTrigger>
            </TabsList>

            <TabsContent value="before" className="mt-0 animate-in fade-in-50 duration-300">
              <div className="rounded-xl overflow-hidden border border-red-500/30 shadow-lg shadow-red-500/5">
                <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border-b border-red-500/30">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>
                  <X className="w-4 h-4 text-red-400 ml-2" />
                  <span className="text-sm font-medium text-red-400">
                    6 lines • Verbose • Slower
                  </span>
                </div>
                <div className="bg-card/50 backdrop-blur-sm">
                  <CodeBlock code={beforeCode} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="after" className="mt-0 animate-in fade-in-50 duration-300">
              <div className="rounded-xl overflow-hidden border border-green-500/30 shadow-lg shadow-green-500/5">
                <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border-b border-green-500/30">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>
                  <Check className="w-4 h-4 text-green-400 ml-2" />
                  <span className="text-sm font-medium text-green-400">
                    1 line • Readable • Faster
                  </span>
                </div>
                <div className="bg-card/50 backdrop-blur-sm">
                  <CodeBlock code={afterCode} />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Benefits Section */}
          <div className="mt-8 grid sm:grid-cols-3 gap-4 text-center">
            {[
              { label: 'Readability', desc: 'Self-documenting code' },
              { label: 'Performance', desc: 'Optimized C loops' },
              { label: 'Maintainability', desc: 'Easier to modify' },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-lg bg-card/30 border border-border/50">
                <div className="font-semibold text-foreground mb-1">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeQuality;