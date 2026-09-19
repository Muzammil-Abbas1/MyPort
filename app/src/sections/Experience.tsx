import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import { Brain, Code2, Server, Flag, Rocket } from 'lucide-react';

interface Role {
  step: string;
  title: string;
  company: string;
  mode: string;
  accent: string;
  icon: typeof Brain;
  points: string[];
  tech: string[];
}

const roles: Role[] = [
  {
    step: '01',
    title: 'AI/ML Engineer Intern',
    company: 'Developer Hub Corporation',
    mode: 'Remote',
    accent: '#00d4ff',
    icon: Brain,
    points: [
      'Data cleaning, normalization, and visualization for ML models',
      'Developed a House Price Prediction model using Python',
      'Collaborated on testing and evaluating model performance',
      'Hands-on experience in AI/ML project management',
    ],
    tech: ['Python', 'Pandas', 'Scikit-learn', 'ML'],
  },
  {
    step: '02',
    title: 'Front-End Developer',
    company: 'Hecta AI Solutions Pvt',
    mode: 'Front-End',
    accent: '#a855f7',
    icon: Code2,
    points: [
      'Built responsive, accessible user interfaces with HTML, CSS, and JavaScript',
      'Developed type-safe, maintainable front-end code using TypeScript',
      'Turned design mockups into clean, reusable UI components',
      'Collaborated with the team to ship polished, production-ready pages',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
  },
  {
    step: '03',
    title: 'Full-Stack Developer Intern',
    company: '10Pearls',
    mode: 'Internship',
    accent: '#10b981',
    icon: Server,
    points: [
      'Built backend REST APIs using Java and Spring Boot',
      'Developed server-side services with Node.js',
      'Worked across the stack, connecting APIs to front-end interfaces',
      'Followed professional engineering practices in a team environment',
    ],
    tech: ['Java', 'Spring Boot', 'Node.js', 'REST APIs'],
  },
];

const useReducedMotionOrTouch = () => {
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)');
    const update = () => setDisabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return disabled;
};

