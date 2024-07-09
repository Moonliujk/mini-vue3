import { generate } from "./codegen";
import { baseParse } from "./parse";
import { transformElement } from "./tranforms/transformElement";
import { transformExpression } from "./tranforms/transformExpression";
import { transformCompoundElement } from "./tranforms/transformText";
import { transform } from "./transform";


export function baseCompile(template) {
    const ast = baseParse(template);
    transform(ast, {
        nodeTransforms: [transformExpression, transformCompoundElement, transformElement]
    });

    return generate(ast);
}