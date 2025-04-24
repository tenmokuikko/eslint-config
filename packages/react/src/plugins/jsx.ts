import type { TypedFlatConfigItem } from "@tenmokuikko/eslint-common/types";

import { GLOB_JSX, GLOB_TSX } from "@tenmokuikko/eslint-common/globs";

export async function jsx(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [GLOB_JSX, GLOB_TSX],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      name: "antfu/jsx/setup",
    },
  ];
}
