import { isObject } from "@my-vue3/share";
import { track, trigger } from "./effect";
import { ReactiveFlags, reactive, readonly } from './reactive';

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isReadonly: boolean = false, isShallow: boolean = false) {
    return function get(target, key) {
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        }

        const res = Reflect.get(target, key);

        if (isShallow) return res;

        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }

        isReadonly ? '' : track(target, key);
        return res;
    }
}

function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value);

        trigger(target, key);
        return res;
    }
}

export const mutableHandler = {
    get,
    set,
};

export const readonlyHandler = {
    get: readonlyGet,
    set () {
        console.warn('Do not set value to a readonly object');
        return true;
    }
}

export const shallowReadonlyHandler = {
    get: shallowReadonlyGet,
    set () {
        console.warn('Do not set value to a readonly object');
        return true;
    }
}