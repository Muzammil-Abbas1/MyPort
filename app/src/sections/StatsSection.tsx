import { useEffect, useRef, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import { Code2, FolderGit2, Clock, FileCode, Sparkles } from "lucide-react";

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  suffix?: string;
  color: string;
  delay: number;
  index: number;
}

const StatItem = ({ icon, value, label, suffix = "", color, delay, index }: StatItemProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const targetValue = parseInt(value);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), targetValue);
      setCount(current);

      if (step >= steps) {
        clearInterval(timer);
        setCount(targetValue);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, targetValue]);

  const colorClasses: Record<string, string> = {
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]",
    orange: "from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400 hover:shadow-[0_0_30px_rgba(251,146,60,0.3)]",
  };

  return (
    <div
      ref={itemRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative group cursor-pointer
        rounded-2xl border bg-gradient-to-br backdrop-blur-xl
        p-6 transition-all duration-500
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        ${colorClasses[color]}
        ${isHovered ? "scale-105 -translate-y-2" : "scale-100"}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Animated background glow */}
      <div 
        className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
          bg-gradient-to-br ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]}
        `}
      />

      {/* Floating particles on hover */}
      {isHovered && (
        <>
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-current animate-ping" />
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full bg-current animate-ping" style={{ animationDelay: '0.2s' }} />
        </>
      )}

      <div className="relative z-10">
        {/* Icon with animation */}
        <div className={`
          w-12 h-12 rounded-xl border border-current/20 bg-current/10 
          flex items-center justify-center mb-4
          transition-transform duration-300
          ${isHovered ? "rotate-12 scale-110" : ""}
        `}>
          {icon}
        </div>

        {/* Counter value */}
        <div className="flex items-baseline gap-1">
          <span className="text-4xl md:text-5xl font-bold tabular-nums">
            {count}
          </span>
          <span className="text-2xl font-bold">{suffix}</span>
        </div>

        {/* Label */}
        <p className="text-sm text-white/60 mt-2 font-medium tracking-wide">
          {label}
        </p>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-current/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-current rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: isVisible ? `${(count / targetValue) * 100}%` : '0%',
              transitionDelay: `${delay + 500}ms`
            }}
          />
        </div>
      </div>

      {/* Corner decoration */}
      <div className="absolute top-4 right-4 opacity-20">
        <Sparkles className="w-5 h-5" />
      </div>
    </div>
  );
};

const StatsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: <Clock className="w-6 h-6" />,
      value: "2",
      suffix: "+",
      label: "Years Experience",
      color: "cyan",
      delay: 0,
    },
    {
      icon: <FolderGit2 className="w-6 h-6" />,
      value: "15",
      suffix: "+",
      label: "Projects Completed",
      color: "purple",
      delay: 200,
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      value: "10",
      suffix: "+",
      label: "Web Applications",
      color: "emerald",
      delay: 400,
    },
    {
      icon: <FileCode className="w-6 h-6" />,
      value: "30",
      suffix: "k+",
      label: "Lines of Code",
      color: "orange",
      delay: 600,
    },
  ];

  return (
    <section 
      ref={sectionRef}
      id="stats" 
      className="relative py-20 md:py-24 bg-black overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <SectionHeader
          eyebrow="Track Record"
          title="Numbers That Speak"
          subtitle="A snapshot of my journey in automation, development, and creating impactful solutions."
        />

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              color={stat.color}
              delay={stat.delay}
              index={index}
            />
          ))}
        </div>

        {/* Bottom decoration */}
        <div className={`flex justify-center mt-16 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-4 text-white/30">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/30" />
            <Sparkles className="w-5 h-5" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/30" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;