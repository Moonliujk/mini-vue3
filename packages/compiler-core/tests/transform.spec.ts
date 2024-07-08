import { NodeType } from "../src/ast";
import { baseParse } from "../src/parse";
import { transform } from "../src/transform";

describe('transform', () => {
    it('transform', () => {
        const ast = baseParse('<div>hi,{{message}}</div>');

        const plugin = (node) => {
            if (node.type === NodeType.TEXT) {
                node.content += 'mini-vue'
            }
        };
        transform(ast, {
            nodeTransforms: [plugin]
        });

        const result = ast.children[0].children[0];
        expect(result.content).toBe('hi,mini-vue');
    });
});