const RoleItem = ({
  role,
  index,
  noTilt,
}: {
  role: Role;
  index: number;
  noTilt: boolean;
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isLeft = index % 2 === 0;
  const Icon = role.icon;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (itemRef.current) observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (noTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg) scale3d(1.02,1.02,1.02)`;
    cardRef.current.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
    cardRef.current.style.setProperty('--my', `${(y + 0.5) * 100}%`);
  };

  const handleLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
  };

  const revealFrom = isLeft ? -28 : 28;

  return (
    <div
      ref={itemRef}
      className="relative md:grid md:grid-cols-2 md:gap-16 pl-12 md:pl-0"
      style={{ '--accent': role.accent } as CSSProperties}
    >
      {/* Node on the roadmap line */}
      <div className="absolute left-4 md:left-1/2 top-8 -translate-x-1/2 z-10">
        <div
          className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 bg-background transition-all duration-700 ${
            visible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
          style={{
            borderColor: role.accent,
            boxShadow: visible ? `0 0 24px ${role.accent}88` : 'none',
          }}
        >
          <span
            className="exp-ping absolute inset-0 rounded-full"
            style={{ borderColor: role.accent }}
          />
          <Icon className="h-4 w-4" style={{ color: role.accent }} />
        </div>
      </div>

      {/* Card */}
      <div
        className={`${isLeft ? 'md:col-start-1' : 'md:col-start-2'} transition-all duration-1000 ease-out`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? 'translate3d(0,0,0) rotateY(0deg)'
            : `translate3d(${revealFrom}px,40px,0) rotateY(${isLeft ? 25 : -25}deg)`,
          transitionDelay: '150ms',
          perspective: '1200px',
        }}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className="exp-card group relative overflow-hidden rounded-2xl border border-white/10 bg-card/80 backdrop-blur-xl p-6 sm:p-8"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.25s ease-out, border-color 0.3s, box-shadow 0.3s',
            willChange: 'transform',
          }}
        >
          {/* Cursor spotlight */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient(400px circle at var(--mx,50%) var(--my,50%), ${role.accent}22, transparent 60%)`,
            }}
          />
          {/* Accent bar */}
          <div
            className="absolute inset-y-0 left-0 w-1"
            style={{ background: `linear-gradient(to bottom, ${role.accent}, transparent)` }}
          />

          <div className="relative" style={{ transform: 'translateZ(30px)' }}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <span
                  className="mb-2 inline-block font-mono text-xs tracking-[0.3em]"
                  style={{ color: role.accent }}
                >
                  STEP {role.step}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">{role.title}</h3>
                <p className="mt-1 text-muted-foreground">{role.company}</p>
              </div>
              <span
                className="shrink-0 rounded-full border px-3 py-1 text-xs font-medium"
                style={{
                  color: role.accent,
                  borderColor: `${role.accent}55`,
                  background: `${role.accent}14`,
                }}
              >
                {role.mode}
              </span>
            </div>

            <ul className="space-y-3">
              {role.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: role.accent }}
                  />
                  <span className="text-sm sm:text-base text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>

            <div
              className="mt-6 flex flex-wrap gap-2"
              style={{ transform: 'translateZ(20px)' }}
            >
              {role.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-foreground/80"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const noTilt = useReducedMotionOrTouch();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const start = window.innerHeight * 0.65;
      const p = (start - rect.top) / rect.height;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden"
    >
      <style>{`
        @keyframes exp-ping { 0% { transform: scale(1); opacity: .7; } 100% { transform: scale(1.9); opacity: 0; } }
        .exp-ping { border-width: 2px; border-style: solid; animation: exp-ping 2.2s ease-out infinite; }
        .exp-card:hover { border-color: color-mix(in srgb, var(--accent) 45%, transparent); box-shadow: 0 25px 60px -20px color-mix(in srgb, var(--accent) 40%, transparent); }
        @media (prefers-reduced-motion: reduce) { .exp-ping { animation: none; opacity: 0; } }
      `}</style>

      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute top-[10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-cyan/10 blur-[120px]" />
        <div className="absolute bottom-[5%] right-[-10%] h-[40%] w-[40%] rounded-full bg-purple/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div
          className={`mb-14 text-center transition-all duration-700 ${
            headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h2 className="mb-4 text-3xl font-bold text-gradient sm:text-4xl">Career Roadmap</h2>
          <p className="text-lg text-muted-foreground">
            From machine learning to full-stack engineering
          </p>
        </div>

        {/* Start marker */}
        <div className="relative mb-8 flex justify-start pl-1 md:justify-center md:pl-0">
          <span className="ml-0 flex items-center gap-2 rounded-full border border-white/10 bg-card px-4 py-1.5 font-mono text-xs tracking-widest text-muted-foreground md:ml-0">
            <Flag className="h-3.5 w-3.5 text-cyan" /> START
          </span>
        </div>

        {/* Roadmap */}
        <div ref={trackRef} className="relative space-y-12 md:space-y-16">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/10" />
          <div
            className="absolute left-4 md:left-1/2 top-0 w-[3px] -translate-x-1/2 rounded-full"
            style={{
              height: `${progress * 100}%`,
              background: 'linear-gradient(to bottom, #00d4ff, #a855f7, #10b981)',
              boxShadow: '0 0 14px rgba(0,212,255,0.6)',
              transition: 'height 0.15s linear',
            }}
          />

          {roles.map((role, index) => (
            <RoleItem key={role.step} role={role} index={index} noTilt={noTilt} />
          ))}
        </div>

        {/* End marker */}
        <div className="relative mt-10 flex justify-start pl-1 md:justify-center md:pl-0">
          <span className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 font-mono text-xs tracking-widest text-emerald-300">
            <Rocket className="h-3.5 w-3.5" /> OPEN TO NEW OPPORTUNITIES
          </span>
        </div>
      </div>
    </section>
  );
};

export default Experience;
