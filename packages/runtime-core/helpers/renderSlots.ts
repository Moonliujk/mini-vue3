import { Fragment, createVNode } from "../vnode";

export function renderSlots(slots, key, props) {
    const slot = slots[key];
    if (slot) {
        return createVNode(Fragment, {}, slot(props));
    }
}