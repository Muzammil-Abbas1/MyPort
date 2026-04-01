import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';

const Experience = () => {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const responsibilities = [
    'Data cleaning, normalization, and visualization for ML models',
    'Developed House Price Prediction Model using Python',
    'Collaborated on testing and evaluating model performance',
    'Gained hands-on experience in AI/ML project management',
  ];

  return (
    <section 
      ref={sectionRef}
      id="experience" 
      className="py-20 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gradient mb-4">
            Work Experience
          </h2>
          <p className="text-muted-foreground text-lg">
            Professional journey and achievements
          </p>
        </div>

        {/* Experience Card */}
        <div 
          className={`bg-card border border-border rounded-xl overflow-hidden hover-lift transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}
        >
          {/* Left accent border */}
          <div className="flex">
            <div className="w-1 bg-gradient-to-b from-cyan to-cyan-dark" />
            
            <div className="flex-1 p-6 sm:p-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-cyan mb-1">
                    AI/ML Engineer Intern
                  </h3>
                  <p className="text-muted-foreground">
                    Developer Hub Corporation - Remote
                  </p>
                </div>
                <Badge className="bg-purple/20 text-purple border-purple/30 w-fit">
                  6 Months
                </Badge>
              </div>

              {/* Responsibilities */}
              <ul className="space-y-3">
                {responsibilities.map((item, index) => (
                  <li 
                    key={index}
                    className={`flex items-start gap-3 transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${400 + index * 100}ms` }}
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
