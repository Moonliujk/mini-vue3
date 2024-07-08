import { NodeType } from "../ast";

export function transformCompoundElement(node) {
  if (node.type === NodeType.ELEMENT) {
    let children = node.children;

    function isText(node) {
        return [NodeType.TEXT, NodeType.INTERPOLATION].includes(node.type);
    }

    for (let i=0; i<children.length; i++) {
        let child = children[i];

        let currentContainer;
        if (isText(child)) {
            for (let j=i+1; j<children.length; j++) {
                if (isText(children[j])) {
                    if (!currentContainer) {
                        currentContainer = children[i] = {
                            type: NodeType.COMPOUND_ELEMENT,
                            children: [child]
                        };
                    }
                    currentContainer.children.push(' + ');
                    currentContainer.children.push(children[j]);
                    children.splice(j, 1);
                    j--;
                } else {
                    currentContainer = null;
                    break;
                }
            }
        }
    }
  }
}