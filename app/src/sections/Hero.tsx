import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  Mail,
  MessageCircle,
  ArrowUpRight,
  Code2,
  Coffee,
  Database,
  Zap,
  Github,
  Linkedin,
} from "lucide-react";
const profileImg = "/images/my1.png";

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

// Animated text component with typewriter effect
const AnimatedTitle = () => {
  const [text, setText] = useState("");
  const fullText = "Muzammil Abbas";
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => setShowSubtitle(true), 300);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight min-h-[1.2em] lg:whitespace-nowrap">
        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-300 bg-clip-text text-transparent">
          {text}
        </span>
        <span className="animate-pulse text-cyan-400">|</span>
      </h1>

      {/* Floating badges that appear after name */}
      <div className={`flex flex-wrap justify-center gap-3 transition-all duration-700 ${showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="group flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/30 bg-cyan/5 backdrop-blur-sm hover:bg-cyan/10 hover:border-cyan/50 transition-all duration-300 hover:scale-105">
          <Code2 className="w-4 h-4 text-cyan" />
          <span className="text-xs font-medium text-cyan/90">Full-Stack Developer</span>
        </div>
        <div className="group flex items-center gap-2 px-4 py-2 rounded-full border border-purple/30 bg-purple/5 backdrop-blur-sm hover:bg-purple/10 hover:border-purple/50 transition-all duration-300 hover:scale-105">
          <Coffee className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-medium text-purple-300">Java &amp; Spring Boot</span>
        </div>
        <div className="group flex items-center gap-2 px-4 py-2 rounded-full border border-emerald/30 bg-emerald/5 backdrop-blur-sm hover:bg-emerald/10 hover:border-emerald/50 transition-all duration-300 hover:scale-105">
          <Database className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-300">REST APIs &amp; MySQL</span>
        </div>
        <div className="group flex items-center gap-2 px-4 py-2 rounded-full border border-orange/30 bg-orange/5 backdrop-blur-sm hover:bg-orange/10 hover:border-orange/50 transition-all duration-300 hover:scale-105">
          <Zap className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-medium text-orange-300">n8n &amp; Agentic AI</span>
        </div>
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

      {/* Glow background */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-cyan/20 blur-[120px] animate-pulse" />
        <div className="absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-purple-500/20 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-blue-500/10 blur-[150px]" />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 w-full px-6 lg:px-12">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-24 lg:py-0">

          {/* LEFT SOCIAL LINKS */}
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
              href="https://www.linkedin.com/in/muzammilabbass?utm_source=share_via&utm_content=profile&utm_medium=member_android"
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
            {/* Available pill with animation */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/30 bg-cyan/10 text-cyan text-xs tracking-widest uppercase mb-8 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-cyan animate-ping" />
              Available for new projects
            </div>

            <AnimatedTitle />

            <p className="text-white/60 max-w-2xl mx-auto mb-10 text-base sm:text-lg mt-8 text-center text-balance leading-relaxed">
              Full-stack developer building robust REST APIs with{" "}
              <span className="text-cyan font-semibold whitespace-nowrap">Java &amp; Spring Boot</span>,
              scalable systems with{" "}
              <span className="text-purple-300 font-semibold">MySQL</span>, and intelligent
              automation with{" "}
              <span className="text-emerald-300 font-semibold whitespace-nowrap">n8n &amp; Agentic AI</span>.
              I turn complex business logic into fast, reliable,{" "}
              <span className="whitespace-nowrap">end-to-end</span> products — backend to frontend.
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

            {/* MOBILE SOCIAL LINKS — visible below lg */}
            <div className="lg:hidden -mt-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-cyan-400/40" />
                <p className="text-[10px] tracking-[0.35em] uppercase text-white/40">
                  Connect with me
                </p>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-purple-400/40" />
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {/* GitHub */}
                <a
                  href="https://github.com/Muzammil-Abbas1"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/35 backdrop-blur-xl text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300 hover:shadow-[0_0_25px_rgba(0,212,255,0.25)] active:scale-95"
                >
                  <Github className="w-5 h-5" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/muzammilabbass?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/35 backdrop-blur-xl text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-purple-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] active:scale-95"
                >
                  <Linkedin className="w-5 h-5" />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/923118911228"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/35 backdrop-blur-xl text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-emerald-300 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>

                {/* Upwork */}
                <a
                  href="https://www.upwork.com/freelancers/~01d8a382d9eac1d30c"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Upwork"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/35 backdrop-blur-xl text-white/70 font-bold transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/40 hover:bg-lime-500/10 hover:text-lime-300 hover:shadow-[0_0_25px_rgba(132,204,22,0.25)] active:scale-95"
                >
                  U
                </a>

                {/* Email */}
                <a
                  href="mailto:210muzammilabbas@gmail.com"
                  aria-label="Email"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/35 backdrop-blur-xl text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/10 hover:text-white hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] active:scale-95"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT PROFILE */}
          <div className="hidden lg:flex lg:col-span-3 justify-center">
            <div className="relative">
              {/* Status badge */}
              <div className="absolute -top-6 -left-6 z-10 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl px-4 py-2 animate-bounce" style={{ animationDuration: '3s' }}>
                <p className="text-[10px] tracking-widest uppercase text-white/50">
                  Status
                </p>
                <p className="text-xs font-semibold text-white/80 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
                  Active
                </p>
              </div>

              {/* Ring with rotating gradient */}
              <div className="relative h-64 w-64">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-spin" style={{ animationDuration: '8s' }} />
                <div className="absolute inset-[3px] rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center overflow-hidden">
                  <img
                    src={profileImg}
                    alt="Muzammil Abbas"
                    className="h-56 w-56 rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Outer subtle ring */}
              <div className="absolute inset-0 rounded-full border border-white/10 blur-[0.2px]" />

              {/* Orbiting dots */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s' }}>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan shadow-[0_0_10px_rgba(0,212,255,0.8)]" />
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
              </div>
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
