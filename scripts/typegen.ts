import fs from "node:fs/promises";

import { command, comments, disables, formatters, ignores, imports, javascript, jsdoc, jsonc, markdown, node, perfectionist, pnpm, regexp, sortPackageJson, stylistic, toml, typescript, unicorn, yaml } from "@tenmokuikko/eslint-common/configs";
import { combine } from "@tenmokuikko/eslint-common/utils";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import { builtinRules } from "eslint/use-at-your-own-risk";

const configs = await combine(
  {
    plugins: {
      "": {
        rules: Object.fromEntries(builtinRules.entries()),
      },
    },
  },
  command(),
  comments(),
  disables(),
  formatters(),
  ignores(),
  imports(),
  javascript(),
  jsdoc(),
  jsonc(),
  markdown(),
  node(),
  perfectionist(),
  pnpm(),
  regexp(),
  sortPackageJson(),
  stylistic(),
  toml(),
  typescript(),
  unicorn(),
  yaml(),
);

const configNames = configs.map(i => i.name).filter(Boolean) as string[];

let dts = await flatConfigsToRulesDTS(configs, {
  includeAugmentation: false,
});

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(i => `'${i}'`).join(" | ")}
`;

await fs.writeFile("packages/common/src/typegen.d.ts", dts);
