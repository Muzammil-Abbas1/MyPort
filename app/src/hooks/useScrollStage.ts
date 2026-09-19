import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Scroll-driven 3D "assemble" stage.
 *
 * Wide, tall screens: the section is pinned to one screen (sticky) and each
 * registered element flies in from depth as you scroll through the track.
 * Phones / short windows: no pinning; elements get a lightweight 3D reveal
 * when they enter the viewport.
 * Reduced motion: everything is simply shown.
 */
export interface Fly {
  /** scroll progress (0..1) where this element starts moving */
  start: number;
  /** scroll progress (0..1) where it has fully arrived */
  end: number;
  x?: number;
  y?: number;
  z?: number;
  ry?: number;
  rx?: number;
}

const useMatch = (query: string) => {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
};

const smooth = (x: number) => {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
};

export const useScrollStage = (flies: Fly[]) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLElement | null)[]>([]);
  const reduced = useMatch('(prefers-reduced-motion: reduce)');
  const wide = useMatch('(min-width: 1024px) and (min-height: 640px)');

  const scrub = wide && !reduced;
  const reveal = !wide && !reduced;

  useEffect(() => {
    const clear = () =>
      els.current.forEach((el) => {
        if (!el) return;
        el.style.transform = '';
        el.style.opacity = '';
      });

    if (!scrub) {
      clear();
      return;
    }

    const apply = (p: number) => {
      flies.forEach((f, i) => {
        const el = els.current[i];
        if (!el) return;
        const t = smooth((p - f.start) / (f.end - f.start));
        const r = 1 - t;
        el.style.opacity = String(Math.min(1, t * 1.6));
        el.style.transform = `translate3d(${((f.x ?? 0) * r).toFixed(1)}px, ${((f.y ?? 0) * r).toFixed(1)}px, ${((f.z ?? 0) * r).toFixed(1)}px) rotateY(${((f.ry ?? 0) * r).toFixed(2)}deg) rotateX(${((f.rx ?? 0) * r).toFixed(2)}deg)`;
      });
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const lead = vh * 0.45; // start assembling a little before the section is pinned
      const range = track.offsetHeight - vh + lead;
      apply(range > 0 ? Math.min(1, Math.max(0, (lead - rect.top) / range)) : 1);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
      clear();
    };
  }, [scrub, flies]);

  // Non-pinned mode: reveal each element with a small 3D entrance.
  useEffect(() => {
    if (!reveal) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('stage-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [reveal]);

  /** ref callback for the i-th animated element */
  const ref = useCallback(
    (i: number) => (el: HTMLElement | null) => {
      els.current[i] = el;
    },
    []
  );

  /** class to put on every animated element */
  const itemClass = scrub ? 'will-change-transform' : reveal ? 'stage-rv' : '';

  return { trackRef, ref, scrub, itemClass };
};
