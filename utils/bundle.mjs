import * as esbuild from "esbuild";
import { getBanner } from "./banner.mjs";

const browserPlugin = {
    name: "example",
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

["dist/dynamics-web-api.node.js", "dist/dynamics-web-api.node.min.js"].forEach(async function (outfile) {
    const minify = outfile.endsWith("min.js");

    await esbuild.build({
        entryPoints: ["src/dynamics-web-api.ts"],
        bundle: true,
        target: ["es2020", "node15.0"],
        platform: "node",
        packages: "external",
        minify: minify,
        outfile: outfile,
        banner: { js: banner },
        sourcemap: true,
        define: {
            "global.DWA_TEST": "false",
            "global.DWA_BROWSER": "false",
        },
    });
});

["dist/dynamics-web-api.js", "dist/dynamics-web-api.min.js"].forEach(async function (outfile) {
    const minify = outfile.endsWith("min.js");

    await esbuild.build({
        entryPoints: ["src/dynamics-web-api.ts"],
        bundle: true,
        target: ["es2020"],
        platform: "browser",
        banner: { js: banner },
        outfile: outfile,
        minify: minify,
        sourcemap: true,
        plugins: [browserPlugin],
        define: {
            "global.DWA_TEST": "false",
            "global.DWA_BROWSER": "true",
        },
    });
});
