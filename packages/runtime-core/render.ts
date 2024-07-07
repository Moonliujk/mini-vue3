import { createComponentInstance, setupComponent } from "./component";
import { ShapeFlags } from "@my-vue3/share";
import { Fragment, Text } from "./vnode";
import { createAppAPI } from "./createApp";
import { effect } from "@my-vue3/reactivity";
import { shouldUpdateComponent } from "./componentsUpdateUtils";
import { queueJob } from "./nextTick";


export function createRender(options) {
    const {
        createElement: hostCreateElement,
        patchProp: hostPatchProp,
        insert: hostInsert,
        createTextNode: hostCreateTextNode,
        remove: hostRemove,
        setElementText: hostSetElementText,
    } = options;

  function render(vnode, container) {
    // 基于 patch 作出操作
    patch(null, vnode, container, null, null);
  }

  function patch(n1, n2: any, container: any, anchor: any, parentComponent: any) {
    // n1 旧
    // n2 新
    const { type, shapeFlag } = n2;
    switch (type) {
      case Fragment:
        // 处理片段
        processFragment(n1, n2, container, anchor, parentComponent);
        break;
      case Text:
        // 处理文本
        processText(n1, n2, container);
        break;
      default:
        // 根据虚拟节点类型（元素节点 or 组件节点），执行不同的逻辑
        if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, anchor, parentComponent);
        } else if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, anchor, parentComponent);
        }
    }
  }

  function processText(n1, n2: any, container: any) {
    const { children } = n2;
    const textNode = hostCreateTextNode(children);
    n2.el = hostInsert(textNode, container);
  }

  function processFragment(n1, n2: any, container: any, anchor: any, parentComponent) {
    mountChildren(n2.children, container, anchor, parentComponent);
  }

  function processComponent(n1, n2: any, container: any, anchor: any, parentComponent: any) {
    if (!n1) {
      mountComponent(n2, container, anchor, parentComponent);
    } else {
      updateComponent(n1, n2);
    }
  }

  function updateComponent(n1, n2) {
    const instance = n2.component = n1.component;
    
    if (shouldUpdateComponent(n1, n2)) {
      instance.next = n2;
      instance.update();
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  }

  function processElement(n1, n2: any, container: any, anchor: any, parentComponent) {
    if (!n1) {
        mountElement(n2, container, anchor, parentComponent);
    } else {
        patchElement(n1, n2, container, anchor, parentComponent);
    }
  }

  function patchElement(n1, n2, container, anchor: any, parentComponent) {
    console.log("应该更新 element");
    console.log("旧的 vnode", n1);
    console.log("新的 vnode", n2);

    const newProps = n2.props || {};
    const oldProps = n1.props || {};
    const el = n2.el = n1.el;
    patchChildren(n1, n2, el, anchor, parentComponent);
    patchProps(el, oldProps, newProps);
  }

  function patchChildren(n1, n2, container, anchor: any, parentComponent) {
    const prevShapeFlag = n1.shapeFlag;
    const nextShapeFlag = n2.shapeFlag;
    const c1 = n1.children;
    const c2 = n2.children;

    if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            // 清空老的children
            unmountChildren(n1.children);
        }
        if (c1 !== c2) {
            hostSetElementText(container, c2);
        }
    } else {
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
            // 清空老的文本
            hostSetElementText(container, '');
            mountChildren(c2, container, anchor, parentComponent);
        } else {
            // 数组间的匹配
            patchKeyedChildren(c1, c2, container, anchor, parentComponent);
        }
    }
  }

  function patchKeyedChildren(c1, c2, container, parentAnchor, parentComponent) {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;

    const isSameVNodeType = (n1, n2) => {
        return n1.type === n2.type && n1.key === n2.key;
    };

    while(i <= e1 && i <= e2) {
        // 头部节点
        const prevStartChild = c1[i];
        const nextStartChild = c2[i];
        // 尾部节点
        const prevEndChild = c1[e1];
        const nextEndChild = c2[e2];

        console.log('patch');

        if (isSameVNodeType(prevStartChild, nextStartChild)) {
            patch(prevStartChild, nextStartChild, container, parentAnchor, parentComponent);
            i++;
        } else if (isSameVNodeType(prevEndChild, nextEndChild)) {
            patch(prevEndChild, nextEndChild, container, parentAnchor, parentComponent);
            e1--;
            e2--;
        } else {
            break;
        }
    }

    if (i > e1 && i <= e2) {
        console.log('add new doms');
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while(i <= e2) {
            patch(null, c2[i++], container, anchor, parentComponent);
        }
    } else if (i > e2 && i <= e1) {
        console.log('delete extra doms');
        while(i <= e1) {
            hostRemove(c1[i++].el);
        }
    } else {
        console.log('deal with doms in the middle of the list');
        let s1 = i;
        let s2 = i;
        const toBePatched = e2 - s2 + 1;
        let patchedNum = 0;

        // 建立 新子节点的key与自身index的映射，用于在旧子节点中根据key找到对应在新子节点中的索引
        const nextKeyToIdxMap = new Map();
        for (let j=s2; j <= e2; j++) {
            let key = c2[j].key;
            nextKeyToIdxMap.set(key, j);
        }

        // 用于建立 新子节点数组索引 与 旧子节点索引 之间的映射关系；用于构建 最长递增子序列
        const nextKeyToPrevKeyMap = new Array(toBePatched);
        for (let i=0; i<nextKeyToPrevKeyMap.length; i++) nextKeyToPrevKeyMap[i] = 0;
        let maxIndexSoFar = 0;
        let moved = false;
    
        for (let i=s1; i<=e1; i++) {
            let newIndex;
            let prevChild = c1[i];

            if (toBePatched <= patchedNum) {
                // 旧子节点数大于新子节点数，多余部分直接删除
                hostRemove(prevChild.el);
                continue;
            }

            // 用旧子节点key查找对应新子节点相同key值对应的索引
            if (prevChild.key != null) {
                newIndex = nextKeyToIdxMap.get(prevChild.key);
            } else {
                for (let j=s2; j <= e2; j++) {
                    if (isSameVNodeType(prevChild, c2[j])) {
                        newIndex = j;
                        break;
                    }
                }
            }

            if (newIndex === undefined) {
                hostRemove(prevChild.el);
            } else {
                nextKeyToPrevKeyMap[newIndex - s2] = i + 1;
                // 确定新子节点序列是否为递增序列，若不是，则需要移动子节点位置
                if (newIndex >= maxIndexSoFar) {
                    maxIndexSoFar = newIndex;
                } else {
                    moved = true;
                }
                patch(prevChild, c2[newIndex], container, null, parentComponent);
                patchedNum++;
            }
        }

        const increasingMaxSequence = moved ? getSequence(nextKeyToPrevKeyMap) : [];
        let j = increasingMaxSequence.length - 1;

        for (let i=toBePatched - 1; i>=0; i--) {
            const nextIndex = s2 + i;
            const nextChild = c2[nextIndex];
            const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null;

            // nextKeyToPrevKeyMap[i] 为0，说明该节点为新增节点
            if (nextKeyToPrevKeyMap[i] === 0) {
                patch(null, nextChild, container, anchor, parentComponent);
            } else if (moved) {
                // 以下两种情况需要移动节点：
                // 1. 递增子序列的元素 全部处理完毕，剩余不在该序列中的节点（or元素）需要全部进行移动
                // 2. 当前新子节点元素节点的索引 与 当前递增子序列节点元素的索引并不一致，则需要移动
                if (j < 0 || increasingMaxSequence[j] !== i) {
                    hostInsert(nextChild.el, container, anchor);
                } else {
                    j--;
                }
            }
        }
    }
  }

  function unmountChildren(children) {
    for (let i=0, len=children.length; i< len; i++) {
        hostRemove(children[i].el);
    }
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps === newProps) return;

    for (let key in newProps) {
        const oldProp = oldProps[key];
        const newProp = newProps[key];

        if (oldProp !== newProp) {
            hostPatchProp(el, key, oldProp, newProp);
        }
    }

    if (JSON.stringify(oldProps) === '{}') return;

    for (const key in oldProps) {
        if (!(key in newProps)) hostPatchProp(el, key, oldProps[key], null);
    }
  }

  function mountComponent(initialVnode: any, container, anchor, parentComponent) {
    const instance = initialVnode.component = createComponentInstance(initialVnode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, container, anchor, initialVnode);
  }

  function setupRenderEffect(instance, container, anchor, initialVnode) {
    instance.update = effect(() => {
        if (!instance.isMounted) {
            // init
            console.log('init');
            const { proxy, render } = instance;
            const subTree = instance.subTree = render.call(proxy);

            patch(null, subTree, container, anchor, instance);
            initialVnode.el = subTree.el;

            instance.isMounted = true;
        } else {
            // update
            console.log('update');
            const {next} = instance;
            if (next) {
              instance.vnode = next;
              instance.next = null;
              instance.props = next.props;
            }
            const { proxy, render } = instance;
            const subTree = render.call(proxy);
            const prevSubtree = instance.subTree;
            instance.subTree = subTree;

            patch(prevSubtree, subTree, container, anchor, instance);
            initialVnode.el = subTree.el;
        }
    }, {
      scheduler() {
        queueJob(instance.update);
      }
    });
  }

  function mountElement(vnode: any, container: HTMLElement, anchor, parentComponent) {
    const { type, props = null, children, shapeFlag } = vnode;
    const el = (vnode.el = hostCreateElement(type));

    // 处理元素绑定的属性
    if (props) {
        Object.entries(props).forEach(([key, value]) => {
            // onClick => click
            hostPatchProp(el, key, null, value);
        });
    }

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      (el as HTMLElement).textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children, el, anchor, parentComponent);
    }

    hostInsert(el, container, anchor);
  }

  function mountChildren(children, container, anchor, parentComponent) {
    children.forEach((child) => patch(null, child, container, anchor, parentComponent));
  }

  return {
    createApp: createAppAPI(render)
  }
}

// COOL: 最长递增子序列算法
function getSequence(arr: number[]): number[] {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = (u + v) >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p[v];
    }
    return result;
}
