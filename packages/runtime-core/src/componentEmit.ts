import { toUpperFirstChar } from "@my-vue3/share";

export function emit(instance, name, ...args) {
    console.log('emit', name);
    const { props } = instance;
    
    // TPP 开发模式：可以先开发一个特定场景的功能，在根据需要将这个能力通用化
    // add => Add
    // add-foo => addFoo

    const eventName = (string) => `on${toUpperFirstChar(string)}`;

    const handler = props[eventName(name)];
    handler && handler(...args);
}