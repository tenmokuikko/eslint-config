import type { TypedFlatConfigItem } from "@tenmokuikko/eslint-common/types";
import pluginRouter from "@tanstack/eslint-plugin-query";

export async function query(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "antfu/tan-query/rules",
      plugins: {
        "tan-query": pluginRouter,
      },
      rules: {
        "@tanstack/query/exhaustive-deps": "error",
        "@tanstack/query/no-rest-destructuring": "warn",
        "@tanstack/query/stable-query-client": "error",
        "@tanstack/query/no-unstable-deps": "error",
        "@tanstack/query/infinite-query-property-order": "error",
        "@tanstack/query/no-void-query-fn": "error",
      },
    },
  ];
}
