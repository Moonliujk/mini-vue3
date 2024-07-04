import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode: any) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: [],
        emit: () => {}
    }
    component.emit = emit.bind(null, component) as any;
    return component;
}

export function setupComponent(instance) {
    // 初始化数据
    initProps(instance, shallowReadonly(instance.vnode.props));
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
    const Component = instance.type;
    const {setup} = Component;
    instance.proxy = new Proxy(instance, PublicInstanceProxyHandlers)

    if (setup) {
        setCurInstance(instance);
        // 如果结果为函数，则将其视为 render 函数
        // 如果结果为对象，则将其注入到组件实例
        const setupRes = setup(instance.props, {
            emit: instance.emit
        });
        setCurInstance(null);

        handleSetupRes(instance, setupRes);
    }
}
function handleSetupRes(instance, setupRes: any) {
    // TODO 待实现 function情况
    if(typeof setupRes === 'object') {
        instance.setupState = setupRes;
    }

    finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
    const Component = instance.type;

    if (Component.render) {
        instance.render = Component.render;
    }
}

let curInstance = null;

export function getCurrentInstance() {
    return curInstance;
}

function setCurInstance(instance) {
    curInstance = instance;
}

