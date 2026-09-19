import { memo, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';
import SectionHeader from '@/components/SectionHeader';
import { Copy, CheckCheck, ArrowRight } from 'lucide-react';

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

const afterCode = `# AFTER: Guard clauses, flat and readable
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

/* Metrics are measured from the samples above, not hard-coded. */
const measure = (code: string) => {
  const lines = code.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));
  const depth = Math.max(...lines.map((l) => Math.floor((l.length - l.trimStart().length) / 4)));
  const elses = lines.filter((l) => l.trim().startsWith('else')).length;
  return { lines: lines.length, depth, elses };
};
const beforeStats = measure(beforeCode);
const afterStats = measure(afterCode);

const metrics = [
  { label: 'Lines of code', from: beforeStats.lines, to: afterStats.lines },
  { label: 'Nesting depth', from: beforeStats.depth, to: afterStats.depth },
  { label: 'else branches', from: beforeStats.elses, to: afterStats.elses },
];

const highlightCode = (code: string) => {
  let highlighted = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const tokens: { placeholder: string; html: string }[] = [];
  let tokenCounter = 0;
  const addToken = (html: string) => {
    const placeholder = `___TOKEN_${tokenCounter++}___`;
    tokens.push({ placeholder, html });
    return placeholder;
  };

  highlighted = highlighted.replace(/(".*?"|'.*?')/g, (m) =>
    addToken(`<span class="code-string">${m}</span>`)
  );
  highlighted = highlighted.replace(/(#.*$)/gm, (m) =>
    addToken(`<span class="code-comment">${m}</span>`)
  );
  highlighted = highlighted.replace(/\b(\d+(?:\.\d+)?)\b/g, (m) =>
    addToken(`<span class="code-number">${m}</span>`)
  );
  highlighted = highlighted.replace(
    /\b(and|as|assert|break|class|continue|def|del|elif|else|except|False|finally|for|from|global|if|import|in|is|lambda|None|nonlocal|not|or|pass|raise|return|True|try|while|with|yield|print)\b/g,
    (m) => addToken(`<span class="code-keyword">${m}</span>`)
  );

  tokens.forEach(({ placeholder, html }) => {
    highlighted = highlighted.replace(placeholder, html);
  });
  return highlighted;
};

const CodeCard = memo(function CodeCard({
  variant,
  code,
  cardRef,
}: {
  variant: 'before' | 'after';
  code: string;
  cardRef: RefObject<HTMLDivElement | null>;
}) {
  const [copied, setCopied] = useState(false);
  const html = useMemo(() => highlightCode(code), [code]);
  const bad = variant === 'before';
  const tone = bad
    ? { border: 'border-red-500/30', head: 'bg-red-500/10 border-red-500/30', text: 'text-red-300', glow: 'shadow-red-500/10' }
    : { border: 'border-emerald-500/30', head: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-300', glow: 'shadow-emerald-500/10' };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      ref={cardRef}
      className={`cq-card overflow-hidden rounded-2xl border bg-[#0d1117] shadow-2xl ${tone.border} ${tone.glow}`}
    >
      <div className={`flex items-center gap-2 border-b px-4 py-3 ${tone.head}`}>
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-400/80" />
        </div>
        <span className={`ml-2 font-mono text-xs font-semibold tracking-wide ${tone.text}`}>
          {bad ? 'BEFORE · nested & hard to read' : 'AFTER · flat & easy to read'}
        </span>
        <button
          onClick={copy}
          aria-label={copied ? 'Copied' : `Copy ${variant} code`}
          className="ml-auto rounded-md p-1.5 text-muted-foreground transition hover:bg-white/10 hover:text-white"
        >
          {copied ? <CheckCheck className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <pre className="cq-code m-0 overflow-x-auto p-4 font-mono text-[10px] leading-relaxed min-[420px]:text-xs sm:text-[13px]">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
});

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
};

const smooth = (x: number) => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};

const DEPTH = 170; // px the receding card travels away from the viewer
const LIFT = 34; // px the receding card peeks out above/below

