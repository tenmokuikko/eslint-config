import { antfu } from "@antfu/eslint-config";

export default antfu({
  stylistic: {
    quotes: "double",
    semi: true,
  },
  jsonc: true,
  yaml: true,
  typescript: true,
  formatters: {
    markdown: "prettier",
  },
});
