import { createVNodeCall, NodeType } from "../ast";

export function transformElement(node, context) {
  if (node.type === NodeType.ELEMENT) {
    const vnodeTag = `'${node.tag}'`;
    const vnodeProps = null;
    let vnodeChildren = node.children;
    if (node.children.length > 0) {
      if (node.children.length === 1) {
        // 只有一个孩子节点 ，那么当生成 render 函数的时候就不用 [] 包裹
        const child = node.children[0];
        vnodeChildren = child;
      }
    }

    node.codegenNode = createVNodeCall(
      context,
      vnodeTag,
      vnodeProps,
      vnodeChildren
    );
  }
}