const CodeQuality = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    const apply = (t: number) => {
      const b = beforeRef.current;
      const a = afterRef.current;
      if (!b || !a) return;

      // The cards slide past each other sideways while trading depth, so the
      // z-order swap happens when they are apart and never "pops".
      const box = stageRef.current?.getBoundingClientRect();
      // Keep the sideways motion inside the page margins so phones never clip the card.
      const maxSwing = box ? Math.max(6, Math.min(box.width * 0.09, box.left - 6)) : 20;
      const swing = maxSwing * Math.sin(Math.PI * t);

      b.style.transform = `translate3d(${(-swing).toFixed(1)}px, ${(-LIFT * t).toFixed(1)}px, ${(-DEPTH * t).toFixed(1)}px)`;
      b.style.filter = `brightness(${(1 - 0.5 * t).toFixed(3)})`;
      b.style.zIndex = t < 0.5 ? '2' : '1';
      b.style.pointerEvents = t < 0.5 ? 'auto' : 'none';

      a.style.transform = `translate3d(${swing.toFixed(1)}px, ${(LIFT * (1 - t)).toFixed(1)}px, ${(-DEPTH * (1 - t)).toFixed(1)}px)`;
      a.style.filter = `brightness(${(0.5 + 0.5 * t).toFixed(3)})`;
      a.style.opacity = String(Math.min(1, t / 0.2));
      a.style.zIndex = t < 0.5 ? '1' : '2';
      a.style.pointerEvents = t < 0.5 ? 'none' : 'auto';

      stageRef.current?.style.setProperty('--t', t.toFixed(3));
      if (dotRef.current) dotRef.current.style.left = `${(t * 100).toFixed(1)}%`;
      metrics.forEach((m, i) => {
        const el = valueRefs.current[i];
        if (el) el.textContent = String(Math.round(m.from + (m.to - m.from) * t));
      });
    };

    if (reduced) {
      apply(1);
      ['transform', 'filter', 'opacity', 'zIndex', 'pointerEvents'].forEach((p) => {
        if (beforeRef.current) beforeRef.current.style.removeProperty(p);
        if (afterRef.current) afterRef.current.style.removeProperty(p);
      });
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;
      // hold "before", transition, then hold "after"
      apply(smooth((p - 0.15) / 0.55));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <section
      id="code-quality"
      className="relative overflow-x-clip bg-background px-4 pb-20 pt-20 sm:px-6 md:pb-24 md:pt-24 lg:px-8"
    >
      <style>{`
        .cq-track { height: 210svh; }
        .cq-sticky { position: sticky; top: 4rem; min-height: calc(100svh - 4rem); display: flex; align-items: center; }
        .cq-cards { display: grid; perspective: 1600px; }
        .cq-cards > .cq-slot { grid-area: 1 / 1; }
        .cq-card { position: relative; display: flex; flex-direction: column; height: 100%; will-change: transform, filter; }
        .cq-card > .cq-code { flex: 1; }
        .cq-metric-arrow { color: color-mix(in srgb, #4ade80 calc(var(--t, 0) * 100%), #f87171); }
        .cq-metric-value { color: color-mix(in srgb, #4ade80 calc(var(--t, 0) * 100%), #f87171); }
        @media (max-height: 700px) { .cq-code { font-size: 11px; } }
        @media (prefers-reduced-motion: reduce) {
          .cq-track { height: auto; }
          .cq-sticky { position: static; min-height: 0; }
          .cq-cards { display: flex; flex-direction: column; gap: 1.5rem; perspective: none; }
        }
      `}</style>

      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="Clean Code"
          title="Code Quality Matters"
          subtitle="Clean, efficient, and maintainable code is my standard. Less code, fewer bugs, better performance."
        />
      </div>

      <div ref={trackRef} className="cq-track">
        <div className="cq-sticky">
          <div className="mx-auto w-full max-w-3xl">
            <div ref={stageRef} style={{ '--t': 0 } as CSSProperties}>
              <div className="cq-cards">
                <div className="cq-slot">
                  <CodeCard variant="before" code={beforeCode} cardRef={beforeRef} />
                </div>
                <div className="cq-slot">
                  <CodeCard variant="after" code={afterCode} cardRef={afterRef} />
                </div>
              </div>

              {/* Progress rail */}
              <div className="mt-8 flex items-center gap-3 font-mono text-[11px] tracking-widest text-muted-foreground">
                <span className="text-red-300/90">BEFORE</span>
                <div className="relative h-px flex-1 bg-white/15">
                  <div
                    className="absolute inset-y-0 left-0 h-px bg-gradient-to-r from-red-400 to-emerald-400"
                    style={{ width: 'calc(var(--t) * 100%)' }}
                  />
                  <span
                    ref={dotRef}
                    className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.7)]"
                    style={{ left: '0%' }}
                  />
                </div>
                <span className="text-emerald-300/90">AFTER</span>
              </div>

              {/* Live metrics */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {metrics.map((m, i) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center sm:px-4"
                  >
                    <div className="flex items-baseline justify-center gap-2 font-mono">
                      <span className="text-sm text-white/35 line-through decoration-white/25 sm:text-base">
                        {m.from}
                      </span>
                      <ArrowRight className="cq-metric-arrow h-3.5 w-3.5 self-center" />
                      <span
                        ref={(el) => {
                          valueRefs.current[i] = el;
                        }}
                        className="cq-metric-value text-2xl font-bold tabular-nums sm:text-3xl"
                      >
                        {m.from}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground sm:text-xs">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeQuality;
