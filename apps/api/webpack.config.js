const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

const swaggerRoot = path.dirname(require.resolve("@nestjs/swagger/package.json"));
const schemaObjectFactory = path.join(swaggerRoot, "dist/services/schema-object-factory.js");

/**
 * Nest webpack config — bundle workspace `@estatify/*` packages (TypeScript
 * entrypoints) and rewrite nestjs-zod's deep @nestjs/swagger import, which Nest 11
 * package "exports" block at runtime.
 */
module.exports = function (options, webpackRef) {
  const w = webpackRef ?? webpack;
  return {
    ...options,
    externals: [
      nodeExternals({
        allowlist: [/^@estatify\//, "nestjs-zod", /^nestjs-zod\//, /schema-object-factory/],
      }),
    ],
    plugins: [
      ...(options.plugins ?? []),
      new w.NormalModuleReplacementPlugin(
        /@nestjs[/\\]swagger[/\\]dist[/\\]services[/\\]schema-object-factory/,
        schemaObjectFactory,
      ),
    ],
    resolve: {
      ...options.resolve,
      alias: {
        ...(options.resolve?.alias ?? {}),
        "@nestjs/swagger/dist/services/schema-object-factory": schemaObjectFactory,
        "@nestjs/swagger/dist/services/schema-object-factory.js": schemaObjectFactory,
      },
    },
    module: {
      ...options.module,
      rules: (options.module?.rules ?? []).map((rule) => {
        if (!rule || typeof rule !== "object" || !("loader" in rule)) return rule;
        const usesTsLoader =
          rule.loader === "ts-loader" ||
          (Array.isArray(rule.use) &&
            rule.use.some((u) => u === "ts-loader" || u?.loader === "ts-loader"));
        if (!usesTsLoader) return rule;
        return {
          ...rule,
          options: {
            ...(typeof rule.options === "object" ? rule.options : {}),
            transpileOnly: true,
            allowTsInNodeModules: true,
          },
        };
      }),
    },
  };
};
