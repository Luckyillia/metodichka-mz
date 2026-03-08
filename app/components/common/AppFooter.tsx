'use client';

import { getVersionInfo } from '@/src/config/version';

export const AppFooter = () => {
  const { version, lastUpdated } = getVersionInfo();
  
  return (
    <footer className="lg:ml-64 border-t border-border bg-background">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Metodychka MZ</span>
            <span className="hidden sm:inline h-4 w-px bg-border" />
            <span>v{version}</span>
            <span className="hidden md:inline h-4 w-px bg-border" />
            <span className="hidden md:inline">Updated {lastUpdated}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Built for Ministry of Health
          </div>
        </div>
      </div>
    </footer>
  );
};
