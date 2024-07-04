import { createComponentInstance, setupComponent } from "./component";
import { ShapeFlags } from "@my-vue3/share";
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
    // 基于 patch 作出操作
    patch(vnode, container, null);
}

function patch(vnode: any, container: any, parentComponent?: any) {
    const { type, shapeFlag } = vnode;
    switch(type) {
        case Fragment:
            // 处理片段
            processFragment(vnode, container, parentComponent);
            break;
        case Text:
            // 处理文本
            processText(vnode, container);
            break;
        default:
            // 根据虚拟节点类型（元素节点 or 组件节点），执行不同的逻辑
            if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                processComponent(vnode, container, parentComponent);
            } else if (shapeFlag & ShapeFlags.ELEMENT) {
                processElement(vnode, container, parentComponent);
            }
    }
}

function processText(vnode: any, container: any) {
    const {children} = vnode;
    const textNode = document.createTextNode(children);
    vnode.el = container.append(textNode);
}

function processFragment(vnode: any, container: any, parentComponent) {
    mountChildren(vnode, container, parentComponent);
}

function processComponent(vnode: any, container: any, parentComponent: any) {
    mountComponent(vnode, container, parentComponent);
}

function processElement(vnode: any, container: any, parentComponent) {
    mountElement(vnode, container, parentComponent);
}

function mountComponent(initialVnode: any, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, container, initialVnode);
}

function setupRenderEffect(instance, container, initialVnode) {
    const {proxy, render} = instance;
    const subTree = render.call(proxy);

    patch(subTree, container, instance);
    initialVnode.el = subTree.el;
}

function mountElement(vnode: any, container: HTMLElement, parentComponent) {
    const {type, props = null, children, shapeFlag} = vnode;
    const el = vnode.el = document.createElement(type);

    // 处理元素绑定的属性
    if (props) {
        Object.entries(props).forEach(([prop, value]) => {
            // onClick => click
            const isOn = (string: string) => /^on[A-Z]/.test(string);
            if (isOn(prop)) {
                const eventName = prop.slice(2).toLowerCase();
                el.addEventListener(eventName, value);
            } else {
                value = typeof value === 'string' ? value : (value as Array<string>).join(' ');
                (el as HTMLElement).setAttribute(prop, value as string);
            }
        })
    }

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        (el as HTMLElement).textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el, parentComponent);
    } 

    container.append(el);
}

function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach(child => patch(child, container, parentComponent));
}

