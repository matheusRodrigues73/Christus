import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import pluginJest from "eslint-plugin-jest";

export default defineConfig([
  { files: ["**/*.js"], plugins: { js }, extends: ["js/recommended"] },
  {
    files: ["**/*.test.js"],
    plugins: { pluginJest },
    extends: ["pluginJest/recommended"],
  },
  ...nextVitals,
]);
