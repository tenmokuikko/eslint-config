import type { Awaitable, OptionsConfig, TypedFlatConfigItem } from "@antfu/eslint-config";
import type { Linter } from "eslint";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import { antfu } from "@antfu/eslint-config";
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
    ...userConfigs,
  );
}
