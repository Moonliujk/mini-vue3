import { createRender } from "@my-vue3/runtime-core";

function createElement(type) {
    return document.createElement(type);
}
function patchProp(el, key, value) {
    // onClick => click
    const isOn = (string: string) => /^on[A-Z]/.test(string);
    if (isOn(key)) {
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, value);
    } else {
      value =
        typeof value === "string"
          ? value
          : (value as Array<string>).join(" ");
      (el as HTMLElement).setAttribute(key, value as string);
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