import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import SectionHeader from '@/components/SectionHeader';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useScrollStage } from '@/hooks/useScrollStage';
import type { Fly } from '@/hooks/useScrollStage';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Copy,
  Check,
  Github,
  Linkedin,
  MessageCircle,
  ArrowUpRight,
} from 'lucide-react';

const EMAIL = '210muzammilabbas@gmail.com';
const WHATSAPP = 'https://wa.me/923118911228';

const contactInfo = [
  { icon: Mail, label: 'Email', value: EMAIL, href: `mailto:${EMAIL}`, copy: true },
  { icon: Phone, label: 'Phone / WhatsApp', value: '+92 311 8911228', href: 'tel:+923118911228' },
  { icon: MapPin, label: 'Based in', value: 'Islamabad, Pakistan', href: undefined },
];

const socials = [
  { label: 'GitHub', href: 'https://github.com/Muzammil-Abbas1', icon: <Github className="h-5 w-5" /> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/muzammilabbass', icon: <Linkedin className="h-5 w-5" /> },
  { label: 'WhatsApp', href: WHATSAPP, icon: <MessageCircle className="h-5 w-5" /> },
  { label: 'Upwork', href: 'https://www.upwork.com/freelancers/~01d8a382d9eac1d30c', icon: <span className="text-base font-bold">U</span> },
];

const flies: Fly[] = [
  { start: 0.0, end: 0.45, x: -200, z: -340, ry: 24 }, // contact info
  { start: 0.12, end: 0.57, x: 200, z: -340, ry: -24 }, // form
];

const Contact = () => {
  const { trackRef, ref, scrub, itemClass } = useScrollStage(flies);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // There is no mail server behind this form, so hand the message to the
  // visitor's own email app (prefilled) rather than pretending it was sent.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = `Portfolio message from ${form.name}`;
    const body = `${form.message}\n\n— ${form.name} (${form.email})`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
    setTimeout(() => setOpened(false), 6000);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section id="contact" className="relative overflow-x-clip bg-background px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-cyan/10 blur-[120px]" />
        <div className="absolute right-[-10%] top-[10%] h-[40%] w-[40%] rounded-full bg-purple/10 blur-[120px]" />
      </div>

      <div ref={trackRef} className={scrub ? 'h-[220svh]' : ''}>
        <div
          className={
            scrub
              ? 'sticky top-0 flex min-h-svh flex-col justify-center py-8'
              : 'py-20 md:py-24'
          }
        >
          <div className="relative mx-auto w-full max-w-5xl">
            <SectionHeader
              eyebrow="Contact"
              title="Get In Touch"
              subtitle={scrub ? undefined : "Let's build something amazing together"}
              compact={scrub}
            />

            <div
              className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 lg:gap-6"
              style={scrub ? { perspective: '1500px' } : undefined}
            >
              {/* Contact info */}
              <div
                ref={ref(0)}
                className={`flex flex-col rounded-2xl border border-border bg-card p-5 shadow-xl sm:p-6 ${itemClass}`}
              >
                <h3 className="mb-4 text-xl font-bold text-cyan">Contact Information</h3>

                <div className="space-y-2">
                  {contactInfo.map(({ icon: Icon, label, value, href, copy }) => {
                    const inner = (
                      <>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-cyan transition-colors group-hover:bg-cyan group-hover:text-background">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground">{label}</p>
                          <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-cyan sm:text-base">
                            {value}
                          </p>
                        </div>
                      </>
                    );
                    return (
                      <div key={label} className="group flex items-center gap-1 rounded-xl p-2 transition-colors hover:bg-muted/50">
                        {href ? (
                          <a href={href} className="flex min-w-0 flex-1 items-center gap-4">
                            {inner}
                          </a>
                        ) : (
                          <div className="flex min-w-0 flex-1 items-center gap-4">{inner}</div>
                        )}
                        {copy && (
                          <button
                            type="button"
                            onClick={copyEmail}
                            aria-label={copied ? 'Email copied' : 'Copy email address'}
                            className="shrink-0 rounded-lg p-2 text-muted-foreground transition hover:bg-white/10 hover:text-white"
                          >
                            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      title={s.label}
                      className="flex h-11 flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:-translate-y-0.5 hover:border-cyan/40 hover:bg-cyan/10 hover:text-cyan motion-reduce:transform-none"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>

                <div className="mt-auto pt-4">
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-purple text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98] motion-reduce:transform-none"
                  >
                    Hire Me for Freelance / Contract Work
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Message form */}
              <div
                ref={ref(1)}
                style={{ '--d': '100ms' } as React.CSSProperties}
                className={`flex flex-col rounded-2xl border border-border bg-card p-5 shadow-xl sm:p-6 ${itemClass}`}
              >
                <h3 className="mb-4 text-xl font-bold text-purple">Send a Message</h3>

                <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input
                      name="name"
                      placeholder="Your name"
                      aria-label="Your name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="border-border bg-background focus:border-cyan focus:ring-cyan/20"
                    />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your email"
                      aria-label="Your email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="border-border bg-background focus:border-cyan focus:ring-cyan/20"
                    />
                  </div>

                  <Textarea
                    name="message"
                    placeholder="How can I help you?"
                    aria-label="Your message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="min-h-[110px] flex-1 resize-none border-border bg-background focus:border-cyan focus:ring-cyan/20"
                  />

                  <button
                    type="submit"
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple to-cyan text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98] motion-reduce:transform-none"
                  >
                    <Send className="h-4 w-4" />
                    {opened ? 'Opening your email app…' : 'Send Message'}
                  </button>

                  <p className="text-center text-xs text-muted-foreground" aria-live="polite">
                    {opened
                      ? "If nothing opened, email me directly or use WhatsApp."
                      : 'Opens your email app with the message ready to send.'}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
