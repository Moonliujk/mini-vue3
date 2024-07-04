import { hasOwn } from "@my-vue3/share";

const publicPropertyMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots,
};

export const PublicInstanceProxyHandlers = {
    get(instance, key) {
        const { setupState, props } = instance;

        if (hasOwn(setupState, key)) {
            return setupState[key];
        } else if (hasOwn(props, key)) {
            return props[key];
        }
        if (publicPropertyMap[key]) {
            return publicPropertyMap[key](instance);
        }
    }
}