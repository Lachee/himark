import { resolve } from 'path';
import { defineConfig } from 'vite';

const browsify = true;

export default defineConfig({
    css: {
        postcss: {
            plugins: [],
        },
    },
    build: {
        minify: browsify,
        sourcemap: true,
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/lib/index.ts'),
            name: 'HiMark',
            // the proper extensions will be added
            fileName: (format) => `himark-md.${browsify ? 'min' : format}.js`,
            formats: browsify ? [ 'iife' ] : [ 'es', 'umd' ],
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
