import * as esbuild from "esbuild";
import { glob } from "glob";

const tsFiles = await glob(`src/**/*.ts`, { ignore: `src/types/**` });

//mot using this for now because of broken nyc coverage. could be an issue with a sourcemap
await esbuild.build({
    entryPoints: tsFiles,
    logLevel: "info",
    outdir: `lib`,
    sourcemap: true,
    target: ["es2020", "node15.0"],
    platform: "node",
    packages: "external",
    format: "cjs",
    define: {
        "global.DWA_TEST": "true",
    },
});
