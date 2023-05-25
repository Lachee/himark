import { resolve } from 'path';
import { defineConfig } from 'vite';

const minify = true;

export default defineConfig({
    css: {
        postcss: {
            plugins: [],
        },
    },
    build: {
        minify: minify,
        sourcemap: true,
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/lib/Editor.ts'),
            name: 'DiscussMD',
            // the proper extensions will be added
            fileName: (format) => `discuss-md` + (minify ? '.min.js' : '.js'),
            formats: [ 'iife' ],
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: [ ],
            output: {
                //extend: true,
                globals: {
                  //'codemirror': 'codemirror', // Replace 'DependencyLibrary' with the global variable name of your dependency
                },
            },
        },
    }
});
