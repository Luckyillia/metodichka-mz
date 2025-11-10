export const DEFAULT_CITY_NAMES = ['ЦГБ-П', 'ОКБ-М', 'ЦГБ-Н'] as const;

export const DEFAULT_ORGANIZATION = 'МЗ';

export const INPUT_CLASSES = {
    base: "w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all",
    listItem: "flex-1 px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
    textarea: "w-full px-4 py-3 border rounded-lg font-mono text-sm transition-all",
    textareaActive: "bg-card border-primary/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
    textareaParsed: "bg-muted border-border text-muted-foreground cursor-not-allowed"
} as const;

export const BUTTON_CLASSES = {
    primary: "px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all font-semibold text-lg shadow-lg",
    secondary: "px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-colors border border-border text-sm",
    add: "mt-2 px-3 py-1.5 bg-[#2d6a4f] text-white rounded-lg hover:bg-[#4ade80] transition-colors text-xs border border-[#4ade80]/30 font-medium",
    addFull: "w-full py-3 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-semibold border border-primary/30"
} as const;