import { isString } from "@my-vue3/share";
import { NodeType } from "./ast";
import { helperNameMap, TO_DISPLAY_STRING, CREATE_ELEMENT_VNODE } from "./runtimeHelpers";

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
    genNode(ast.codegenNode, context);
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
    switch(node.type) {
        case NodeType.TEXT:
            genText(node, context);
            break;
        case NodeType.INTERPOLATION:
            genInterpolation(node, context);
            break
        case NodeType.ELEMENT:
            genElement(node, context);
            break
        case NodeType.SIMPLE_EXPRESSION:
            genExpression(node, context);
            break
        case NodeType.COMPOUND_ELEMENT:
            genCompoundElement(node, context);
            break
    }
}

function genCompoundElement(node, context){
    const { push } = context;
    let children = node.children;

    for (let i=0; i<children.length; i++) {
        let child = children[i];
        if (isString(child)) {
            push(child);
        } else {
            genNode(child, context);
        }
    }
}

function genExpression(node: any, context: any) {
    const {push} = context;
    push(`${node.content}`);
}

function genElement(node, context) {
    const {push, helper} = context;
    const { tag, props, children } = node;

    push(`${helper(CREATE_ELEMENT_VNODE)}(`);
    genNodeList(genNullableArgs([tag, props, children]), context);
    push(')');
}

function genNodeList(nodes: any, context: any) {
    const { push } = context;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
  
      if (isString(node)) {
        push(`${node}`);
      } else {
        genNode(node[0], context);
      }
      // node 和 node 之间需要加上 逗号(,)
      // 但是最后一个不需要 "div", [props], [children]
      if (i < nodes.length - 1) {
        push(", ");
      }
    }
  }
  
  function genNullableArgs(args) {
    // 把末尾为null 的都删除掉
    // vue3源码中，后面可能会包含 patchFlag、dynamicProps 等编译优化的信息
    // 而这些信息有可能是不存在的，所以在这边的时候需要删除掉
    let i = args.length;
    // 这里 i-- 用的还是特别的巧妙的
    // 当为0 的时候自然就退出循环了
    while (i--) {
      if (args[i] != null) break;
    }
  
    // 把为 falsy 的值都替换成 "null"
    return args.slice(0, i + 1).map((arg) => arg || "null");
  }

function genInterpolation(node: any, context: any) {
    const {push, helper} = context;
    push(`${helper(TO_DISPLAY_STRING)}(`);
    genNode(node.content, context);
    push(')');
}

function genText(node: any, context: any) {
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