import { defineConfig, presetWind4 } from "unocss";
import presetIcons from "@unocss/preset-icons";
import presetWebFonts from "@unocss/preset-web-fonts";
import { fontProcessor } from "./font-processor";
import transformerCompileClass from "@unocss/transformer-compile-class";

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons(),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: "Roboto",
        mono: ["Fira Code", "Fira Mono:400,700"],
      },
      processors: [fontProcessor],
    }),
  ],
  transformers: [
    transformerCompileClass({
      classPrefix: "arktouros-",
    }),
  ],
});
