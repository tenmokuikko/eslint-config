import { defineConfig } from "@rslib/core";

export default defineConfig({
  source: {
    entry: {
      index: "src/index.ts",
      config: "src/configs/index.ts",
    },
  },
  output: {
    cleanDistPath: true,
    sourceMap: true,
  },
  lib: [
    { format: "esm", dts: true },
  ],
});
