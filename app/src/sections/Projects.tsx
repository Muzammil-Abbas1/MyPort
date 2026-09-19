import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, MouseEvent, TouchEvent } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Github } from "lucide-react";
import type { Project } from "@/types";

const projects: Project[] = [
  {
    id: "skin-atelier",
    title: "Skin Atelier — Clinic Website",
    tagline: "Elegant booking website for a premium dermatology & aesthetics clinic",
    problem:
      "The clinic needed a polished, trustworthy web presence that converts visitors into booked appointments",
    solution:
      "Designed and built a fast React + TypeScript site with smooth animations, service pages, and direct WhatsApp/booking CTAs",
    results:
      "Live production site with a professional brand feel, improved credibility, and a clear path from visit to booking",
    image: "/images/skin.png",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    liveDemo: "https://skin-atelier-website.vercel.app",
    github: "https://github.com/Muzammil-Abbas1/skin-atelier-website",
  },
  {
    id: "contact-manager",
    title: "Contact Management System",
    tagline: "Full-stack contact manager with secure authentication",
    problem:
      "Users need a secure, reliable way to store and manage personal contacts with proper access control",
    solution:
      "Built a Spring Boot + Spring Security backend (JWT, httpOnly cookies, CSRF protection, MySQL) with a React frontend for paginated CRUD contact management",
    results:
      "Secure register/login flow, fast contact search and editing, and a tested backend (JUnit/Mockito) verified with SonarQube",
    image: "/images/CMS.png",
    tech: ["Java", "Spring Boot", "Spring Security", "MySQL", "React", "JWT"],
    github: "https://github.com/Muzammil-Abbas1/cohort-9-java-14058-muhammad",
  },
  {
    id: "ecommerce-store",
    title: "Modern Ecommerce Store",
    tagline: "Full-stack ecommerce website with cart, checkout, and admin panel",
    problem: "Small businesses need an online store but most solutions are expensive and limited",
    solution:
      "Built a modern ecommerce system with product management, cart, checkout flow, and order tracking",
    results:
      "Responsive store UI, smooth shopping experience, and scalable product/order management",
    image: "/images/web1.png",
    tech: ["React", "Tailwind CSS", "Firebase", "Stripe"],
    liveDemo: "https://www.magic-plush.com/breathing-plush/breathing-plush-stitch-with-soothing-lullaby/",
    github: "#",
  },
  {
    id: "cv-filter",
    title: "CV Filter System for HR",
    tagline: "AI-powered resume screening and candidate ranking system",
    problem: "HR teams spend countless hours manually reviewing resumes",
    solution:
      "Built an intelligent system using NLP and ML to automatically screen and rank candidates",
    results: "Automated resume analysis, relevance scoring, and candidate recommendations",
    image: "/images/project-cv-filter.png",
    tech: ["Python", "Streamlit", "NLP", "Machine Learning"],
    liveDemo: "https://resume-matcher-hr.streamlit.app/",
    github: "https://github.com/Muzammil-Abbas1/resume-matcher-pro",
  },
  {
    id: "crypto-scalping-bot",
    title: "Algorithmic Crypto Trading Bot",
    tagline: "Technical analysis-based automated trading system",
    problem:
      "Crypto markets move 24/7 making manual monitoring impossible and emotional decisions costly",
    solution:
      "Developed a 3-layer filtering system: 15m EMA trend direction, 5m VWAP pullback zones, and 1m volume-confirmed entries with dynamic risk parameters",
    results:
      "Real-time trade signals with 5-level strictness control, interactive charts, and automated market analysis",
    image: "/images/pp1.png",
    tech: ["Python", "Streamlit", "ccxt", "Plotly", "Pandas", "NumPy"],
    github: "https://github.com/Muzammil-Abbas1/Crypto-Scalping-Bot",
  },
  {
    id: "chatbot",
    title: "Custom Business Chatbot",
    tagline: "AI-powered customer support automation",
    problem: "Businesses need 24/7 customer support but can't afford round-the-clock staff",
    solution:
      "Created intelligent chatbots that handle customer queries using NLP and contextual understanding",
    results: "Instant customer responses, improved engagement, reduced support costs",
    image: "/images/project-chatbot.png",
    tech: ["Python", "NLP", "Flask", "AI/ML"],
    github: "#",
  },
  {
    id: "web-scraper",
    title: "Smart Web Scraping Tool",
    tagline: "Automated scraping system for extracting structured data",
    problem:
      "Manually collecting data from websites is slow and error-prone for research and business needs",
    solution:
      "Built a scraping pipeline to extract, clean, and export data into CSV/Excel formats",
    results:
      "Automated data collection, fast exports, and reliable structured datasets",
    image: "/images/scrape.png",
    tech: ["Python", "BeautifulSoup", "Requests", "Pandas"],
    liveDemo: "#",
    github: "#",
  },
];

