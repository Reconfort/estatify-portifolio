import nx from "@nx/eslint-plugin";
import tseslint from "typescript-eslint";

/**
 * Root flat ESLint config — the architectural boundary contract.
 * Two-dimensional tags (scope:* + type:*) are enforced here; violations fail CI.
 * See docs/ARCHITECTURE.md ADR-006.
 *
 * Nx flat/react ships some @typescript-eslint rules on JS/MJS globs without
 * registering the plugin in the same config object (ESLint 9 requires that).
 * Inject the plugin wherever those rules appear.
 */
function withTypescriptEslintPlugin(configs) {
  return configs.map((config) => {
    if (!config?.rules) return config;
    const usesTsPlugin = Object.keys(config.rules).some((rule) =>
      rule.startsWith("@typescript-eslint/"),
    );
    if (!usesTsPlugin) return config;
    return {
      ...config,
      plugins: {
        ...config.plugins,
        "@typescript-eslint": tseslint.plugin,
      },
    };
  });
}

export default [
  ...withTypescriptEslintPlugin([
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/react"],
  ]),
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: "scope:marketing",
              onlyDependOnLibsWithTags: ["scope:marketing", "scope:shared"],
            },
            {
              sourceTag: "scope:workspace",
              onlyDependOnLibsWithTags: ["scope:workspace", "scope:shared"],
            },
            {
              sourceTag: "scope:platform",
              onlyDependOnLibsWithTags: ["scope:platform", "scope:shared"],
            },
            { sourceTag: "scope:sites", onlyDependOnLibsWithTags: ["scope:sites", "scope:shared"] },
            { sourceTag: "scope:api", onlyDependOnLibsWithTags: ["scope:api", "scope:shared"] },
            { sourceTag: "scope:shared", onlyDependOnLibsWithTags: ["scope:shared"] },

            {
              sourceTag: "type:app",
              onlyDependOnLibsWithTags: [
                "type:feature",
                "type:ui",
                "type:data-access",
                "type:util",
              ],
            },
            {
              sourceTag: "type:feature",
              onlyDependOnLibsWithTags: [
                "type:feature",
                "type:ui",
                "type:data-access",
                "type:util",
              ],
            },
            { sourceTag: "type:ui", onlyDependOnLibsWithTags: ["type:ui", "type:util"] },
            {
              sourceTag: "type:data-access",
              onlyDependOnLibsWithTags: ["type:data-access", "type:util"],
            },
            { sourceTag: "type:util", onlyDependOnLibsWithTags: ["type:util"] },
          ],
        },
      ],
    },
  },
  {
    ignores: ["**/dist", "**/.next", "**/node_modules", "**/out"],
  },
];
