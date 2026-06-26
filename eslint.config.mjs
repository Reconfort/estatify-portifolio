import nx from "@nx/eslint-plugin";

/**
 * Root flat ESLint config — the architectural boundary contract.
 * Two-dimensional tags (scope:* + type:*) are enforced here; violations fail CI.
 * See docs/ARCHITECTURE.md ADR-006.
 */
export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/react"],
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            { sourceTag: "scope:marketing", onlyDependOnLibsWithTags: ["scope:marketing", "scope:shared"] },
            { sourceTag: "scope:workspace", onlyDependOnLibsWithTags: ["scope:workspace", "scope:shared"] },
            { sourceTag: "scope:platform", onlyDependOnLibsWithTags: ["scope:platform", "scope:shared"] },
            { sourceTag: "scope:sites", onlyDependOnLibsWithTags: ["scope:sites", "scope:shared"] },
            { sourceTag: "scope:api", onlyDependOnLibsWithTags: ["scope:api", "scope:shared"] },
            { sourceTag: "scope:shared", onlyDependOnLibsWithTags: ["scope:shared"] },

            { sourceTag: "type:app", onlyDependOnLibsWithTags: ["type:feature", "type:ui", "type:data-access", "type:util"] },
            { sourceTag: "type:feature", onlyDependOnLibsWithTags: ["type:feature", "type:ui", "type:data-access", "type:util"] },
            { sourceTag: "type:ui", onlyDependOnLibsWithTags: ["type:ui", "type:util"] },
            { sourceTag: "type:data-access", onlyDependOnLibsWithTags: ["type:data-access", "type:util"] },
            { sourceTag: "type:util", onlyDependOnLibsWithTags: ["type:util"] }
          ]
        }
      ]
    }
  },
  {
    ignores: ["**/dist", "**/.next", "**/node_modules", "**/out"]
  }
];
