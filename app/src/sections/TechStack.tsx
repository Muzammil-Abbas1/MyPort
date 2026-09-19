import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ComponentType } from 'react';
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
  SiSupabase,
  SiFirebase,
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
    blurb: 'SQL databases and backend-as-a-service',
    accent: '#f59e0b',
    items: [
      { name: 'MySQL', Icon: SiMysql, color: '#4479A1' },
      { name: 'Supabase', Icon: SiSupabase, color: '#3FCF8E' },
      { name: 'Firebase', Icon: SiFirebase, color: '#FFCA28' },
    ],
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

const BASE_TOP = 112;
const STEP_TOP = 22;

const TechStack = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [seen, setSeen] = useState(false);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const desktop = useMediaQuery('(min-width: 768px)');
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
    const inners = innerRefs.current;
    const reset = () =>
      inners.forEach((el) => {
        if (!el) return;
        el.style.transform = '';
        el.style.filter = '';
      });

    if (reduced || !desktop) {
      reset();
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const n = layers.length;
      // progress (0..1) of layer k+1 sliding up to cover layer k
      const cover: number[] = [];
      for (let k = 0; k < n - 1; k++) {
        const next = itemRefs.current[k + 1];
        if (!next) {
          cover.push(0);
          continue;
        }
        const stickyTop = BASE_TOP + (k + 1) * STEP_TOP;
        const t = (vh - next.getBoundingClientRect().top) / (vh - stickyTop);
        cover.push(Math.min(1, Math.max(0, t)));
      }
      for (let i = 0; i < n; i++) {
        const el = inners[i];
        if (!el) continue;
        let depth = 0;
        for (let k = i; k < n - 1; k++) depth += cover[k];
        el.style.transform = `scale(${(1 - depth * 0.035).toFixed(4)})`;
        el.style.filter = `brightness(${(1 - Math.min(depth, 3) * 0.13).toFixed(3)})`;
      }
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
      reset();
    };
  }, [reduced, desktop]);

  return (
    <section
      ref={sectionRef}
      id="tech-stack"
      className="relative overflow-clip bg-background px-4 py-20 sm:px-6 lg:px-8"
    >
      <style>{`
        .ts-inner { transform-origin: top center; will-change: transform, filter; }
        .ts-item { position: relative; margin-bottom: 1.25rem; }
        .ts-card { transition: border-color .3s ease, box-shadow .3s ease; }
        .ts-card:hover { border-color: color-mix(in srgb, var(--a) 55%, transparent); box-shadow: 0 30px 70px -25px color-mix(in srgb, var(--a) 60%, transparent); }
        .ts-chip { transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
        .ts-chip:hover { transform: translateY(-5px) scale(1.06); border-color: color-mix(in srgb, var(--c) 55%, transparent); box-shadow: 0 10px 26px -8px color-mix(in srgb, var(--c) 55%, transparent); }
        @media (min-width: 768px) {
          .ts-item { position: sticky; top: var(--top); margin-bottom: 22vh; }
          .ts-item:last-child { margin-bottom: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ts-item { position: relative; top: auto; margin-bottom: 1.25rem; }
          .ts-card, .ts-chip { transition: none; }
          .ts-chip:hover { transform: none; }
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

        <div>
          {layers.map((layer, i) => (
            <div
              key={layer.step}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="ts-item"
              style={{ '--top': `${BASE_TOP + i * STEP_TOP}px`, zIndex: i + 1 } as CSSProperties}
            >
              <div
                ref={(el) => {
                  innerRefs.current[i] = el;
                }}
                className="ts-inner"
              >
                <div
                  className="ts-card relative overflow-hidden rounded-2xl border border-white/10 bg-card p-6 shadow-2xl shadow-black/50 sm:p-8"
                  style={{ '--a': layer.accent } as CSSProperties}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{
                      background: `linear-gradient(to right, transparent, ${layer.accent}, transparent)`,
                    }}
                  />
                  <span
                    className="pointer-events-none absolute -right-2 -top-6 select-none font-mono text-[7rem] font-black leading-none opacity-[0.06]"
                    style={{ color: layer.accent }}
                  >
                    {layer.step}
                  </span>

                  <div className="relative grid items-center gap-6 md:grid-cols-[220px_1fr] md:gap-10">
                    <div>
                      <span
                        className="font-mono text-xs tracking-[0.3em]"
                        style={{ color: layer.accent }}
                      >
                        LAYER {layer.step}
                      </span>
                      <h3 className="mt-1 text-2xl font-bold text-foreground">{layer.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{layer.blurb}</p>
                    </div>

                    <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
                      {layer.items.map(({ name, Icon, color }) => (
                        <li
                          key={name}
                          title={name}
                          className="ts-chip flex w-[5.5rem] flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-3.5"
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
