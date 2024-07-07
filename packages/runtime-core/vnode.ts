import { ShapeFlags, isObject } from "@my-vue3/share";

export const Fragment = Symbol('Fragment');
export const Text = Symbol('Text');

export function createVNode(type, props?: any, children?) {
    const vnode = {
        type,
        props: props || {},
        children,
        key: props && props.key,
        component: null,
        shapeFlag: getShapeFlag(type),
        el: null
    }
    if (typeof children === 'string') {
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
    } else if (Array.isArray(children)) {
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
    }
    // 标记组件存在插槽（需要对子节点做处理）
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        isObject(children) && (vnode.shapeFlag |= ShapeFlags.SlOT_CHILDREN)
    }
    return vnode;
}

export function createTextVNode(text) {
    return createVNode(Text, {}, text);
}

function getShapeFlag(type) {
    return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}