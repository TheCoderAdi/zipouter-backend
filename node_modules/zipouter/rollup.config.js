import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      format: "module",
      name: "zipouter",
    },
  ],
  external: ["adm-zip", "fs", "path", "child_process", "util"],
  plugins: [
    typescript({
      tsconfig: "tsconfig.json",
    }),
  ],
});
