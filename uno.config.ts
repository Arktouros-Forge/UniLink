import { defineConfig, presetWind4 } from "unocss";
import presetIcons from "@unocss/preset-icons";
import presetWebFonts from "@unocss/preset-web-fonts";
import transformerCompileClass from "@unocss/transformer-compile-class";
import { fontProcessor } from "./font-processor";

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons({
      scale: 1.2,
      extraProperties: { display: "inline-block", "vertical-align": "middle", "flex-shrink": "0" },
    }),
    presetWebFonts({
      provider: "google",
      fonts: {
        display: "Bricolage Grotesque:300,600,700",
        sans: "Inter:400,500,600",
        mono: "JetBrains Mono:500",
      },
      processors: [fontProcessor],
    }),
  ],
  transformers: [transformerCompileClass({ classPrefix: "arktouros-" })],
  content: { filesystem: ["app/**/*.{js,json}"] },
  theme: {
    colors: {
      paper: "var(--paper)",
      card: "var(--card)",
      ink: "var(--ink)",
      mute: "var(--mute)",
      rule: "var(--rule)",
      edge: "var(--edge)",
      soft: "var(--soft)",
      good: "var(--good)",
      onbrand: "var(--on-brand)",
      brand: { blue: "var(--blue)", red: "var(--red)", yellow: "var(--yellow)" },
    },
  },
  shortcuts: {
    "type-display": "font-display font-bold text-[28px] leading-9 tracking-[-0.02em] text-ink md:text-[64px] md:leading-[76px]",
    "type-h1": "font-display font-bold text-[28px] leading-9 tracking-[-0.02em] text-ink md:text-[40px] md:leading-[52px]",
    "type-h2": "font-display font-bold text-2xl leading-8 tracking-[-0.02em] text-ink md:text-[28px] md:leading-9",
    "type-h3": "font-display font-semibold text-xl leading-7 tracking-[-0.01em] text-ink",
    "type-lead": "font-sans text-base leading-[26px] text-mute md:text-xl md:leading-7",
    "type-body": "font-sans text-base leading-[26px] text-mute",
    "type-small": "font-sans text-sm leading-[22px] text-mute",
    "type-label": "font-sans font-medium text-sm leading-[18px] text-ink",
    "type-meta": "font-mono font-medium text-xs leading-4 tracking-[0.02em] uppercase text-mute",
    "type-numeral": "font-display font-bold leading-none text-brand-red text-[36px] md:text-[80px]",
    wrap: "mx-auto w-full max-w-[1440px] px-5 md:px-20",
    "wrap-sm": "mx-auto w-full max-w-[1440px] px-5 md:px-16",
    btn: "inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg border border-transparent font-sans font-medium text-[15px] leading-5 whitespace-nowrap transition-opacity cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed md:h-10",
    "btn-lg": "!h-12 !px-6",
    "btn-sm": "!h-9 !px-3 !text-sm",
    "btn-primary": "btn bg-brand-blue text-onbrand hover:opacity-90",
    "btn-secondary": "btn bg-card text-brand-blue border-edge hover:bg-soft",
    "btn-ghost": "btn text-brand-blue hover:bg-soft",
    "btn-danger": "btn bg-brand-red text-white hover:opacity-90",
    card: "bg-card border border-edge rounded-lg p-5",
    field: "w-full h-12 px-3 rounded-lg bg-card border border-edge text-ink font-sans text-base outline-none transition-colors focus:border-brand-blue placeholder:text-mute",
    chip: "inline-flex items-center gap-1.5 h-7 px-3 rounded-md border text-sm leading-5 font-medium whitespace-nowrap",
  },
});
