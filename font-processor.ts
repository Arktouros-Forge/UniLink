import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
import type { Plugin } from "vite";

const emittedFonts = new Map<string, Uint8Array>();

export const fontProcessor = createLocalFontProcessor({
  onDownload(filename, buf) {
    emittedFonts.set(filename, buf);
  },
});

export const fontEmitPlugin: Plugin = {
  name: "unocss:font-emit",
  apply: "build",

  generateBundle() {
    for (const [filename, source] of emittedFonts) {
      this.emitFile({
        type: "asset",
        fileName: `assets/fonts/${filename}`,
        source,
      });
    }

    emittedFonts.clear();
  },
};
