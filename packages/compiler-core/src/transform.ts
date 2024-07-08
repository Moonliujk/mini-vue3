import { NodeType } from "./ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";

export function transform(root, options = {}) {
    const context = createTransformContext(root, options);
    traverseNode(root.children[0], context);
    createCodegenRoot(root);

    root.helpers.push(...context.helpers.keys());
}

function createCodegenRoot(root) {
    const { children } = root;
    // 只支持有一个根节点
  // 并且还是一个 single text node
  const child = children[0];

  // 如果是 element 类型的话 ， 那么我们需要把它的 codegenNode 赋值给 root
  // root 其实是个空的什么数据都没有的节点
  // 所以这里需要额外的处理 codegenNode
  // codegenNode 的目的是专门为了 codegen 准备的  为的就是和 ast 的 node 分离开
  if (child.type === NodeType.ELEMENT && child.codegenNode) {
    const codegenNode = child.codegenNode;
    root.codegenNode = codegenNode;
  } else {
    root.codegenNode = child;
  }
}

function createTransformContext(root, options) {
    const context = {
        root,
        nodeTransforms: options.nodeTransforms || [],
        helpers: new Map(),
        helper (name) {
            const count = context.helpers.get(name) || 0;
            context.helpers.set(name, count + 1);
        }
    }
    return context;
}

function traverseNode(node, context) {
    const type = node.type;
    const children = node.children;
    const nodeTransforms = context.nodeTransforms;

    nodeTransforms.forEach(plugin => plugin(node, context));

    switch(type) {
        case NodeType.COMPOUND_ELEMENT:
        case NodeType.ELEMENT:
        case NodeType.ROOT:
            traverseChildren(children, context);
            break;
        case NodeType.INTERPOLATION:
            context.helper(TO_DISPLAY_STRING);
            break;
    }
}


function traverseChildren(children: any, context: any) {
    if (children) {
        for (let i = 0; i < children.length; i++) {
            const node = children[i];
            traverseNode(node, context);
        }
    }
}

