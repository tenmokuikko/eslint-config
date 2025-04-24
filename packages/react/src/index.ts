import type { Awaitable, OptionsConfig, TypedFlatConfigItem } from "@tenmokuikko/eslint-common/types";
import type { Linter } from "eslint";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import { disables } from "@tenmokuikko/eslint-common/configs";
import { flatConfigProps, getCommonConfig, getComposer, getOverrides, resolveSubOptions } from "@tenmokuikko/eslint-common/factory";
import { isInEditorEnv } from "@tenmokuikko/eslint-common/utils";
import { jsx } from "./plugins/jsx";
import { react } from "./plugins/react";

export function tenmokuikko(
  options: OptionsConfig & Omit<TypedFlatConfigItem, "files"> = {},
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]
): FlatConfigComposer<TypedFlatConfigItem, ""> {
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

  const typescriptOptions = resolveSubOptions(options, "typescript");
  const tsconfigPath = "tsconfigPath" in typescriptOptions ? typescriptOptions.tsconfigPath : undefined;

  configs.push(
    jsx(),
    react({
      ...typescriptOptions,
      overrides: getOverrides(options, "react"),
      tsconfigPath,
    }),
  );

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
