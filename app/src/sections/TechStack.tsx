import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ComponentType, MouseEvent } from 'react';
import {
  SiHtml5,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiTailwindcss,
  SiNodedotjs,
  SiSpringboot,
  SiFlask,
  SiMysql,
  SiN8N,
  SiPython,
  SiTensorflow,
  SiScikitlearn,
  SiPandas,
  SiGit,
  SiGithub,
  SiDocker,
  SiPostman,
} from 'react-icons/si';
import { FaCss3Alt, FaJava } from 'react-icons/fa';
import { Webhook } from 'lucide-react';

interface Tech {
  name: string;
  Icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
}

interface Layer {
  step: string;
  name: string;
  blurb: string;
  accent: string;
  items: Tech[];
}

const layers: Layer[] = [
  {
    step: '01',
    name: 'Frontend',
    blurb: 'Responsive, accessible interfaces',
    accent: '#00d4ff',
    items: [
      { name: 'HTML5', Icon: SiHtml5, color: '#E34F26' },
      { name: 'CSS3', Icon: FaCss3Alt, color: '#1572B6' },
      { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
      { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
      { name: 'React', Icon: SiReact, color: '#61DAFB' },
      { name: 'Tailwind', Icon: SiTailwindcss, color: '#38BDF8' },
    ],
  },
  {
    step: '02',
    name: 'Backend & APIs',
    blurb: 'Secure REST APIs and services',
    accent: '#10b981',
    items: [
      { name: 'Java', Icon: FaJava, color: '#F89820' },
      { name: 'Spring Boot', Icon: SiSpringboot, color: '#6DB33F' },
      { name: 'Node.js', Icon: SiNodedotjs, color: '#5FA04E' },
      { name: 'REST APIs', Icon: Webhook, color: '#10b981' },
      { name: 'Flask', Icon: SiFlask, color: '#FFFFFF' },
    ],
  },
  {
    step: '03',
    name: 'Database',
    blurb: 'Relational data modeling & queries',
    accent: '#f59e0b',
    items: [{ name: 'MySQL', Icon: SiMysql, color: '#4479A1' }],
  },
  {
    step: '04',
    name: 'AI & Automation',
    blurb: 'Agentic workflows and ML models',
    accent: '#a855f7',
    items: [
      { name: 'n8n', Icon: SiN8N, color: '#EA4B71' },
      { name: 'Python', Icon: SiPython, color: '#3776AB' },
      { name: 'TensorFlow', Icon: SiTensorflow, color: '#FF6F00' },
      { name: 'scikit-learn', Icon: SiScikitlearn, color: '#F7931E' },
      { name: 'Pandas', Icon: SiPandas, color: '#E70488' },
    ],
  },
  {
    step: '05',
    name: 'Tools & DevOps',
    blurb: 'Version control, containers, API testing',
    accent: '#f43f5e',
    items: [
      { name: 'Git', Icon: SiGit, color: '#F05032' },
      { name: 'GitHub', Icon: SiGithub, color: '#FFFFFF' },
      { name: 'Docker', Icon: SiDocker, color: '#2496ED' },
      { name: 'Postman', Icon: SiPostman, color: '#FF6C37' },
    ],
  },
];

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

const TechStack = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [spread, setSpread] = useState(0);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const coarse = useMediaQuery('(pointer: coarse)');
  const visible = seen || reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const el = stageRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (vh * 0.95 - rect.top) / (vh * 0.75);
      setSpread(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced || coarse || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    stageRef.current.style.setProperty('--ry', `${(-6 + x * 6).toFixed(2)}deg`);
    stageRef.current.style.setProperty('--rx', `${(10 - y * 5).toFixed(2)}deg`);
  };

  const handleLeave = () => {
    stageRef.current?.style.setProperty('--ry', '-6deg');
    stageRef.current?.style.setProperty('--rx', '10deg');
  };

  const s = reduced ? 1 : spread;

  return (
    <section
      ref={sectionRef}
      id="tech-stack"
      className="relative overflow-hidden bg-background px-4 py-20 sm:px-6 lg:px-8"
    >
      <style>{`
        .ts-stage { --rx: 10deg; --ry: -6deg; }
        .ts-slab { transition: opacity .8s ease, border-color .3s ease, box-shadow .3s ease; }
        .ts-slab:hover { border-color: color-mix(in srgb, var(--a) 55%, transparent); box-shadow: 0 30px 70px -25px color-mix(in srgb, var(--a) 60%, transparent); }
        .ts-chip { transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
        .ts-chip:hover { transform: translateY(-5px) scale(1.08); border-color: color-mix(in srgb, var(--c) 55%, transparent); box-shadow: 0 10px 26px -8px color-mix(in srgb, var(--c) 55%, transparent); }
        @keyframes ts-flow { 0% { top: 0; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .ts-dot { animation: ts-flow 4s ease-in-out infinite; }
        @media (min-width: 768px) {
          .ts-scene { perspective: 1500px; }
          .ts-stage { transform-style: preserve-3d; transform: rotateX(var(--rx)) rotateY(var(--ry)); transition: transform .25s ease-out; }
          .ts-slab { transform: translateZ(calc(var(--s) * var(--z))); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ts-stage, .ts-slab, .ts-chip { transition: none !important; }
          .ts-stage { transform: none !important; }
          .ts-slab { transform: none !important; }
          .ts-chip:hover { transform: none; }
          .ts-dot { animation: none; opacity: 0; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[20%] h-[40%] w-[40%] rounded-full bg-cyan/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-purple/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div
          className={`mb-14 text-center ${
            reduced ? '' : 'transition-all duration-700'
          } ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <h2 className="mb-4 text-3xl font-bold text-gradient sm:text-4xl">Technology Stack</h2>
          <p className="text-lg text-muted-foreground">
            The full stack, layer by layer, from the interface to the AI
          </p>
        </div>

        <div className="ts-scene" onMouseMove={handleMove} onMouseLeave={handleLeave}>
          <div
            ref={stageRef}
            className="ts-stage relative flex flex-col"
            style={
              {
                '--s': s,
                gap: `${(0.75 + s * 1.1).toFixed(2)}rem`,
              } as CSSProperties
            }
          >
            {/* Data-flow line running through every layer */}
            <div className="pointer-events-none absolute bottom-0 left-8 top-0 hidden w-px bg-white/10 md:block">
              <span
                className="ts-dot absolute -left-[3px] h-2 w-2 rounded-full bg-cyan"
                style={{ boxShadow: '0 0 12px #00d4ff' }}
              />
            </div>

            {layers.map((layer, i) => (
              <div
                key={layer.step}
                className="ts-slab relative overflow-hidden rounded-2xl border border-white/10 bg-card/80 p-5 backdrop-blur-xl sm:p-6"
                style={
                  {
                    '--a': layer.accent,
                    '--z': `${(i - 2) * 22}px`,
                    opacity: visible ? 1 : 0,
                    transitionDelay: reduced ? '0ms' : `${i * 120}ms`,
                  } as CSSProperties
                }
              >
                <div
                  className="absolute inset-y-0 left-0 w-1"
                  style={{ background: `linear-gradient(to bottom, ${layer.accent}, transparent)` }}
                />
                <div className="grid items-center gap-5 md:grid-cols-[210px_1fr] md:gap-8 md:pl-6">
                  <div>
                    <span
                      className="font-mono text-xs tracking-[0.3em]"
                      style={{ color: layer.accent }}
                    >
                      LAYER {layer.step}
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-foreground">{layer.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{layer.blurb}</p>
                  </div>

                  <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
                    {layer.items.map(({ name, Icon, color }) => (
                      <li
                        key={name}
                        title={name}
                        className="ts-chip flex w-[5.25rem] flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-3"
                        style={{ '--c': color } as CSSProperties}
                      >
                        <Icon size={30} color={color} />
                        <span className="text-center text-[11px] leading-tight text-foreground/80">
                          {name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
