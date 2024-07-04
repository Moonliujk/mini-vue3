import { ShapeFlags } from '@my-vue3/share';

export function initSlots(instance: any, children) {
    const {vnode} = instance;
    if (vnode.shapeFlag & ShapeFlags.SlOT_CHILDREN) {
        normalizeSlotObj(children, instance.slots);
    }
}

function normalizeSlotObj(children, slots) {
    for (let key in children) {
        let slot = children[key];
        slots[key] = (props) => normalizeSlotValue(slot(props));
    }
}

function normalizeSlotValue(slot) {
    return Array.isArray(slot) ? slot : [slot];
}