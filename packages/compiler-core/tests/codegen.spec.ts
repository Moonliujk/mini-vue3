import { generate } from "../src/codegen";
import { baseParse } from "../src/parse";
import { transformExpression } from "../src/tranforms/transformExpression";
import { transform } from "../src/transform";

describe('codegen', () => {
    it('string', () => {
        const ast = baseParse('hi');
        transform(ast);

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
});