import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Briefcase } from "lucide-react";

const About = () => {
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
      id="about"
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden"
    >
      {/* Background Blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
            About <span className="text-cyan">Me</span>
          </h2>
          <div className="h-1.5 w-20 bg-cyan mx-auto rounded-full mt-4" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* LEFT: Portrait */}
          <div
            className={`lg:col-span-5 relative group transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            {/* Glow border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan to-purple rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

            {/* Image Card */}
            <div className="relative h-full overflow-hidden rounded-[1.8rem] bg-card/30 backdrop-blur-xl border border-white/10">
              <img
                src="/images/p1.png"
                alt="Muzammil Abbas"
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 ease-in-out scale-105 hover:scale-100"
              />
            </div>
          </div>

          {/* RIGHT: Cards */}
          <div
            className={`lg:col-span-7 flex flex-col gap-6 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            {/* Background Card */}
            <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                  <span className="text-cyan text-xl">{`</>`}</span>
                </div>
                <h3 className="text-2xl font-bold text-cyan">Background</h3>
              </div>

              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  I'm a{" "}
                  <span className="text-foreground font-semibold">
                    BS Computer Science student
                  </span>{" "}
                  with a strong foundation in web development, AI/ML, and
                  financial technology. My passion lies in building intelligent
                  systems that solve real-world problems and create meaningful
                  impact.
                </p>
                <p>
                  I specialize in developing{" "}
                  <span className="text-foreground font-medium">
                    AI-powered solutions
                  </span>
                  , from automated trading systems to intelligent chatbots and
                  data-driven applications. My work combines technical expertise
                  with practical problem-solving to deliver innovative solutions.
                </p>
              </div>
            </div>

            {/* Bottom 2 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* Education */}
              <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-8 shadow-lg flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-purple" />
                  </div>
                  <h4 className="text-xl font-bold text-purple">Education</h4>
                </div>

                <div className="mt-auto">
                  <p className="text-foreground font-bold text-lg mb-1">
                    Bachelor of Science
                  </p>
                  <p className="text-foreground font-bold text-lg mb-3">
                    in Computer Science
                  </p>

                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm font-medium">
                      Ibadat International University, Islamabad
                    </p>
                    <p className="text-cyan font-mono text-sm font-bold">
                      2023 - Present
                    </p>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="rounded-3xl border border-white/10 bg-black/30 backdrop-blur-xl p-8 shadow-lg flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-400/10 border border-green-400/20 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="text-xl font-bold text-green-400">
                    Current Status
                  </h4>
                </div>

                <div className="flex-grow">
                  <p className="text-foreground font-bold text-lg mb-2">
                    Available for Freelance & Contract Work
                  </p>
                  <p className="text-muted-foreground text-sm leading-snug">
                    Specializing in AI/ML solutions, web development, and FinTech
                    projects
                  </p>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={() =>
                      window.open("https://wa.me/923118911228", "_blank")
                    }
                    className="w-full py-6 rounded-xl text-white font-bold bg-gradient-to-r from-cyan to-purple hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-cyan/20"
                  >
                    Hire Me Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
