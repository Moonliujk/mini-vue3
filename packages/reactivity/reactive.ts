import { mutableHandler, readonlyHandler, shallowReadonlyHandler } from "./baseHandler";

function createProxy(origin, baseHandler) {
    return new Proxy(origin, baseHandler);
}

export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
}

export function reactive(origin) {
    return createProxy(origin, mutableHandler);
}

export function readonly(origin) {
    return createProxy(origin, readonlyHandler);
}

export function shallowReadonly(origin) {
    return createProxy(origin, shallowReadonlyHandler);
}

export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY];
} 

export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE];
} 

export function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}