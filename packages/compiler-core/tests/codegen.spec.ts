import { generate } from "../src/codegen";
import { baseParse } from "../src/parse";
import { transformElement } from "../src/tranforms/transformElement";
import { transformExpression } from "../src/tranforms/transformExpression";
import { transformCompoundElement } from "../src/tranforms/transformText";
import { transform } from "../src/transform";

describe('codegen', () => {
    it('string', () => {
        const ast = baseParse('hi');
        transform(ast);
        console.log('ast --------- ', ast);

        const {code} = generate(ast);
        expect(code).toMatchSnapshot();
    });

    it('interpolation', () => {
        const ast = baseParse('{{message}}');
        transform(ast, {
            nodeTransforms: [transformExpression]
        });

        const {code} = generate(ast);
        expect(code).toMatchSnapshot();
    });

    it.skip('element', () => {
        const ast = baseParse('<div></div>');
        transform(ast, {
            nodeTransforms: [transformElement]
        });

        const {code} = generate(ast);
        expect(code).toMatchSnapshot();
    });

    it('compound element', () => {
        const ast = baseParse('<div>hi, {{message}}</div>');
        transform(ast, {
            nodeTransforms: [transformExpression, transformElement, transformCompoundElement]
        });

        const {code} = generate(ast);
        expect(code).toMatchSnapshot();
    });
});