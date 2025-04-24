import { defineConfig } from "@rslib/core";

export default defineConfig({
  source: {
    entry: {
      index: "src/index.ts",
      configs: "src/configs/index.ts",
      globs: "src/globs.ts",
      types: "src/types.ts",
      utils: "src/utils.ts",
      factory: "src/factory.ts",
    },
  },
  output: {
    cleanDistPath: true,
    sourceMap: true,
  },
  lib: [
    { format: "esm", dts: true },
    { format: "cjs", dts: true },
  ],
});
