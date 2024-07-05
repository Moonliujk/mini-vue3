import { createComponentInstance, setupComponent } from "./component";
import { ShapeFlags } from "@my-vue3/share";
import { Fragment, Text } from "./vnode";
import { createAppAPI } from "./createApp";
import { effect } from "@my-vue3/reactivity";


export function createRender(options) {
    const {
        createElement: hotCreateElement,
        patchProp: hotPatchProp,
        insert: hotInsert,
        createTextNode: hotCreateTextNode
    } = options;

  function render(vnode, container) {
    // 基于 patch 作出操作
    patch(null, vnode, container, null);
  }

  function patch(n1, n2: any, container: any, parentComponent: any) {
    // n1 旧
    // n2 新
    const { type, shapeFlag } = n2;
    switch (type) {
      case Fragment:
        // 处理片段
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        // 处理文本
        processText(n1, n2, container);
        break;
      default:
        // 根据虚拟节点类型（元素节点 or 组件节点），执行不同的逻辑
        if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        }
    }
  }

  function processText(n1, n2: any, container: any) {
    const { children } = n2;
    const textNode = hotCreateTextNode(children);
    n2.el = hotInsert(textNode, container);
  }

  function processFragment(n1, n2: any, container: any, parentComponent) {
    mountChildren(n2, container, parentComponent);
  }

  function processComponent(n1, n2: any, container: any, parentComponent: any) {
    mountComponent(n2, container, parentComponent);
  }

  function processElement(n1, n2: any, container: any, parentComponent) {
    if (!n1) {
        mountElement(n2, container, parentComponent);
    } else {
        patchElement(n1, n2, container);
    }
  }

  function patchElement(n1, n2, container) {
    console.log('patchElement');
    console.log('n1: ', n1);
    console.log('n2: ', n2);
  }

  function mountComponent(initialVnode: any, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, container, initialVnode);
  }

  function setupRenderEffect(instance, container, initialVnode) {
    effect(() => {
        if (!instance.isMounted) {
            // init
            const { proxy, render } = instance;
            const subTree = instance.subTree = render.call(proxy);

            patch(null, subTree, container, instance);
            initialVnode.el = subTree.el;

            instance.isMounted = true;
        } else {
            // update
            const { proxy, render } = instance;
            const subTree = render.call(proxy);
            const prevSubtree = instance.subTree;
            instance.subTree = subTree;

            patch(prevSubtree, subTree, container, instance);
            initialVnode.el = subTree.el;
        }
    });
  }

  function mountElement(vnode: any, container: HTMLElement, parentComponent) {
    const { type, props = null, children, shapeFlag } = vnode;
    const el = (vnode.el = hotCreateElement(type));

    // 处理元素绑定的属性
    if (props) {
        Object.entries(props).forEach(([key, value]) => {
            // onClick => click
            hotPatchProp(el, key, value);
        });
    }

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      (el as HTMLElement).textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent);
    }

    hotInsert(el, container);
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((child) => patch(null, child, container, parentComponent));
  }

  return {
    createApp: createAppAPI(render)
  }
}
