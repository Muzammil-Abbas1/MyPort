import { ArrowUp, Github, Linkedin, MessageCircle, Mail, MapPin } from 'lucide-react';
import { scrollBehavior } from '@/lib/scroll';

const links = [
  { label: 'Projects', id: 'projects' },
  { label: 'Skills', id: 'skills' },
  { label: 'Experience', id: 'experience' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'contact' },
];

const socials = [
  { label: 'GitHub', href: 'https://github.com/Muzammil-Abbas1', icon: <Github className="h-4 w-4" /> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/muzammilabbass', icon: <Linkedin className="h-4 w-4" /> },
  { label: 'WhatsApp', href: 'https://wa.me/923118911228', icon: <MessageCircle className="h-4 w-4" /> },
  { label: 'Email', href: 'mailto:210muzammilabbas@gmail.com', icon: <Mail className="h-4 w-4" /> },
];

const scrollToId = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior() });

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />
      <div className="pointer-events-none absolute -bottom-32 left-1/2 h-56 w-[60%] -translate-x-1/2 rounded-full bg-cyan/10 blur-[110px]" />

      <div className="relative mx-auto max-w-6xl px-4 pb-6 pt-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-[1.5fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: scrollBehavior() });
              }}
              className="inline-block text-xl font-extrabold tracking-tight text-white"
            >
              Muzammil <span className="text-cyan">Abbas</span>
            </a>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Full-stack developer building web applications with Java, Spring Boot and React,
              with AI and n8n automation built in.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 motion-reduce:animate-none" />
              Available for freelance &amp; new projects
            </div>

            <div className="mt-5 flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:-translate-y-0.5 hover:border-cyan/40 hover:bg-cyan/10 hover:text-cyan motion-reduce:transform-none"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer">
            <h4 className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan sm:mb-4">
              Explore
            </h4>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm sm:block sm:space-y-2.5">
              {links.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => scrollToId(l.id)}
                    className="text-muted-foreground transition hover:text-white hover:underline hover:underline-offset-4"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-cyan">
              Let&apos;s talk
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                <a
                  href="mailto:210muzammilabbas@gmail.com"
                  className="break-all transition hover:text-white"
                >
                  210muzammilabbas@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                <a
                  href="https://wa.me/923118911228"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  +92 311 8911228
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                <span>Islamabad, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>
            © 2026 <span className="font-medium text-foreground">Muzammil Abbas</span>. All rights
            reserved.
          </p>
          <p>Designed &amp; built with React, TypeScript and Tailwind CSS</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })}
            className="group flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-white/70 transition hover:border-cyan/40 hover:text-cyan"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 motion-reduce:transform-none" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
