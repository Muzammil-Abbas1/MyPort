import { useEffect, useRef, useState } from 'react';

interface Skill {
  name: string;
  percentage: number;
  icon: string;
}

const skills: Skill[] = [
  { name: 'Python & ML/AI', percentage: 75, icon: '🐍' },
  { name: 'JavaScript', percentage: 75, icon: '⚛️' },
  { name: 'HTML & CSS', percentage: 85, icon: '🎨' },
  { name: 'Flask & Backend', percentage: 70, icon: '🔧' },
  { name: 'TensorFlow & NLP', percentage: 75, icon: '🧠' },
  { name: 'Git & DevOps', percentage: 80, icon: '🚀' },
];

const SkillBar = ({ skill, index, isVisible }: { skill: Skill; index: number; isVisible: boolean }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setWidth(skill.percentage);
      }, index * 150 + 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, skill.percentage, index]);

  return (
    <div 
      className={`bg-card border border-border rounded-xl p-6 hover-lift transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{skill.icon}</span>
          <span className="font-semibold text-foreground">{skill.name}</span>
        </div>
        <span className="text-cyan font-bold text-lg">{skill.percentage}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan to-cyan-dark rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="skills" 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gradient mb-4 ">
            My Skills
          </h2>
          <p className="text-muted-foreground text-lg">
            Expertise in modern technologies with a focus on AI/ML and web development
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill, index) => (
            <SkillBar 
              key={skill.name} 
              skill={skill} 
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
