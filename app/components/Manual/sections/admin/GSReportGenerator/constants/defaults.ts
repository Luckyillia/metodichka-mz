export const DEFAULT_CITY_NAMES = ['ЦГБ-П', 'ОКБ-М', 'ЦГБ-Н'] as const;

export const DEFAULT_ORGANIZATION = 'МЗ';

export const INPUT_CLASSES = {
    base: "w-full px-4 py-2 bg-gray-800/70 border border-gray-600/50 rounded-lg text-gray-100 placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all",
    listItem: "flex-1 px-3 py-2 bg-gray-800/70 border border-gray-600/50 rounded-lg text-gray-100 text-sm placeholder-gray-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
    textarea: "w-full px-4 py-3 border rounded-lg font-mono text-sm transition-all",
    textareaActive: "bg-white/5 border-blue-500/30 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500",
    textareaParsed: "bg-white/5 border-green-500/30 text-gray-400 cursor-not-allowed"
} as const;

export const BUTTON_CLASSES = {
    primary: "px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-semibold text-lg shadow-lg",
    secondary: "px-4 py-2 bg-gray-800/70 text-gray-200 rounded-lg hover:bg-gray-700/70 transition-colors border border-gray-600/50 text-sm hover:border-gray-500/50",
    add: "mt-2 px-3 py-1.5 bg-[#2d6a4f] text-white rounded-lg hover:bg-[#4ade80] transition-colors text-xs border border-[#4ade80]/30 font-medium",
    addFull: "w-full py-3 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors font-semibold border border-blue-500/30"
} as const;