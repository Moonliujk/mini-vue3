export function transform(root, options) {
    const context = createTransformContext(root, options)
    console.log('root', root);
    traverseNode(root.children[0], context);
}

function createTransformContext(root, options) {
    return {
        root,
        nodeTransforms: options.nodeTransforms || []
    };
}

function traverseNode(node, context) {
    console.log(node);
    const children = node.children;
    const nodeTransforms = context.nodeTransforms;

    nodeTransforms.forEach(plugin => plugin(node));

    traverseChildren(children, context);
}


function traverseChildren(children: any, context: any) {
    if (children) {
        for (let i = 0; i < children.length; i++) {
            const node = children[i];
            traverseNode(node, context);
        }
    }
}

