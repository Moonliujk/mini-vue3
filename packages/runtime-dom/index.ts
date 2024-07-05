import { createRender } from "@my-vue3/runtime-core";

function createElement(type) {
    return document.createElement(type);
}
function patchProp(el, key, prevVal, nextVal) {
    // onClick => click
    const isOn = (string: string) => /^on[A-Z]/.test(string);
    if (isOn(key)) {
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, nextVal);
    } else {
        if (nextVal) {
            el.setAttribute(key, nextVal);
        } else {
            el.removeAttribute(key);
        }
    }
}
function createTextNode(text) {
    return document.createTextNode(text);
}

function insert(el, parent) {
    return parent.append(el);
}

const render: any = createRender({
    createTextNode,
    createElement,
    patchProp,
    insert,
});

export function createApp(...arg) {
    return render.createApp(...arg);
}

export * from "@my-vue3/runtime-core"