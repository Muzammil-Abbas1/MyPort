# Muzammil Abbas Portfolio - Technical Specification

## 1. Tech Stack Overview

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS 3.4 |
| UI Components | shadcn/ui |
| Animation | Framer Motion |
| 3D/Canvas | Three.js + React Three Fiber |
| Icons | Lucide React |
| Code Display | Prism React Renderer |

## 2. Tailwind Configuration Extensions

```javascript
// tailwind.config.js extensions
{
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        'bg-secondary': '#111111',
        'bg-tertiary': '#1a1a1a',
        cyan: {
          DEFAULT: '#00d4ff',
          dark: '#0891b2',
          light: '#67e8f9'
        },
        purple: {
          DEFAULT: '#a855f7',
          dark: '#7c3aed'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'count-up': 'countUp 1s ease-out',
        'glow': 'glow 2s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.5)' }
        }
      }
    }
  }
}
```

## 3. Component Inventory

### Shadcn/UI Components (Pre-installed)
- Button (with custom cyan variant)
- Card
- Input
- Textarea
- Badge
- Tabs
- Progress
- Separator

### Custom Components

| Component | Props | Description |
|-----------|-------|-------------|
| `AnimatedGrid` | `className?: string` | 3D grid background with particles |
| `ScrollProgress` | `className?: string` | Vertical scroll progress indicator |
| `SkillBar` | `name: string, percentage: number, icon: string, delay?: number` | Animated skill progress bar |
| `ProjectCard` | `project: Project` | Project display card with image |
| `ExperienceCard` | `experience: Experience` | Work experience card |
| `TechItem` | `name: string, description: string, icon?: string` | Technology stack item |
| `StatCounter` | `value: string, label: string, delay?: number` | Animated stat counter |
| `CodeComparison` | - | Before/After code tabs |
| `ContactForm` | - | Contact form with validation |
| `SectionWrapper` | `children: ReactNode, className?: string, id?: string` | Animated section wrapper |

### Type Definitions

```typescript
interface Project {
  id: string;
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  results: string;
  image: string;
  tech: string[];
  liveDemo?: string;
  github: string;
}

interface Experience {
  title: string;
  company: string;
  location: string;
  duration: string;
  responsibilities: string[];
}

interface Skill {
  name: string;
  percentage: number;
  icon: string;
}
```

## 4. Animation Implementation Plan

| Interaction | Tech Choice | Implementation |
|-------------|-------------|----------------|
| Hero Text Reveal | Framer Motion | `staggerChildren: 0.1`, `y: 20 -> 0`, `opacity: 0 -> 1` |
| 3D Grid Background | Three.js | Perspective camera, grid lines, floating particles |
| Stats Counter | Framer Motion + useInView | Animate numbers from 0 to target |
| Skill Bar Fill | Framer Motion | `width: 0 -> percentage%` on scroll into view |
| Section Fade In | Framer Motion | `whileInView`, `opacity` and `y` animation |
| Card Hover | Tailwind + CSS | `hover:translate-y-[-4px]`, `hover:border-cyan` |
| Button Hover | Tailwind | `hover:scale-[1.02]`, `hover:shadow-glow` |
| Progress Indicator | React State | Calculate scroll percentage, animate height |
| Code Tab Switch | Framer Motion | `AnimatePresence` with fade transition |
| Project Card Image | Tailwind | `group-hover:scale-105` on image |

### Animation Timing Constants

```typescript
const ANIMATION = {
  duration: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8
  },
  easing: {
    default: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    smooth: [0.25, 0.1, 0.25, 1]
  },
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15
  }
};
```

## 5. Project File Structure

```
app/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── AnimatedGrid.tsx       # 3D background
│   │   ├── ScrollProgress.tsx     # Scroll indicator
│   │   ├── SkillBar.tsx           # Skill progress bar
│   │   ├── ProjectCard.tsx        # Project card
│   │   ├── ExperienceCard.tsx     # Experience card
│   │   ├── TechItem.tsx           # Tech stack item
│   │   ├── StatCounter.tsx        # Animated counter
│   │   ├── CodeComparison.tsx     # Code tabs
│   │   ├── ContactForm.tsx        # Contact form
│   │   └── SectionWrapper.tsx     # Section animation wrapper
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── CodeQuality.tsx
│   │   ├── Skills.tsx
│   │   ├── TechStack.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── hooks/
│   │   ├── useScrollProgress.ts
│   │   └── useInViewAnimation.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── images/
│       ├── profile.png
│       ├── project-cv-filter.png
│       ├── project-trading-bot.png
│       ├── project-chatbot.png
│       └── project-house-price.png
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## 6. Package Installation List

```bash
# Animation library
npm install framer-motion

# Three.js for 3D background
npm install three @react-three/fiber @react-three/drei

# Code syntax highlighting
npm install prism-react-renderer

# Icons
npm install lucide-react

# Utility
npm install clsx tailwind-merge
```

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, stacked sections |
| Tablet | 640-1024px | 2 columns where applicable |
| Desktop | > 1024px | Full layout as designed |

## 8. Performance Considerations

1. **Image Optimization**: Use WebP format, lazy loading
2. **Animation Performance**: Use `transform` and `opacity` only
3. **3D Background**: Reduce particle count on mobile
4. **Code Splitting**: Lazy load sections below fold
5. **Will-change**: Apply to animated elements

## 9. Accessibility

1. **Color Contrast**: Minimum 4.5:1 for text
2. **Focus States**: Visible focus rings on interactive elements
3. **Reduced Motion**: Respect `prefers-reduced-motion`
4. **Semantic HTML**: Proper heading hierarchy
5. **Alt Text**: Descriptive alt text for all images
