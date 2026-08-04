import { defineConfig } from "vite";
import { resolve, extname, normalize, isAbsolute } from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        cssInjectedByJsPlugin({
            relativeCSSInjection: true, // Ensures only the module's own CSS is bundled into its script tag
        }),
        dts({
            // Tells the dts plugin to mirror your dynamic input configuration
            entryRoot: ".",
            outDir: "dist",
        }),
    ],
    build: {
        outDir: "dist",
        emptyOutDir: true,
        cssCodeSplit: true,
        lib: {
            // Fallback required by Vite
            entry: resolve(__dirname, "js/index.ts"),
            formats: ["es", "cjs"],
            fileName: (format, entryName) => {
                const ext = format === "cjs" ? "cjs" : "js";
                return `${entryName}.${ext}`;
            },
        },
        rollupOptions: {
            external: (id) => {
                const normalizedId = normalize(id);

                // Inline all relative or local absolute paths
                if (id.startsWith(".") || isAbsolute(normalizedId)) {
                    if (normalizedId.includes("node_modules")) {
                        return true;
                    }
                    return false;
                }
                return true;
            },
            input: Object.fromEntries(
                glob
                    .sync("**/index.{ts,tsx}", {
                        ignore: [
                            "node_modules/**",
                            "dist/**",
                            "artifacts/**", // Add any other build/cache dirs here
                        ],
                    })
                    .map((file) => {
                        // 1. Strip the extension (.ts)
                        const noExt = file.slice(
                            0,
                            file.length - extname(file).length,
                        );

                        // 2. The key ('noExt') becomes the exact relative path inside the dist/ folder.
                        // e.g., "src/agent_proxy/index" -> "dist/src/agent_proxy/index.esm.js"
                        // e.g., "js/module-name/index"  -> "dist/js/module-name/index.esm.js"
                        return [
                            noExt,
                            fileURLToPath(new URL(file, import.meta.url)),
                        ];
                    }),
            ),
            output: {
                chunkFileNames: "chunks/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash].[ext]",
                exports: "named",
            },
        },
    },
});
