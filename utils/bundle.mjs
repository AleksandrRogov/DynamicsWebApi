import * as esbuild from "esbuild";
import { getBanner } from "./banner.mjs";

const browserPlugin = {
    name: "browserPlugin",
    setup(build) {
        build.onResolve({ filter: /platform\/node-/ }, async (args) => {
            const newPath = args.path.replace("node-", "browser-");
            const result = await build.resolve(newPath, {
                kind: args.kind,
                resolveDir: args.resolveDir,
            });
            if (result.errors.length > 0) {
                return { errors: result.errors };
            }
            return { path: result.path };
        });
    },
};

const banner = `/*! ${getBanner()} */`;

const esbuilds = [];

["dist/dynamics-web-api.cjs.js", "dist/dynamics-web-api.cjs.min.js", "dist/dynamics-web-api.js", "dist/dynamics-web-api.min.js"].forEach(function (outfile) {
    const minify = outfile.endsWith("min.js");
    const isNode = outfile.includes("cjs");

    const config = {
        entryPoints: ["src/dynamics-web-api.ts"],
        bundle: true,
        target: ["es2020"],
        platform: isNode ? "node" : "browser",
        packages: isNode ? "external" : undefined,
        minify: minify,
        outfile: outfile,
        banner: { js: banner },
        sourcemap: true,
        define: {
            "global.DWA_BROWSER": isNode ? "false" : "true",
        },
    };

    if (isNode) {
        config.target.push("node15.0");
    } else {
        config.plugins = [browserPlugin];
        config.define["global.window"] = "window";
    }

    esbuilds.push(esbuild.build(config));
});

try {
    await Promise.all(esbuilds);
    console.log("Bundles are done!");
} catch (errors) {
    console.error(errors);
}
