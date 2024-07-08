import { NodeType } from "./ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";

export function transform(root, options = {}) {
    const context = createTransformContext(root, options);
    traverseNode(root.children[0], context);
    createCodegenRoot(root);

    root.helpers.push(...context.helpers.keys());
}

function createCodegenRoot(root) {
    root.codegenRoot = root.children[0];
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

    nodeTransforms.forEach(plugin => plugin(node));

    switch(type) {
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

