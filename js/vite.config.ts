import { defineConfig } from "vite";
import { resolve, extname, normalize, isAbsolute, dirname } from "path";
import { fileURLToPath } from "url";
import { glob } from "glob";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { viteStaticCopy } from "vite-plugin-static-copy";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        cssInjectedByJsPlugin({
            relativeCSSInjection: true, // Ensures only the module's own CSS is bundled into its script tag
        }),
        dts({
            entryRoot: ".",
            outDir: "dist",
        }),
        viteStaticCopy({
            targets: [
                {
                    src: [
                        "**/*.html",
                        "!node_modules/**",
                        "!dist/**",
                        "!artifacts/**",
                    ],
                    dest: ".", // Automatically preserves original relative paths (e.g. src/foo/index.html -> dist/src/foo/index.html)
                },
            ],
        }),
    ],
    build: {
        outDir: "dist",
        emptyOutDir: true,
        cssCodeSplit: true,
        lib: {
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
                        ignore: ["node_modules/**", "dist/**", "artifacts/**"],
                    })
                    .map((file) => {
                        const noExt = file.slice(
                            0,
                            file.length - extname(file).length,
                        );

                        return [noExt, resolve(__dirname, file)];
                    }),
            ),
            output: {
                chunkFileNames: "chunks/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash].[ext]",
                exports: "named",
            },
        },
        watch: {
            exclude: ['dist/**', 'node_modules/**'],
            include: ['noto/**'],
        },
    },
});
