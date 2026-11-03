import { defineConfig, presetWind4 } from "unocss";
import presetIcons from "@unocss/preset-icons";
import presetWebFonts from "@unocss/preset-web-fonts";
import transformerCompileClass from "@unocss/transformer-compile-class";
import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
import { icons } from "./app/constants/icons";

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons({
      scale: 1,
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
        "flex-shrink": "0",
      },
    }),
    presetWebFonts({
      provider: "bunny",
      fonts: {
        display: "Bricolage Grotesque:600,700,800",
        serif: "Instrument Serif:400,400i",
        sans: "Inter:400,500,600",
        mono: "JetBrains Mono:500",
      },
      processors: createLocalFontProcessor({
        cacheDir: "node_modules/.cache/unocss/fonts",
        fontAssetsDir: "public/assets/fonts",
        fontServeBaseUrl: "/assets/fonts",
      }),
    }),
  ],
  transformers: [transformerCompileClass({ classPrefix: "arktouros-" })],
  safelist: Object.values(icons),
  theme: {
    colors: {
      paper: "var(--canvas-paper)",
      card: "var(--surface-card)",
      elevated: "var(--surface-elevated)",
      ink: {
        DEFAULT: "var(--ink-primary)",
        2: "var(--ink-secondary)",
        3: "var(--ink-muted)",
        off: "var(--ink-disabled)",
      },
      hairline: "var(--hairline)",
      outline: "var(--outline-strong)",
      blue: { DEFAULT: "var(--brand-blue)", soft: "var(--brand-blue-soft)" },
      red: { DEFAULT: "var(--brand-red)", soft: "var(--brand-red-soft)" },
      yellow: {
        DEFAULT: "var(--brand-yellow)",
        soft: "var(--brand-yellow-soft)",
      },
      success: { DEFAULT: "var(--success)", soft: "var(--success-soft)" },
      warning: { DEFAULT: "var(--warning)", soft: "var(--warning-soft)" },
      danger: { DEFAULT: "var(--error)", soft: "var(--error-soft)" },
      onblue: "var(--on-blue)",
      backdrop: "var(--overlay-backdrop)",
    },
    radius: { sm: "4px", md: "8px", lg: "12px" },
    shadow: {
      rest: "var(--shadow-rest)",
      hover: "var(--shadow-hover)",
      modal: "var(--shadow-modal)",
      popover: "var(--shadow-popover)",
    },
  },
  shortcuts: {
    "t-d1":
      "font-display font-extrabold text-[44px] leading-[48px] tracking-[-0.035em] md:text-[72px] md:leading-[76px]",
    "t-d2":
      "font-display font-bold text-[28px] leading-9 tracking-[-0.02em] md:text-[44px] md:leading-[52px] md:tracking-[-0.03em]",
    "t-d3": "font-display font-bold text-[28px] leading-9 tracking-[-0.02em]",
    "t-d4": "font-display font-semibold text-xl leading-7 tracking-[-0.01em]",
    "t-xs": "font-sans font-semibold text-base leading-6 tracking-[-0.01em]",
    "t-serif-display":
      "font-serif text-[96px] leading-[96px] md:text-[160px] md:leading-[160px]",
    "t-serif-step":
      "font-serif text-[64px] leading-[64px] md:text-[96px] md:leading-[96px]",
    "t-serif-stat":
      "font-serif text-[56px] leading-[56px] md:text-[64px] md:leading-[64px]",
    "t-serif-small": "font-serif text-[56px] leading-[56px]",
    "t-body-l": "font-sans text-lg leading-7",
    "t-body-m": "font-sans text-base leading-[26px]",
    "t-body-s": "font-sans text-sm leading-[22px]",
    "t-body-xs": "font-sans text-xs leading-5",
    "t-label": "font-sans font-medium text-sm leading-5",
    "t-button": "font-sans font-medium text-[15px] leading-5",
    "t-mono-s": "font-mono font-medium text-xs leading-4 tracking-[0.02em]",
    "t-mono-m": "font-mono font-medium text-sm leading-5 tracking-[0.02em]",
    "container-app": "mx-auto w-full max-w-[1240px] px-5 md:px-12",
    "focus-ring":
      "outline-none focus-visible:shadow-[0_0_0_2px_var(--canvas-paper),0_0_0_4px_var(--brand-blue)]",
    surface: "bg-card border border-hairline rounded-md shadow-rest",
  },
});
