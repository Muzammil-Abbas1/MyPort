import { Code2, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          {/* Left */}
          <div>
            <p className="text-sm text-muted-foreground">
              © 2026 <span className="text-foreground font-medium">Muzammil Abbas</span>. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              AI/ML Developer • FinTech Innovator • Islamabad, Pakistan
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Code2 className="w-4 h-4" />
            <span>Built with React + Tailwind</span>
            <Heart className="w-4 h-4 opacity-70" />
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
