import { useEffect, useState } from 'react';

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      const scrollProgress = (scrollTop / documentHeight) * 100;
      setProgress(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed right-0 top-0 h-full w-1 bg-border z-50">
      <div 
        className="w-full bg-gradient-to-b from-cyan to-purple transition-all duration-150"
        style={{ 
          height: `${progress}%`,
          boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)'
        }}
      />
    </div>
  );
};

export default ScrollProgress;
