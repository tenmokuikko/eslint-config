import type { Awaitable, ConfigNames, OptionsConfig, TypedFlatConfigItem } from "@tenmokuikko/eslint-common/types";
import type { Linter } from "eslint";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import type { VueOptionsConfig } from "./types";
import { disables } from "@tenmokuikko/eslint-common/configs";
import { flatConfigProps, getCommonConfig, getComposer, getOverrides, resolveSubOptions } from "@tenmokuikko/eslint-common/factory";
import { isInEditorEnv } from "@tenmokuikko/eslint-common/utils";
import { isPackageExists } from "local-pkg";
import { vue } from "./plugins/vue-core";

const VuePackages = [
  "vue",
  "nuxt",
  "vitepress",
  "@slidev/cli",
];
export function tenmokuikko(
  options: VueOptionsConfig & Omit<TypedFlatConfigItem, "files"> = {},
  ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
  let isInEditor = options.isInEditor;
  if (isInEditor == null) {
    isInEditor = isInEditorEnv();
    if (isInEditor)
    // eslint-disable-next-line no-console
      console.log("[@antfu/eslint-config] Detected running in editor, some rules are disabled.");
  }
  const {
    jsx: enableJsx = true,
    vue: enableVue = VuePackages.some(i => isPackageExists(i)),
    typescript: enableTypeScript = isPackageExists("typescript"),
  } = options;
  const stylisticOptions = options.stylistic === false
    ? false
    : typeof options.stylistic === "object"
      ? options.stylistic
      : {};
  if (stylisticOptions && !("jsx" in stylisticOptions))
    stylisticOptions.jsx = enableJsx;
  const componentExts = [];
  if (enableVue) {
    componentExts.push("vue");
  }
  const configs: Awaitable<TypedFlatConfigItem[]>[] = getCommonConfig({ ...options, componentExts }, stylisticOptions, isInEditor);
  if (enableVue) {
    configs.push(vue({
      ...resolveSubOptions(options, "vue"),
      overrides: getOverrides(options, "vue"),
      stylistic: stylisticOptions,
      typescript: !!enableTypeScript,
    }));
  }
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
