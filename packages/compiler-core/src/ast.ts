import { CREATE_ELEMENT_VNODE } from "./runtimeHelpers";

export const enum NodeType {
    INTERPOLATION,
    SIMPLE_EXPRESSION,
    ELEMENT,
    TEXT,
    ROOT,
    COMPOUND_ELEMENT
}

export function createVNodeCall(context, tag, props?, children?) {
    if (context) {
      context.helper(CREATE_ELEMENT_VNODE);
    }
  
    return {
      // TODO vue3 里面这里的 type 是 VNODE_CALL
      // 是为了 block 而 mini-vue 里面没有实现 block 
      // 所以创建的是 Element 类型就够用了
      type: NodeType.ELEMENT,
      tag,
      props,
      children,
    };
  }