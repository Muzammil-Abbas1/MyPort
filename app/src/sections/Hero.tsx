import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";



const AnimatedGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const gridSize = 50;
    let offset = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2 + mouseRef.current.x * 30;
      const centerY = canvas.height / 2 + mouseRef.current.y * 20;

      ctx.lineWidth = 1;

      for (let i = -20; i <= 20; i++) {
        const y = centerY + i * gridSize + (offset % gridSize);
        const depth = 1 + Math.abs(i) * 0.1;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 / depth})`;
        ctx.stroke();
      }

      for (let i = -30; i <= 30; i++) {
        const x = centerX + i * gridSize;
        const depth = 1 + Math.abs(i) * 0.05;

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 / depth})`;
        ctx.stroke();
      }

      const time = Date.now() * 0.001;
      for (let i = 0; i < 30; i++) {
        const px =
          centerX +
          Math.sin(time * 0.5 + i * 0.5) * 200 +
          Math.cos(time * 0.3 + i) * 100;
        const py =
          centerY +
          Math.cos(time * 0.4 + i * 0.7) * 150 +
          Math.sin(time * 0.6 + i) * 80;
        const size = 2 + Math.sin(time + i) * 1;
        const alpha = 0.3 + Math.sin(time * 2 + i) * 0.2;

        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${alpha * 0.2})`;
        ctx.fill();
      }

      offset += 0.2;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

const StatCard = ({
  value,
  label,
  delay,
}: {
  value: string;
  label: string;
  delay: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-6 text-center transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="text-3xl md:text-4xl font-bold text-cyan mb-2">
        {value}
      </div>
      <div className="text-xs tracking-widest text-muted-foreground uppercase">
        {label}
      </div>
    </div>
  );
};

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-black flex items-center">
      <AnimatedGrid />

      {/* Glow background like picture */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-cyan/20 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-purple-500/20 blur-[120px]" />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 w-full px-6 lg:px-12">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

         {/* LEFT SOCIAL LINKS (COLUMN, SEPARATE CARDS) */}
<div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
  
  {/* GitHub */}
  <a
    href="https://github.com/Muzammil-Abbas1"
    target="_blank"
    rel="noreferrer"
    className="group rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:shadow-[0_0_35px_rgba(0,212,255,0.15)]"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 group-hover:text-cyan-300 group-hover:border-cyan-400/30 group-hover:bg-cyan-400/10 transition">
          <Github className="w-5 h-5" />
        </div>

        <div>
          <p className="text-sm font-semibold text-white/85">GitHub</p>
          <p className="text-xs text-white/40">Open my repositories</p>
        </div>
      </div>

      <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-cyan-300 transition" />
    </div>
  </a>

  {/* LinkedIn */}
  <a
    href="https://linkedin.com/in/yourusername"
    target="_blank"
    rel="noreferrer"
    className="group rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/30 hover:bg-purple-500/10 hover:shadow-[0_0_35px_rgba(168,85,247,0.15)]"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 group-hover:text-purple-300 group-hover:border-purple-400/30 group-hover:bg-purple-500/10 transition">
          <Linkedin className="w-5 h-5" />
        </div>

        <div>
          <p className="text-sm font-semibold text-white/85">LinkedIn</p>
          <p className="text-xs text-white/40">Professional profile</p>
        </div>
      </div>

      <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-purple-300 transition" />
    </div>
  </a>

  {/* WhatsApp */}
  <a
    href="https://wa.me/923118911228"
    target="_blank"
    rel="noreferrer"
    className="group rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:shadow-[0_0_35px_rgba(16,185,129,0.15)]"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 group-hover:text-emerald-300 group-hover:border-emerald-400/30 group-hover:bg-emerald-500/10 transition">
          <MessageCircle className="w-5 h-5" />
        </div>

        <div>
          <p className="text-sm font-semibold text-white/85">WhatsApp</p>
          <p className="text-xs text-white/40">Fastest way to reach me</p>
        </div>
      </div>

      <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-emerald-300 transition" />
    </div>
  </a>

  {/* Upwork */}
  <a
    href="https://www.upwork.com/freelancers/~01d8a382d9eac1d30c"
    target="_blank"
    rel="noreferrer"
    className="group rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/30 hover:bg-lime-500/10 hover:shadow-[0_0_35px_rgba(132,204,22,0.15)]"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Upwork icon replacement */}
        <div className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 group-hover:text-lime-300 group-hover:border-lime-400/30 group-hover:bg-lime-500/10 transition font-bold">
          U
        </div>

        <div>
          <p className="text-sm font-semibold text-white/85">Upwork</p>
          <p className="text-xs text-white/40">Hire me for projects</p>
        </div>
      </div>

      <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-lime-300 transition" />
    </div>
  </a>

  {/* Email */}
  <a
    href="mailto:210muzammilabbas@gmail.com"
    className="group rounded-2xl border border-white/10 bg-black/35 backdrop-blur-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/5 hover:shadow-[0_0_35px_rgba(255,255,255,0.08)]"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 group-hover:text-white group-hover:border-white/20 group-hover:bg-white/10 transition">
          <Mail className="w-5 h-5" />
        </div>

        <div>
          <p className="text-sm font-semibold text-white/85">Email</p>
          <p className="text-xs text-white/40">Send me a message</p>
        </div>
      </div>

      <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white transition" />
    </div>
  </a>
</div>


          {/* CENTER CONTENT */}
          <div className="lg:col-span-6 text-center">
            {/* Available pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/30 bg-cyan/10 text-cyan text-xs tracking-widest uppercase mb-6">
              <span className="h-2 w-2 rounded-full bg-cyan" />
              Available for new projects
            </div>

            

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-300 bg-clip-text text-transparent">
                Muzammil Abbas
              </span>
              
            </h1>

            <p className="text-cyan text-sm sm:text-base tracking-[0.35em] uppercase mb-6 ">
              AI/ML Enthusiast  |  Frontend Developer
            </p>

            <p className="text-white/60 max-w-2xl mx-auto mb-10 text-base sm:text-lg">
              Architecting the next generation of{" "}
              <span className="text-white/80 font-semibold">
                intelligent systems
              </span>
              . Focused on building AI-powered applications and modern, high-performance web apps.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <Button
                size="lg"
                className="bg-cyan text-black font-semibold px-8 py-6 rounded-xl hover:scale-[1.02] transition-transform hover:shadow-[0_0_30px_rgba(0,212,255,0.35)]"
                onClick={() => scrollToSection("contact")}
              >
                LET&apos;S CONNECT
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white/15 text-white hover:bg-white/5 px-8 py-6 rounded-xl hover:scale-[1.02] transition-transform"
                onClick={() => scrollToSection("projects")}
              >
                VIEW MY WORK
              </Button>
            </div>

            {/* Stats like picture */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 ">
                <StatCard value="2+" label="Years Learning & Building" delay={1200} />
                <StatCard value="15+" label="Projects Completed" delay={1400} />
                <StatCard value="10+" label="Web Apps Built" delay={1600} />
                <StatCard value="30k+" label="Lines of Code" delay={1800} />
           </div>

          </div>

          {/* RIGHT PROFILE */}
          <div className="hidden lg:flex lg:col-span-3 justify-center">
            <div className="relative">
              {/* Status badge */}
              <div className="absolute -top-6 -left-6 z-10 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl px-4 py-2">
                <p className="text-[10px] tracking-widest uppercase text-white/50">
                  Status
                </p>
                <p className="text-xs font-semibold text-white/80 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan" />
                  Active
                </p>
              </div>

              {/* Ring */}
              <div className="h-64 w-64 rounded-full p-[3px] bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_60px_rgba(168,85,247,0.25)]">
                <div className="h-full w-full rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center overflow-hidden">
                  {/* Replace with your image */}
                  <img
                      src="images/my1.png"
                      alt="Muzammil Abbas"
                     className="h-56 w-56 rounded-full object-cover"
                     />

                </div>
              </div>

              {/* Outer subtle ring */}
              <div className="absolute inset-0 rounded-full border border-white/10 blur-[0.2px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer z-20"
        onClick={() => scrollToSection("projects")}
      >
        <ChevronDown className="w-8 h-8 text-cyan/50" />
      </div>
    </section>
  );
};

export default Hero;
