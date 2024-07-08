import { NodeType } from "./ast";
import { helperNameMap, TO_DISPLAY_STRING } from "./runtimeHelpers";

export function generate(ast) {
    const context = createCodegenContext();
    const {push} = context;
    genFunctionPreamble(ast, context);

    push('return ');

    let functionName = 'render';
    const args = ['_ctx', '_cache'];
    const signature = args.join(', ');

    push(`function ${functionName}(${signature}) {`);
    push(`return `);
    genNode(ast.codegenRoot, context);
    push('}');


    return {
        code: context.code
    };
}

function genFunctionPreamble(ast: any, context) {
    const {push} = context;

    if (ast.helpers.length) {
        const vue = 'Vue';
        const helpers = ast.helpers.map(s => `${helperNameMap[s]}: _${helperNameMap[s]}`);
        push(`const { ${helpers.join(', ')} } = ${vue}\n`);
    }
}

function genNode(node: any, context) {
    const {push} = context;

    switch(node.type) {
        case NodeType.TEXT:
            getText(node, context);
            break;
        case NodeType.INTERPOLATION:
            getInterpolation(node, context);
            break
        case NodeType.SIMPLE_EXPRESSION:
            getExpression(node, context);
            break
    }
}

function getExpression(node: any, context: any) {
    const {push} = context;
    push(`${node.content}`);
}

function getInterpolation(node: any, context: any) {
    const {push, helper} = context;
    push(`${helper(TO_DISPLAY_STRING)}(`);
    genNode(node.content, context);
    push(')');
}

function getText(node: any, context: any) {
    const {push} = context;
    push(`"${node.content}"`);
}

function createCodegenContext() {
    const context = {
        code: '',
        push(txt) {
            context.code += txt;
        },
        helper(key) {
            return `_${helperNameMap[key]}`
        }
    };
    return context;
}