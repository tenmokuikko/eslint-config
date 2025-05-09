import type { Awaitable, OptionsConfig, TypedFlatConfigItem } from "@antfu/eslint-config";
import type { Linter } from "eslint";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import { antfu } from "@antfu/eslint-config";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import { merge } from "lodash-es";

export function tenmokuikko(options?: OptionsConfig & Omit<TypedFlatConfigItem, "files">, ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]) {
  return antfu(
    merge(
      {
        stylistic: {
          quotes: "double",
          semi: true,
        },
        react: true,
        jsonc: true,
        yaml: true,
        typescript: true,
        formatters: {
          css: "prettier",
          xml: "prettier",
          svg: "prettier",
          markdown: "prettier",
          graphql: "prettier",
        },
      },
      options || {},
    ),
    pluginRouter.configs["flat/recommended"],
    pluginQuery.configs["flat/recommended"],
    ...userConfigs,
  );
}
