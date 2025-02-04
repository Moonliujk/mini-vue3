import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";

export default {
    input: './packages/vue/src/index.ts',
    output: [{
        format: 'cjs',
        file: './packages/vue/dist/my-vue3.cjs.js'
    }, {
        format: 'es',
        file: './packages/vue/dist/my-vue3.esm.js'
    }],
    plugins: [
        resolve(),
        typescript(),
    ]
}