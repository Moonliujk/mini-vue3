import { triggerEffects, trackEffects, isTracking } from "./effect";
import { isObject } from "@my-vue3/share";
import { reactive } from "./reactive";

// ref 常用与 基础类型值转换为响应式；引用类型值 也会用 reactive 包裹转换为响应式
class RefIml {
    private _value: any
    private _rawValue: any
    dep: any
    __v_isRef = true
    constructor(value) {
        this._rawValue = value;
        this._value = convert(value);
        this.dep = new Set();
    }
    get value() {
        if (isTracking()) {
            trackEffects(this.dep);
        }
        return this._value;
    }
    set value(newValue) {
        if (Object.is(newValue, this._rawValue)) return;

        this._rawValue = newValue;
        this._value = convert(newValue);
        triggerEffects(this.dep);
    }
}

function convert(value) {
    return isObject(value) ? reactive(value) : value;
}

export function ref(value) {
    return new RefIml(value);
}

export function isRef(obj) {
    return !!obj.__v_isRef;
}

export function unRef(obj) {
    return isRef(obj) ? obj.value : obj;
}

export function proxyRefs(obj) {
    return new Proxy(obj, {
        get(target, key) {
            const res = Reflect.get(target, key);
            return unRef(res);
        },
        set(target, key, value) {
            if (isRef(target[key]) && !isRef(value)) {
                return target[key].value = value;
            } else {
                return Reflect.set(target, key, value);
            }
        }
    });
}