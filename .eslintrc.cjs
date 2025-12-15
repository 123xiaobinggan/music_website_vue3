/* eslint-env node */

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended"
  ],
  parserOptions: {
    ecmaVersion: 2021,      // ✔ 必须使用数字，不是字符串
    sourceType: "module",   // ✔ 允许使用 import/export
  },
  rules: {
    "vue/multi-word-component-names": "off",
    "no-unused-vars": "off",           // 禁用未使用变量检查
    "no-unused-imports": "off",        // 禁用未使用导入检查
    "@typescript-eslint/no-unused-vars": "off"  // TypeScript 的未使用变量检查
  }
};
