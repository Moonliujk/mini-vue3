import { NodeType } from "../src/ast";
import { baseParse } from "../src/parse";

describe('Parse', () => {
    describe('interpolation', () => {
        test('simple test', () => {
            const ast = baseParse('{{ message }}');

            expect(ast.children[0]).toStrictEqual({
                type: NodeType.INTERPOLATION,
                content: {
                    type: NodeType.SIMPLE_EXPRESSION,
                    content: 'message'
                }
            });
        });
    });

    describe('element', () => {
        test('simple div', () => {
            const ast = baseParse('<div></div>');

            expect(ast.children[0]).toStrictEqual({
                type: NodeType.ELEMENT,
                tag: 'div',
                children: []
            });
        });
    });

    describe('text', () => {
        test('simple div', () => {
            const ast = baseParse('some text');

            expect(ast.children[0]).toStrictEqual({
                type: NodeType.TEXT,
                content: 'some text'
            });
        });
    });
});

test('combination 1', () => {
    const ast = baseParse('<div>hi, {{message}}</div>');

    expect(ast.children[0]).toStrictEqual({
        type: NodeType.ELEMENT,
        tag: 'div',
        children: [{
            type: NodeType.TEXT,
            content: 'hi, '
        }, {
            type: NodeType.INTERPOLATION,
            content: {
                type: NodeType.SIMPLE_EXPRESSION,
                content: 'message'
            }
        }]
    });
});

test('nested element', () => {
    const ast = baseParse('<div><p>hi</p>{{message}}</div>');

    expect(ast.children[0]).toStrictEqual({
        type: NodeType.ELEMENT,
        tag: 'div',
        children: [{
            type: NodeType.ELEMENT,
            tag: 'p',
            children: [{
                type: NodeType.TEXT,
                content: 'hi'
            }]
        }, {
            type: NodeType.INTERPOLATION,
            content: {
                type: NodeType.SIMPLE_EXPRESSION,
                content: 'message'
            }
        }]
    });
});

test.skip('should throw an error when there is no matched end tag', () => {
    expect(() => {
        baseParse('<div><span></div>');
    }).toThrow(`end tag don't match start tag: span`);
});