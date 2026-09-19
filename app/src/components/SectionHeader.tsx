import { useEffect, useRef, useState } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  /** Full title; the last word is highlighted in cyan. */
  title: string;
  subtitle?: string;
  /** Tighter bottom spacing for sections that must fit one screen. */
  compact?: boolean;
}

const SectionHeader = ({ eyebrow, title, subtitle, compact }: SectionHeaderProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const words = title.trim().split(" ");
  const last = words.pop();

  return (
    <div
      ref={ref}
      className={`mx-auto flex flex-col items-center text-center transition-all duration-700 motion-reduce:!translate-y-0 motion-reduce:!opacity-100 motion-reduce:transition-none ${
        compact ? "mb-6 sm:mb-8" : "mb-12 md:mb-14"
      } ${seen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      <span className="mb-3 font-mono text-[11px] uppercase tracking-[0.35em] text-cyan">
        {eyebrow}
      </span>
      <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
        {words.join(" ")} <span className="text-cyan">{last}</span>
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">{subtitle}</p>
      )}
      {!compact && <div className="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-cyan to-purple" />}
    </div>
  );
};

export default SectionHeader;
