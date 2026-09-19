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
  SiMysql,
  SiPython,
  SiFlask,
  SiTensorflow,
  SiScikitlearn,
  SiPandas,
  SiN8N,
  SiGit,
  SiGithub,
  SiDocker,
  SiPostman,
} from 'react-icons/si';
import { FaCss3Alt, FaJava } from 'react-icons/fa';

interface Tech {
  name: string;
  Icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
}

const rowOne: Tech[] = [
  { name: 'HTML5', Icon: SiHtml5, color: '#E34F26' },
  { name: 'CSS3', Icon: FaCss3Alt, color: '#1572B6' },
  { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
  { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
  { name: 'React', Icon: SiReact, color: '#61DAFB' },
  { name: 'Tailwind CSS', Icon: SiTailwindcss, color: '#38BDF8' },
  { name: 'Node.js', Icon: SiNodedotjs, color: '#5FA04E' },
  { name: 'Java', Icon: FaJava, color: '#F89820' },
  { name: 'Spring Boot', Icon: SiSpringboot, color: '#6DB33F' },
  { name: 'MySQL', Icon: SiMysql, color: '#4479A1' },
];

const rowTwo: Tech[] = [
  { name: 'Python', Icon: SiPython, color: '#3776AB' },
  { name: 'Flask', Icon: SiFlask, color: '#FFFFFF' },
  { name: 'TensorFlow', Icon: SiTensorflow, color: '#FF6F00' },
  { name: 'scikit-learn', Icon: SiScikitlearn, color: '#F7931E' },
  { name: 'Pandas', Icon: SiPandas, color: '#E70488' },
  { name: 'n8n', Icon: SiN8N, color: '#EA4B71' },
  { name: 'Git', Icon: SiGit, color: '#F05032' },
  { name: 'GitHub', Icon: SiGithub, color: '#FFFFFF' },
  { name: 'Docker', Icon: SiDocker, color: '#2496ED' },
  { name: 'Postman', Icon: SiPostman, color: '#FF6C37' },
];

const Row = ({ items, duration }: { items: Tech[]; duration: number }) => (
  <div className="skills-mask overflow-hidden py-3">
    <div className="skills-track" style={{ animationDuration: `${duration}s` }}>
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          className={`skills-group ${copy === 1 ? 'skills-dup' : ''}`}
          aria-hidden={copy === 1}
        >
          {items.map(({ name, Icon, color }) => (
            <li
              key={name}
              title={name}
              className="skill-tile"
              style={{ '--c': color } as CSSProperties}
            >
              <Icon size={38} color={color} />
              <span className="sr-only">{name}</span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  </div>
);

const Skills = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative overflow-hidden py-20 bg-background"
    >
      <style>{`
        @keyframes skills-scroll-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .skills-mask { -webkit-mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent); mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent); }
        .skills-track { display: flex; width: max-content; animation: skills-scroll-right linear infinite; }
        .skills-mask:hover .skills-track { animation-play-state: paused; }
        .skills-group { display: flex; gap: 1.25rem; padding-right: 1.25rem; margin: 0; list-style: none; }
        .skill-tile { display: flex; align-items: center; justify-content: center; width: 5rem; height: 5rem; flex-shrink: 0; border-radius: 1.1rem; border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.03); backdrop-filter: blur(8px); transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease; }
        .skill-tile:hover { transform: translateY(-6px) scale(1.08); border-color: color-mix(in srgb, var(--c) 55%, transparent); box-shadow: 0 12px 30px -8px color-mix(in srgb, var(--c) 55%, transparent); }
        @media (max-width: 640px) { .skill-tile { width: 4.2rem; height: 4.2rem; } .skill-tile svg { width: 32px; height: 32px; } }
        @media (prefers-reduced-motion: reduce) {
          .skills-track { animation: none !important; width: auto; justify-content: center; }
          .skills-mask { -webkit-mask-image: none; mask-image: none; }
          .skills-group { flex-wrap: wrap; justify-content: center; padding-right: 0; }
          .skills-dup { display: none; }
          .skill-tile { transition: none; }
          .skill-tile:hover { transform: none; }
        }
      `}</style>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          className={`mb-12 text-center transition-all duration-700 motion-reduce:transition-none ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h2 className="mb-4 text-3xl font-bold text-gradient sm:text-4xl">My Skills</h2>
          <p className="text-lg text-muted-foreground">
            Technologies I use to build full-stack and AI-powered products
          </p>
        </div>
      </div>

      <div
        className={`transition-opacity duration-1000 motion-reduce:transition-none ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Row items={rowOne} duration={60} />
        <Row items={rowTwo} duration={75} />
      </div>
    </section>
  );
};

export default Skills;
