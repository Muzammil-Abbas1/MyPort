import type { CSSProperties } from "react";
import SectionHeader from "@/components/SectionHeader";
import { useScrollStage } from "@/hooks/useScrollStage";
import type { Fly } from "@/hooks/useScrollStage";
import { GraduationCap, Briefcase, ArrowUpRight, Sparkles } from "lucide-react";

// Cards assemble from depth in this order as the pinned section is scrolled.
const flies: Fly[] = [
  { start: 0.0, end: 0.4, x: -170, z: -340, ry: 26 }, // portrait
  { start: 0.1, end: 0.5, x: 170, z: -280, ry: -22 }, // background
  { start: 0.3, end: 0.68, y: 100, z: -260, rx: -14 }, // education
  { start: 0.42, end: 0.8, y: 100, z: -260, rx: -14 }, // status
];

const About = () => {
  const { trackRef, ref, scrub, itemClass } = useScrollStage(flies);
  const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

  return (
    <section
      id="about"
      className="relative overflow-x-clip bg-background px-4 sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-5%] h-[40%] w-[40%] rounded-full bg-cyan/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-purple/10 blur-[120px]" />
      </div>

      <div ref={trackRef} className={scrub ? "h-[240svh]" : ""}>
        <div
          className={
            scrub
              ? "sticky top-0 flex min-h-svh flex-col justify-center py-8"
              : "py-20 md:py-24"
          }
        >
          <div className="relative mx-auto w-full max-w-6xl lg:px-6">
            <SectionHeader eyebrow="Who I Am" title="About Me" compact={scrub} />

            <div
              className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12 lg:gap-5"
              style={scrub ? { perspective: "1500px" } : undefined}
            >
              {/* Portrait */}
              <div
                ref={ref(0)}
                style={d(0)}
                className={`relative min-h-[320px] sm:min-h-[380px] lg:col-span-5 lg:min-h-0 ${itemClass}`}
              >
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-cyan to-purple opacity-25 blur" />
                <div className="relative h-full overflow-hidden rounded-[1.7rem] border border-white/10 bg-card/30">
                  <img
                    src="/images/p1.png"
                    alt="Muzammil Abbas"
                    className="absolute inset-0 h-full w-full object-cover object-[50%_18%]"
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-4 lg:col-span-7 lg:gap-5">
                {/* Background */}
                <div
                  ref={ref(1)}
                  style={d(80)}
                  className={`rounded-3xl border border-white/10 bg-black/30 p-4 shadow-xl backdrop-blur-xl sm:p-5 ${itemClass}`}
                >
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/10 text-cyan">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-bold text-cyan">Background</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    I'm a{" "}
                    <span className="font-semibold text-foreground">
                      Computer Science student from Skardu
                    </span>
                    , now in Islamabad. I build{" "}
                    <span className="font-semibold text-foreground">full-stack web applications</span> with Java,
                    Spring Boot and React, and add{" "}
                    <span className="font-semibold text-foreground">AI and n8n automation</span> to
                    make them smarter.
                  </p>
                </div>

                {/* Education + Status */}
                <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-4">
                  <div
                    ref={ref(2)}
                    style={d(160)}
                    className={`flex flex-col rounded-3xl border border-white/10 bg-black/30 p-4 shadow-lg backdrop-blur-xl ${itemClass}`}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-purple/20 bg-purple/10">
                        <GraduationCap className="h-4 w-4 text-purple" />
                      </div>
                      <h4 className="text-base font-bold text-purple">Education</h4>
                    </div>
                    <p className="font-bold leading-snug text-foreground">
                      BS in Computer Science
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Ibadat International University, Islamabad
                    </p>
                    <p className="mt-auto pt-2 font-mono text-[13px] font-bold text-cyan">
                      7th semester · graduating July 2027
                    </p>
                  </div>

                  <div
                    ref={ref(3)}
                    style={d(240)}
                    className={`flex flex-col rounded-3xl border border-white/10 bg-black/30 p-4 shadow-lg backdrop-blur-xl ${itemClass}`}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-green-400/20 bg-green-400/10">
                        <Briefcase className="h-4 w-4 text-green-400" />
                      </div>
                      <h4 className="text-base font-bold text-green-400">Current Status</h4>
                    </div>
                    <p className="font-bold leading-snug text-foreground">
                      Open to freelance &amp; contract work
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Full-stack web apps, AI and n8n automation
                    </p>
                    <a
                      href="https://wa.me/923118911228"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex h-9 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-purple text-sm font-bold text-white shadow-lg shadow-cyan/20 transition hover:opacity-90 active:scale-95 motion-reduce:transform-none"
                    >
                      Hire me <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
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
