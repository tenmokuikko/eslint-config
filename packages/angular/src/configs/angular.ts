import { GLOB_HTML } from "@tenmokuikko/eslint-common/globs";
import { interopDefault, renameRules } from "@tenmokuikko/eslint-common/utils";

export async function angular() {
  const [ngTemplate, ngParser, ngPlugin] = await Promise.all([
    interopDefault(import("@angular-eslint/eslint-plugin-template")),
    interopDefault(import("@angular-eslint/template-parser")),
    interopDefault(import("@angular-eslint/eslint-plugin")),
  ] as const);

  return [
    {
      name: "rikka/ngTemplate/setup",
      files: [GLOB_HTML],
      plugins: {
        ngTemplate,
      },
    },
    {
      name: "rikka/ngTemplate/rules",
      files: [GLOB_HTML],
      languageOptions: {
        parser: {
          ...ngParser,
          /* This added property is a hack in order to make the parser serializable.
             * See https://github.com/eslint/eslint/pull/16944.
             * Presumably, an upcoming version of the parser will include this
             * property and we will be able to delete this line. */
          meta: { name: "@angular-eslint/template-parser", version: "17.2.1" },
        },
      },
      rules: {
        ...renameRules(
          ngTemplate.configs.recommended.rules,
          { "@angular-eslint/template": "ngTemplate" },

        ),
        ...renameRules(
          ngTemplate.configs.accessibility.rules,
          { "@angular-eslint/template": "ngTemplate" },
        ),
      },
    },
  ];
}
