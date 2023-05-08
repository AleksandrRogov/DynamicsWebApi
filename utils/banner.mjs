import packageJson from "../package.json" assert { type: "json" };

export function getBanner() {
    return `${packageJson.name} v${packageJson.version} (c) ${new Date().getFullYear()} Aleksandr Rogov`;
}
