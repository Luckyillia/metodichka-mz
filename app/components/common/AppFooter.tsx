'use client';

import { getVersionInfo } from '@/src/config/version';
import { Sparkles, Heart } from 'lucide-react';

export const AppFooter = () => {
  const { version, lastUpdated } = getVersionInfo();
  
  return (
    <footer className="lg:ml-72 border-t border-white/5 bg-black/40 backdrop-blur-xl relative z-10">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-medium text-foreground">Metodychka MZ</span>
            </div>
            <span className="text-sm text-muted-foreground">v{version}</span>
            <span className="hidden md:inline text-xs text-muted-foreground/60">Updated {lastUpdated}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-primary fill-primary" />
            <span>for Ministry of Health</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
