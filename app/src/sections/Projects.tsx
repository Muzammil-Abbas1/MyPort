import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import type { Project } from "@/types";

const projects: Project[] = [
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

  // ✅ KEEP chatbot
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

  // ✅ KEEP crypto bot
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
    github: "https://github.com/Muzammil-Abbas1/Crypto-Scalping-Bot ",
  },

  // ❌ REMOVED: trading-bot (LSTM)

  // ✅ NEW #1: Web-based Ecommerce
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

 

  // ✅ NEW #3: Web Scraping
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

  // ✅ NEW #4: Skin Atelier clinic website
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

  // ✅ NEW #5: Contact Management System
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
];

const openLink = (url?: string) => {
  if (!url || url === "#") return;
  window.open(url, "_blank", "noopener,noreferrer");
};

const ProjectCard = ({
  project,
  index,
  isVisible,
}: {
  project: Project;
  index: number;
  isVisible: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`min-w-[85vw] sm:min-w-[340px] md:min-w-[420px] snap-center transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="group relative rounded-[2rem] overflow-hidden border border-white/10 bg-black/30 backdrop-blur-xl shadow-xl transition-all duration-500 hover:-translate-y-1 hover:border-cyan/30">
        {/* Card Glow */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-cyan/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-purple/20 blur-3xl" />
        </div>

        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-bg-tertiary to-black">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement
                ?.querySelector(".image-fallback")
                ?.classList.remove("hidden");
            }}
          />
          <div className="image-fallback hidden absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-black tracking-tight text-white/15 select-none">
              {project.title
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>

        {/* Body */}
        <div className="relative p-8 flex flex-col">
          <h3 className="text-2xl font-extrabold tracking-tight text-cyan drop-shadow-[0_0_12px_rgba(6,182,212,0.45)]">
            {project.title}
          </h3>

          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {project.tagline}
          </p>

          {/* Tech Pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tech.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan"
              >
                {t}
              </span>
            ))}
            {project.tech.length > 3 && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
                +{project.tech.length - 3}
              </span>
            )}
          </div>

          {/* Expand Button */}
          <button
            onClick={() => setExpanded((p) => !p)}
            className="mt-6 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground transition hover:bg-white/10"
          >
            <span className="font-semibold">More details</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                expanded ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* Expanded Area */}
          <div
            className={`overflow-hidden transition-all duration-500 ${
              expanded ? "max-h-[650px] opacity-100 mt-5" : "max-h-0 opacity-0 mt-0"
            }`}
          >
            <div className="flex flex-wrap gap-2 mb-5">
              {project.tech.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="bg-cyan/10 text-cyan border border-cyan/20"
                >
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-red-400">Problem: </span>
                {project.problem}
              </p>
              <p>
                <span className="font-semibold text-cyan">Solution: </span>
                {project.solution}
              </p>
              <p>
                <span className="font-semibold text-green-400">Results: </span>
                {project.results}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-7 grid grid-cols-2 gap-4">
            <Button
              className={`w-full font-bold ${
                project.liveDemo && project.liveDemo !== "#"
                  ? "bg-gradient-to-r from-cyan to-purple text-white hover:opacity-90"
                  : "bg-white/5 text-muted-foreground cursor-not-allowed"
              }`}
              onClick={() => openLink(project.liveDemo)}
              disabled={!project.liveDemo || project.liveDemo === "#"}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Live Demo
            </Button>

            <Button
              variant="outline"
              className={`w-full font-bold ${
                project.github && project.github !== "#"
                  ? "border-white/20 text-white hover:bg-white/5"
                  : "border-white/10 text-muted-foreground cursor-not-allowed"
              }`}
              onClick={() => openLink(project.github)}
              disabled={!project.github || project.github === "#"}
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const sortedProjects = useMemo(() => projects, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollByAmount = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = 460;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden"
    >
      {/* Background Blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            My <span className="text-cyan">Projects</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Real-world solutions built with AI, ML, and modern development stacks.
          </p>
          <div className="h-1.5 w-20 bg-cyan mx-auto rounded-full mt-6"></div>
        </div>

        {/* Carousel */}
        <div className="relative group">
          {/* Left Button */}
          <button
            onClick={() => scrollByAmount("left")}
            className="hidden md:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20
bg-black/30 hover:bg-cyan/10 border border-white/10 p-3 rounded-full
transition-all group-hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="w-7 h-7 text-white" />
          </button>

          {/* Right Button */}
          <button
            onClick={() => scrollByAmount("right")}
            className="hidden md:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20
bg-black/30 hover:bg-cyan/10 border border-white/10 p-3 rounded-full
transition-all group-hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-7 h-7 text-white" />
          </button>

          {/* Scroll Row */}
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory px-2 custom-scrollbar"
          >
            {sortedProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hide scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Projects;
