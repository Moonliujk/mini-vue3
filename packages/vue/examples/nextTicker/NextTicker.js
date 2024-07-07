// 测试 nextTick 逻辑
import { h, ref, nextTick } from "../../dist/my-vue3.esm.js";

// 如果 for 循环改变 count 的值 100 次的话
// 会同时触发 100 次的 update 页面逻辑
// 这里可以把 update 页面的逻辑放到微任务中执行
// 避免更改了响应式对象就会执行 update 的逻辑
// 因为只有最后一次调用 update 才是有价值的
window.count = ref(1);

// 如果一个响应式变量同时触发了两个组件的 update
// 会发生什么有趣的事呢？
const Child1 = {
  name: "NextTickerChild1",
  setup() {},
  render() {
    return h("div", {id: 'child'}, `child1 count:${window.count.value}`);
  },
};

const Child2 = {
  name: "NextTickerChild2",
  setup() {},
  render() {
    return h("div", {}, `child2 count:${window.count.value}`);
  },
};

export default {
  name: "NextTicker",
  setup() {
    const onClick = async () => {
      for (let i = 10; i>0; i--) {
        window.count.value++;
      }
      console.log('#child 1: ', document.querySelector('#child').textContent);
      await nextTick();
      console.log('#child 1: ', document.querySelector('#child').textContent);
    }
    return {
      onClick
    }
  },
  render() {
    return h(
      "div",
      { tId: "nextTicker" },
      [
        h('button', {
          onClick: this.onClick
        }, 'click me'),
        h(Child1),
        h(Child2),
      ]
      //   `for nextTick: count: ${window.count.value}`
    );
  },
};
