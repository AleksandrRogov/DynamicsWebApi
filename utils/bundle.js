import * as esbuild from "esbuild";
import { getBanner } from "./banner.js";

const banner = `/*! ${getBanner()} */`;

const external = ["debug", "http-proxy-agent", "https-proxy-agent", "agent-base"];

const browserPlugin = {
    name: "skip-node-modules",
    setup(build) {
        build.onLoad({ filter: /client[\\/]http\.ts$/ }, () => ({ contents: "", loader: "ts" }));
        build.onLoad({ filter: /helpers[\\/]crypto[\\/]node\.ts$/ }, () => ({ contents: "", loader: "ts" }));
    },
};

const nodePlugin = {
    name: "skip-xhr-modules",
    setup(build) {
        build.onLoad({ filter: /client[\\/]xhr\.ts$/ }, () => ({ contents: "", loader: "ts" }));
    },
};

const builds = {
    "": { platform: "browser", extension: ".js", minify: false, iife: true },
    "cjs/": { platform: "node", extension: ".cjs", minify: false },
    "esm/": { platform: "node", extension: ".js", minify: false },
    "browser/esm/": { platform: "browser", extension: ".js", minify: false },
};

const esbuilds = [];

for (const [folder, config] of Object.entries(builds)) {
    const isBrowser = config.platform === "browser";

    for (const minify of [false, true]) {
        const buildConfig = {
            entryPoints: ["src/dynamics-web-api.ts"],
            bundle: true,
            target: ["es2020"],
            platform: config.platform,
            minify: minify,
            outfile: `dist/${folder}dynamics-web-api${minify ? ".min" : ""}${config.extension}`,
            banner: { js: banner },
            sourcemap: true,
            define: {
                "global.DWA_BROWSER": isBrowser ? "true" : "false",
            },
            packages: isBrowser ? undefined : "external",
            external: external,
            plugins: isBrowser ? [browserPlugin] : [nodePlugin],
        };

        if (isBrowser) {
            buildConfig.define["global.window"] = "window";

            if (config.iife) {
                buildConfig.globalName = "_dynamicsWebApiExports";
                buildConfig.footer = { js: "var DynamicsWebApi = _dynamicsWebApiExports.DynamicsWebApi" };
            }
        } else {
            buildConfig.target.push("node20.0");
        }

        esbuilds.push(esbuild.build(buildConfig));
    }
}

try {
    await Promise.all(esbuilds);
    console.log("Bundles are done!");
} catch (errors) {
    console.error(errors);
}
