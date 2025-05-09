import type { Awaitable, OptionsConfig, TypedFlatConfigItem } from "@antfu/eslint-config";
import type { Linter } from "eslint";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import angularPlugin from "@angular-eslint/eslint-plugin";
import { antfu } from "@antfu/eslint-config";
import parserTs from "@typescript-eslint/parser";
import { merge } from "lodash-es";

export function tenmokuikko(options?: OptionsConfig & Omit<TypedFlatConfigItem, "files">, ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]) {
  return antfu(
    merge(
      {
        stylistic: {
          quotes: "double",
          semi: true,
        },
        vue: true,
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

    {
      name: "angular-eslint/ts-base",
      languageOptions: {
        parser: parserTs,
        sourceType: "module",
      },
    },
    {
      name: "angular-eslint/ts-recommended",
      plugins: {
        "@angular-eslint": angularPlugin,
      },
      rules: Object.fromEntries(Object.keys(angularPlugin.configs.all.rules).map(rule => [rule, ["error"]])),
    },
    ...userConfigs,
  );
}
