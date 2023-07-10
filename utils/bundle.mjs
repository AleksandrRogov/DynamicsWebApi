import * as esbuild from "esbuild";
import { getBanner } from "./banner.mjs";

const banner = `/*! ${getBanner()} */`;

const esbuilds = [];

["", "cjs/", "esm/", "browser/esm/"].forEach((folder) => {
    const isBrowser = folder.startsWith("browser") || folder === "";
    const platform = folder.endsWith("esm/") ? "neutral" : isBrowser ? "browser" : "node";
    const extension = !isBrowser && platform === "neutral" ? ".mjs" : ".js"; //only for node esm modules

    let minify = folder !== "";

    do {
        minify = !minify;

        const config = {
            entryPoints: ["src/dynamics-web-api.ts"],
            bundle: true,
            target: ["es2020"],
            platform: platform,
            packages: !isBrowser ? "external" : undefined,
            minify: minify,
            outfile: `dist/${folder}dynamics-web-api${minify ? ".min" : ""}${extension}`,
            banner: { js: banner },
            sourcemap: true,
            define: {
                "global.DWA_BROWSER": isBrowser ? "true" : "false",
            },
        };

        if (!isBrowser) {
            config.target.push("node15.0");
            if (platform === "neutral") {
                config.outExtension = { ".js": ".mjs" };
            }
        } else {
            config.define["global.window"] = "window";

            //for iife only
            if (folder === "") {
                config.globalName = "_dynamicsWebApiExports";
                config.footer = { js: "var DynamicsWebApi = _dynamicsWebApiExports.DynamicsWebApi" };
            }
        }

        esbuilds.push(esbuild.build(config));
    } while (minify);
});

try {
    await Promise.all(esbuilds);
    console.log("Bundles are done!");
} catch (errors) {
    console.error(errors);
}
