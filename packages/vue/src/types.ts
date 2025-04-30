import type { OptionsConfig, OptionsOverrides } from "@tenmokuikko/eslint-common/types";
import type { Options as VueBlocksOptions } from "eslint-processor-vue-blocks";

export interface OptionsVue extends OptionsOverrides {
  /**
   * Create virtual files for Vue SFC blocks to enable linting.
   *
   * @see https://github.com/antfu/eslint-processor-vue-blocks
   * @default true
   */
  sfcBlocks?: boolean | VueBlocksOptions;

  /**
   * Vue version. Apply different rules set from `eslint-plugin-vue`.
   *
   * @default 3
   */
  vueVersion?: 2 | 3;

  /**
   * Vue accessibility plugin. Help check a11y issue in `.vue` files upon enabled
   *
   * @see https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility/
   * @default false
   */
  a11y?: boolean;
}

export interface VueOptionsConfig extends OptionsConfig {
  /**
   * Enable Vue support.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean | OptionsVue;
}
