import type { Linter } from "eslint";
import type { RuleOptions } from "./typegen";
import type { Awaitable, ConfigNames, OptionsConfig, OptionsFormatters, OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from "./types";
import { FlatConfigComposer } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";
import { command, comments, disables, formatters, ignores, imports, javascript, jsdoc, jsonc, markdown, node, perfectionist, pnpm, regexp, sortPackageJson, sortTsconfig, stylistic, toml, typescript, unicorn } from "./configs";

import { interopDefault, isInEditorEnv } from "./utils";

export const flatConfigProps = [
  "name",
  "languageOptions",
  "linterOptions",
  "processor",
  "plugins",
  "rules",
  "settings",
] satisfies (keyof TypedFlatConfigItem)[];

export const defaultPluginRenaming = {
  "@eslint-react": "react",
  "@eslint-react/dom": "react-dom",
  "@eslint-react/hooks-extra": "react-hooks-extra",
  "@eslint-react/naming-convention": "react-naming-convention",

  "@stylistic": "style",
  "@typescript-eslint": "ts",
  "import-x": "import",
  "n": "node",
  "vitest": "test",
  "yml": "yaml",
};

export type ResolvedOptions<T> = T extends boolean
  ? never
  : NonNullable<T>;
export function resolveSubOptions<T extends OptionsConfig, K extends keyof T>(
  options: T,
  key: K,
): ResolvedOptions<T[K]> {
  return typeof options[key] === "boolean"
    ? {} as any
    : options[key] || {} as any;
}

export function getOverrides<T extends OptionsConfig, K extends keyof T>(
  options: T,
  key: K,
): Partial<Linter.RulesRecord & RuleOptions> {
  const sub = resolveSubOptions(options, key);
  return {
    ...(options.overrides as any)?.[key],
    ...("overrides" in sub
      ? (sub.overrides as object)
      : {}),
  };
}

export function getCommonConfig(

  options: OptionsConfig & Omit<TypedFlatConfigItem, "files"> = {},
  stylisticOptions: false | (StylisticConfig & OptionsOverrides),
  isInEditor?: boolean,
) {
  const {
    componentExts = [],
    gitignore: enableGitignore = true,
    regexp: enableRegexp = true,
    typescript: enableTypeScript = isPackageExists("typescript"),
    formatters: enableFormatters = {
      markdown: true,
      css: true,
      xml: true,
      svg: true,
      graphql: true,
    },
  } = options;
  const configs: Awaitable<TypedFlatConfigItem[]>[] = [];
  if (enableGitignore) {
    if (typeof enableGitignore !== "boolean") {
      configs.push(interopDefault(import("eslint-config-flat-gitignore")).then(r => [r({
        name: "antfu/gitignore",
        ...enableGitignore,
      })]));
    }
    else {
      configs.push(interopDefault(import("eslint-config-flat-gitignore")).then(r => [r({
        name: "antfu/gitignore",
        strict: false,
      })]));
    }
  }

  const typescriptOptions = resolveSubOptions(options, "typescript");
  // Base configs
  configs.push(
    ignores(options.ignores),
    javascript({
      isInEditor,
      overrides: getOverrides(options, "javascript"),
    }),
    comments(),
    node(),
    jsdoc({
      stylistic: stylisticOptions,
    }),
    imports({
      stylistic: stylisticOptions,
    }),
    command(),
    perfectionist(),
    unicorn(),
    regexp(typeof enableRegexp === "boolean" ? {} : enableRegexp),
    jsonc({
      overrides: getOverrides(options, "jsonc"),
      stylistic: stylisticOptions,
    }),
    sortPackageJson(),
    sortTsconfig(),
    pnpm(),
    toml({
      overrides: getOverrides(options, "toml"),
      stylistic: stylisticOptions,
    }),
    markdown(
      {
        componentExts,
        overrides: getOverrides(options, "markdown"),
      },
    ),
    formatters(
      enableFormatters as OptionsFormatters | true,
      typeof stylisticOptions === "boolean" ? {} : stylisticOptions,
    ),
  );
  if (enableTypeScript) {
    configs.push(typescript({
      ...typescriptOptions,
      componentExts,
      overrides: getOverrides(options, "typescript"),
      type: options.type,
    }));
  }
  if (stylisticOptions) {
    configs.push(stylistic({
      ...stylisticOptions,
      lessOpinionated: options.lessOpinionated,
      overrides: getOverrides(options, "stylistic"),
    }));
  }
  if ("files" in options) {
    throw new Error("[@antfu/eslint-config] The first argument should not contain the \"files\" property as the options are supposed to be global. Place it in the second or later config instead.");
  }
  return configs;
}

export function getComposer(
  configs: Awaitable<TypedFlatConfigItem[]>[],
  isInEditor: boolean,
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]
) {
  let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();
  composer = composer
    .append(
      ...configs,
      ...userConfigs as any,
    );
  composer = composer
    .renamePlugins(defaultPluginRenaming);

  if (isInEditor) {
    composer = composer
      .disableRulesFix([
        "unused-imports/no-unused-imports",
        "test/no-only-tests",
        "prefer-const",
      ], {
        builtinRules: () => import(["eslint", "use-at-your-own-risk"].join("/")).then(r => r.builtinRules),
      });
  }
  return composer;
}

export function tenmokuikko(
  options: OptionsConfig & Omit<TypedFlatConfigItem, "files"> = {},
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  const {
    jsx: enableJsx = true,
  } = options;
  let isInEditor = options.isInEditor;
  if (isInEditor == null) {
    isInEditor = isInEditorEnv();
    if (isInEditor)
    // eslint-disable-next-line no-console
      console.log("[@antfu/eslint-config] Detected running in editor, some rules are disabled.");
  }
  const stylisticOptions = options.stylistic === false
    ? false
    : typeof options.stylistic === "object"
      ? options.stylistic
      : {};
  if (stylisticOptions && !("jsx" in stylisticOptions))
    stylisticOptions.jsx = enableJsx;

  const configs: Awaitable<TypedFlatConfigItem[]>[] = getCommonConfig(options, stylisticOptions, isInEditor);

  configs.push(
    disables(),
  );

  const fusedConfig = flatConfigProps.reduce((acc, key) => {
    if (key in options)
      acc[key] = options[key] as any;
    return acc;
  }, {} as TypedFlatConfigItem);
  if (Object.keys(fusedConfig).length)
    configs.push([fusedConfig]);
  return getComposer(configs, isInEditor, ...userConfigs);
}
