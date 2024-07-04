import { render } from "./render";
import { createVNode } from "./vnode";

export function createApp(rootComp) {
    return {
        mount(rootContainer) {
            // vue3 均是基于虚拟节点做出操作
            if (typeof rootContainer === 'string') {
                rootContainer = document.querySelector(rootContainer);
            }
            const vnode = createVNode(rootComp);
            render(vnode, rootContainer);
        }
    }
}