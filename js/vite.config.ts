import { defineConfig } from 'vite';
import { resolve, extname, relative } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import dts from 'vite-plugin-dts';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    plugins: [
        // Automatically generates .d.ts files mirroring your module outputs
        dts({
            include: ['js'],
            outDir: 'dist'
        })
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        lib: {
            // Required by Vite but overridden by rollupOptions.input
            entry: resolve(__dirname, 'js/index.ts'),
            formats: ['es', 'cjs']
        },
        rollupOptions: {
            // Dynamically maps "js/module-name/index.ts" to "module-name/index" output
            input: Object.fromEntries(
                glob.sync('js/**/index.ts').map(file => [
                    relative(
                        'js',
                        file.slice(0, file.length - extname(file).length)
                    ),
                    fileURLToPath(new URL(file, import.meta.url))
                ])
            ),
            output: {
                // Preserves module folders inside the dist directory
                entryFileNames: '[name].[format].js',
                chunkFileNames: 'chunks/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        }
    }
});
