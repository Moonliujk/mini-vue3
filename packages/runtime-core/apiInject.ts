import { isFunction } from "@my-vue3/share";
import { getCurrentInstance } from "./component";

export function provide(key, val) {
    const instance: any = getCurrentInstance();
    if (instance) {
        let {provides = {}} = instance;
        const parentProvides = instance.parent.provides;
        if (provides === parentProvides) {
            // 说明是初始化
            provides = instance.provides = Object.create(parentProvides);
        }
        provides[key] = val;
    }
}

export function inject(key, defaultVal) {
    const instance: any = getCurrentInstance()!;
    if (!instance) return;

    let provides = instance.parent.provides;
    if (provides[key]) {
        return provides[key];
    } else if (defaultVal) {
        return isFunction(defaultVal) ? defaultVal() : defaultVal;
    }
}