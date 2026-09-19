import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, TouchEvent } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Github, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
const N = projects.length;
const HALF = Math.floor(N / 2);

const isLink = (url?: string) => !!url && url.trim() !== "#" && url.trim() !== "";
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

const Thumb = ({ project }: { project: Project }) => {
  const [failed, setFailed] = useState(false);
  return (
    <>
      {!failed && (
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          draggable={false}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      )}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center text-5xl font-black text-white/10">
          {project.title
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </div>
      )}
    </>
  );
};

const Projects = () => {
  const [active, setActive] = useState(0);
  const [detail, setDetail] = useState<number | null>(null);
  const [seen, setSeen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const touchX = useRef<number | null>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const visible = seen || reduced;
  const accent = accents[active % accents.length];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const go = (next: number) => setActive(((next % N) + N) % N);

  const offsetOf = (i: number) => {
    let o = (i - active) % N;
    if (o > HALF) o -= N;
    if (o < -HALF) o += N;
    return o;
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === "ArrowLeft") {
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
    if (Math.abs(dx) > 45) go(active + (dx < 0 ? 1 : -1));
  };

  const d = detail === null ? null : projects[detail];
  const dAccent = detail === null ? accent : accents[detail % accents.length];

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-x-clip overflow-y-visible bg-background px-4 py-14 sm:px-6 lg:px-8"
    >
      <style>{`
        .pj-stage { --cw: min(84vw, 340px); --step: calc(var(--cw) * .9); height: clamp(430px, 62svh, 520px); perspective: 1600px; }
        @media (min-width: 768px) { .pj-stage { --cw: 400px; --step: 330px; } }
        @media (min-width: 1280px) { .pj-stage { --cw: 440px; --step: 370px; } }
        .pj-card { position: absolute; top: 0; left: 50%; width: var(--cw); height: 100%; margin-left: calc(var(--cw) / -2); transition: transform .7s cubic-bezier(.22,.8,.24,1), opacity .5s ease, filter .5s ease; will-change: transform; }
        @media (prefers-reduced-motion: reduce) { .pj-card { transition: none; } }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[55%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] transition-colors duration-700"
          style={{ background: `${accent}1c` }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl">
        <div
          className={`mb-6 text-center sm:mb-8 ${
            reduced ? "" : "transition-all duration-700"
          } ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          <span className="mb-2 inline-block font-mono text-[11px] tracking-[0.35em] text-cyan">
            SELECTED WORK
          </span>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            My <span className="text-cyan">Projects</span>
          </h2>
        </div>

        {/* Carousel */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Projects"
          tabIndex={0}
          onKeyDown={onKey}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className={`pj-stage relative outline-none ${
            reduced ? "" : "transition-opacity duration-1000"
          } ${visible ? "opacity-100" : "opacity-0"}`}
          style={{ touchAction: "pan-y" }}
        >
          {projects.map((p, i) => {
            const o = offsetOf(i);
            const a = Math.abs(o);
            const on = o === 0;
            const c = accents[i % accents.length];
            const hasLive = isLink(p.liveDemo);
            const hasGit = isLink(p.github);
            return (
              <article
                key={p.id}
                aria-hidden={!on}
                aria-label={`${i + 1} of ${N}: ${p.title}`}
                className="pj-card"
                style={{
                  transform: `translateX(calc(${o} * var(--step))) translateZ(${-a * 130}px) scale(${
                    1 - a * 0.08
                  })`,
                  opacity: a === 0 ? 1 : a === 1 ? 0.55 : a === 2 ? 0.22 : 0,
                  filter: on ? "none" : `brightness(${1 - a * 0.22})`,
                  zIndex: 10 - a,
                  pointerEvents: a > 2 ? "none" : "auto",
                }}
              >
                <div
                  className="relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card"
                  style={{
                    borderColor: on ? `${c}66` : "rgba(255,255,255,0.1)",
                    boxShadow: on ? `0 30px 70px -30px ${c}80` : "0 20px 50px -30px #000",
                  }}
                >
                  {/* Preview */}
                  <div className="relative min-h-0 flex-1 overflow-hidden bg-gradient-to-br from-bg-tertiary to-black">
                    <Thumb project={p} />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    <span
                      className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] tracking-widest backdrop-blur"
                      style={{ color: c }}
                    >
                      {pad(i + 1)} / {pad(N)}
                    </span>
                    {hasLive && (
                      <span
                        className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] tracking-widest backdrop-blur"
                        style={{ color: c }}
                      >
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full motion-reduce:animate-none" style={{ background: c }} />
                        LIVE
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex shrink-0 flex-col gap-3 p-4 sm:p-5">
                    <div>
                      <h3 className="line-clamp-1 text-lg font-bold text-white sm:text-xl">
                        {p.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-[13px] leading-snug text-muted-foreground sm:text-sm">
                        {p.tagline}
                      </p>
                    </div>

                    <div className="flex h-6 gap-1.5 overflow-hidden">
                      {p.tech.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-white/75"
                        >
                          {t}
                        </span>
                      ))}
                      {p.tech.length > 4 && (
                        <span className="shrink-0 px-1 py-0.5 font-mono text-[11px] text-white/40">
                          +{p.tech.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                      {hasLive ? (
                        <a
                          href={p.liveDemo!.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={on ? 0 : -1}
                          className="flex h-10 items-center justify-center gap-1.5 rounded-lg text-xs font-bold text-black transition hover:opacity-90 sm:text-sm"
                          style={{ background: `linear-gradient(90deg, ${c}, #a855f7)` }}
                        >
                          <ArrowUpRight className="h-4 w-4" /> Live
                        </a>
                      ) : (
                        <span className="flex h-10 cursor-not-allowed items-center justify-center gap-1.5 rounded-lg bg-white/5 text-xs font-bold text-white/30 sm:text-sm">
                          <ArrowUpRight className="h-4 w-4" /> Live
                        </span>
                      )}
                      {hasGit ? (
                        <a
                          href={p.github.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={on ? 0 : -1}
                          className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-white/20 text-xs font-bold text-white transition hover:bg-white/5 sm:text-sm"
                        >
                          <Github className="h-4 w-4" /> Code
                        </a>
                      ) : (
                        <span className="flex h-10 cursor-not-allowed items-center justify-center gap-1.5 rounded-lg border border-white/10 text-xs font-bold text-white/30 sm:text-sm">
                          <Github className="h-4 w-4" /> Private
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setDetail(i)}
                        tabIndex={on ? 0 : -1}
                        aria-label={`Details for ${p.title}`}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white transition hover:bg-white/5"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {!on && a <= 2 && (
                    <button
                      type="button"
                      aria-label={`Show ${p.title}`}
                      onClick={() => go(i)}
                      className="absolute inset-0 z-20 cursor-pointer"
                    />
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-5">
          <button
            onClick={() => go(active - 1)}
            aria-label="Previous project"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => go(i)}
                aria-label={`Show ${p.title}`}
                aria-current={i === active}
                className="h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none"
                style={{
                  width: i === active ? 26 : 8,
                  background: i === active ? accent : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
          <button
            onClick={() => go(active + 1)}
            aria-label="Next project"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 active:scale-95 motion-reduce:transition-none motion-reduce:transform-none"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Case study dialog */}
      <Dialog open={detail !== null} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-h-[88svh] overflow-y-auto border-white/10 bg-card sm:max-w-xl">
          {d && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-extrabold text-white">{d.title}</DialogTitle>
                <DialogDescription>{d.tagline}</DialogDescription>
              </DialogHeader>

              <div className="flex flex-wrap gap-2">
                {d.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-white/80"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="space-y-3 text-sm">
                {[
                  { label: "Problem", text: d.problem, color: "#f87171" },
                  { label: "Solution", text: d.solution, color: dAccent },
                  { label: "Results", text: d.results, color: "#4ade80" },
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Projects;
