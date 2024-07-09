import * as runtimeDom from "@my-vue3/runtime-dom";
import { registerRuntimeCompiler } from "@my-vue3/runtime-dom";

import { baseCompile } from "@my-vue3/compiler-core";

export * from "@my-vue3/runtime-dom";

function compileToFunction(template) {
    const {code} = baseCompile(template);
    const render = new Function('Vue', code)(runtimeDom);

    return render
}

registerRuntimeCompiler(compileToFunction);