const accents = ["#00d4ff", "#a855f7", "#10b981", "#f59e0b", "#f43f5e", "#38bdf8", "#84cc16"];

const isLink = (url?: string) => !!url && url.trim() !== "#" && url.trim() !== "";

const displayUrl = (p: Project) => {
  const raw = isLink(p.liveDemo) ? p.liveDemo : isLink(p.github) ? p.github : "";
  if (!raw) return "private-project";
  try {
    const u = new URL(raw!.trim());
    return u.host + (u.pathname === "/" ? "" : u.pathname);
  } catch {
    return raw!;
  }
};

const pad = (n: number) => String(n).padStart(2, "0");

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
};

const Projects = () => {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [seen, setSeen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const touchX = useRef<number | null>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const coarse = useMediaQuery("(pointer: coarse)");
  const visible = seen || reduced;

  const project = projects[active];
  const accent = accents[active % accents.length];
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => setImgFailed(false), [active]);

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
    const el = chipsRef.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    const wrap = chipsRef.current;
    if (!el || !wrap || wrap.scrollWidth <= wrap.clientWidth) return;
    wrap.scrollTo({
      left: el.offsetLeft - wrap.clientWidth / 2 + el.clientWidth / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [active, reduced]);

  const go = (next: number) => {
    const n = (next + projects.length) % projects.length;
    if (n === active) return;
    setDir(n > active || (active === projects.length - 1 && n === 0) ? 1 : -1);
    setActive(n);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1);
    }
  };

  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
  };

  const onImgMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced || coarse || !imgRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    imgRef.current.style.transform = `translate3d(${(-x * 10).toFixed(1)}px, ${(-y * 6).toFixed(1)}px, 0) scale(1.05)`;
  };
  const onImgLeave = () => {
    if (imgRef.current) imgRef.current.style.transform = "translate3d(0,0,0) scale(1.01)";
  };

  const hasLive = isLink(project.liveDemo);
  const hasGit = isLink(project.github);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden bg-background px-4 py-20 sm:px-6 lg:px-8"
    >
      <style>{`
        @keyframes proj-in-next { from { opacity: 0; transform: perspective(1400px) translate3d(60px,0,-120px) rotateY(-10deg); } to { opacity: 1; transform: perspective(1400px) translate3d(0,0,0) rotateY(0); } }
        @keyframes proj-in-prev { from { opacity: 0; transform: perspective(1400px) translate3d(-60px,0,-120px) rotateY(10deg); } to { opacity: 1; transform: perspective(1400px) translate3d(0,0,0) rotateY(0); } }
        .proj-in-next { animation: proj-in-next .7s cubic-bezier(.2,.8,.2,1) both; }
        .proj-in-prev { animation: proj-in-prev .7s cubic-bezier(.2,.8,.2,1) both; }
        .proj-img { transform: translate3d(0,0,0) scale(1.01); transition: transform .5s ease-out; will-change: transform; }
        .proj-chips::-webkit-scrollbar { display: none; }
        .proj-chips { scrollbar-width: none; }
        @media (prefers-reduced-motion: reduce) {
          .proj-in-next, .proj-in-prev { animation: none; }
          .proj-img { transition: none; transform: none !important; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[-10%] top-[5%] h-[45%] w-[45%] rounded-full blur-[130px] transition-colors duration-700"
          style={{ background: `${accent}1f` }}
        />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-purple/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div
          className={`mb-12 text-center lg:mb-16 ${
            reduced ? "" : "transition-all duration-700"
          } ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <span className="mb-3 inline-block font-mono text-xs tracking-[0.35em] text-cyan">
            SELECTED WORK
          </span>
          <h2 className="mb-4 text-4xl font-extrabold text-white md:text-5xl">
            My <span className="text-cyan">Projects</span>
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            Real-world products across full-stack development, AI, and automation.
          </p>
        </div>

        <div
          className={`grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10 ${
            reduced ? "" : "transition-all duration-1000"
          } ${visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          {/* Project selector */}
          <div
            ref={chipsRef}
            role="tablist"
            aria-label="Projects"
            aria-orientation="vertical"
            onKeyDown={onKey}
            className="proj-chips -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-3 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {projects.map((p, i) => {
              const on = i === active;
              const a = accents[i % accents.length];
              return (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => go(i)}
                  style={
                    (on
                      ? { borderColor: `${a}99`, background: `${a}1a` }
                      : undefined) as CSSProperties
                  }
                  className={`group relative flex shrink-0 items-center gap-3 rounded-xl border px-4 py-2.5 text-left transition-all duration-300 motion-reduce:transition-none lg:w-full lg:gap-4 lg:p-4 ${
                    on
                      ? "lg:translate-x-2"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                  }`}
                >
                  <span
                    className="font-mono text-xs tracking-widest lg:text-sm"
                    style={{ color: on ? a : "rgba(255,255,255,0.35)" }}
                  >
                    {pad(i + 1)}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block whitespace-nowrap text-sm font-semibold lg:whitespace-normal lg:text-base ${
                        on ? "text-white" : "text-white/70"
                      }`}
                    >
                      {p.title}
                    </span>
                    <span className="mt-0.5 hidden truncate text-xs text-white/40 lg:block">
                      {p.tech.slice(0, 4).join(" · ")}
                    </span>
                  </span>
                  <ArrowUpRight
                    className={`ml-auto hidden h-4 w-4 shrink-0 transition-all lg:block ${
                      on ? "opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                    }`}
                    style={{ color: a }}
                  />
                  {on && (
                    <span
                      className="absolute inset-y-2 left-0 hidden w-[3px] rounded-full lg:block"
                      style={{ background: a }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Showcase */}
          <div
            className="relative"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Deck layers behind the card */}
            <div
              aria-hidden
              className="absolute inset-x-6 bottom-0 top-6 rounded-2xl border border-white/5 bg-white/[0.02] sm:inset-x-8"
              style={{ transform: "translateY(18px) scale(0.94)" }}
            />
            <div
              aria-hidden
              className="absolute inset-x-3 bottom-0 top-3 rounded-2xl border border-white/10 bg-white/[0.03] sm:inset-x-4"
              style={{ transform: "translateY(9px) scale(0.97)" }}
            />

            <div
              key={project.id}
              role="tabpanel"
              className={`relative overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl shadow-black/60 ${
                reduced ? "" : dir === 1 ? "proj-in-next" : "proj-in-prev"
              }`}
              style={{ boxShadow: `0 30px 80px -30px ${accent}55` }}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-3 border-b border-white/10 bg-black/40 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
                </div>
                <div className="min-w-0 flex-1 truncate rounded-md bg-white/5 px-3 py-1 text-center font-mono text-[11px] text-white/45">
                  {displayUrl(project)}
                </div>
                {hasLive && (
                  <span
                    className="hidden shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] sm:flex"
                    style={{ color: accent, background: `${accent}18` }}
                  >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: accent }} />
                    LIVE
                  </span>
                )}
              </div>

              {/* Preview */}
              <div
                className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-bg-tertiary to-black"
                onMouseMove={onImgMove}
                onMouseLeave={onImgLeave}
              >
                {!imgFailed && (
                  <img
                    ref={imgRef}
                    src={project.image}
                    alt={project.title}
                    onError={() => setImgFailed(true)}
                    className="proj-img h-full w-full object-cover object-top"
                  />
                )}
                {imgFailed && (
                  <div className="absolute inset-0 flex items-center justify-center text-6xl font-black text-white/10">
                    {project.title
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <span
                  className="absolute bottom-3 left-4 font-mono text-xs tracking-[0.3em]"
                  style={{ color: accent }}
                >
                  {pad(active + 1)} / {pad(projects.length)}
                </span>
              </div>

              {/* Details */}
              <div className="p-5 sm:p-7">
                <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">{project.tagline}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-white/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
                  {[
                    { label: "Problem", text: project.problem, color: "#f87171" },
                    { label: "Solution", text: project.solution, color: accent },
                    { label: "Results", text: project.results, color: "#4ade80" },
                  ].map((b) => (
                    <div key={b.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                      <span
                        className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-widest"
                        style={{ color: b.color }}
                      >
                        {b.label}
                      </span>
                      <p className="leading-relaxed text-muted-foreground">{b.text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  {hasLive ? (
                    <a
                      href={project.liveDemo!.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-black transition hover:opacity-90"
                      style={{ background: `linear-gradient(90deg, ${accent}, #a855f7)` }}
                    >
                      <ArrowUpRight className="h-4 w-4" /> Live Demo
                    </a>
                  ) : (
                    <span className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-white/5 px-5 py-3 text-sm font-bold text-white/30">
                      <ArrowUpRight className="h-4 w-4" /> Live Demo
                    </span>
                  )}
                  {hasGit ? (
                    <a
                      href={project.github.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/5"
                    >
                      <Github className="h-4 w-4" /> GitHub
                    </a>
                  ) : (
                    <span className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-white/30">
                      <Github className="h-4 w-4" /> Private repo
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="relative mt-10 flex items-center justify-between gap-4 sm:mt-12">
              <button
                onClick={() => go(active - 1)}
                aria-label="Previous project"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex flex-1 items-center justify-center gap-2">
                {projects.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => go(i)}
                    aria-label={`Show ${p.title}`}
                    className="h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none"
                    style={{
                      width: i === active ? 28 : 8,
                      background: i === active ? accent : "rgba(255,255,255,0.18)",
                    }}
                  />
                ))}
              </div>
              <button
                onClick={() => go(active + 1)}
                aria-label="Next project"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
