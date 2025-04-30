import type { TypedFlatConfigItem } from "@tenmokuikko/eslint-common/types";
import pluginRouter from "@tanstack/eslint-plugin-router";

export async function router(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "antfu/tan-router/rules",
      plugins: {
        "tan-router": pluginRouter,
      },
      rules: {
        "@tanstack/router/create-route-property-order": "error",
      },
    },
  ];
}
