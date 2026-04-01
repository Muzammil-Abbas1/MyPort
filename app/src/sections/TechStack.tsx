import { useEffect, useRef, useState } from 'react';
import { FileCode, Palette, Zap, Component, Server, Brain, BarChart3, Database } from 'lucide-react';

interface TechCategory {
  name: string;
  items: {
    name: string;
    description: string;
    icon: React.ReactNode;
  }[];
}

const techCategories: TechCategory[] = [
  {
    name: 'Frontend Development',
    items: [
      { name: 'HTML5', description: 'Semantic markup', icon: <FileCode className="w-6 h-6" /> },
      { name: 'CSS3', description: 'Modern styling', icon: <Palette className="w-6 h-6" /> },
      { name: 'JavaScript', description: 'Interactive UI', icon: <Zap className="w-6 h-6" /> },
      { name: 'React.js', description: 'Component library', icon: <Component className="w-6 h-6" /> },
    ],
  },
  {
    name: 'Backend Development',
    items: [
      { name: 'Python', description: 'Core language', icon: <Server className="w-6 h-6" /> },
      { name: 'Flask', description: 'Web framework', icon: <Server className="w-6 h-6" /> },
    ],
  },
  {
    name: 'AI & Machine Learning',
    items: [
      { name: 'TensorFlow', description: 'Deep learning', icon: <Brain className="w-6 h-6" /> },
      { name: 'Scikit-learn', description: 'ML algorithms', icon: <BarChart3 className="w-6 h-6" /> },
      { name: 'Pandas', description: 'Data analysis', icon: <Database className="w-6 h-6" /> },
    ],
  },
];

const TechStack = () => {
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
      id="tech-stack" 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gradient mb-4">
            Technology Stack
          </h2>
          <p className="text-muted-foreground text-lg">
            Building modern solutions with cutting-edge technologies
          </p>
        </div>

        {/* Tech Categories */}
        <div className="space-y-10">
          {techCategories.map((category, categoryIndex) => (
            <div 
              key={category.name}
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${categoryIndex * 200}ms` }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-0.5 bg-cyan" />
                <h3 className="text-xl font-semibold text-cyan">{category.name}</h3>
              </div>

              {/* Tech Items */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={item.name}
                    className="group bg-card border border-border rounded-xl p-6 text-center hover-lift cursor-pointer transition-all duration-300"
                    style={{ 
                      transitionDelay: `${categoryIndex * 200 + itemIndex * 100}ms`,
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                    }}
                  >
                    <div className="flex justify-center mb-3 text-cyan group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
