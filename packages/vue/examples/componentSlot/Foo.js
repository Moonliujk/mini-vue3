import { h, renderSlots } from "../../dist/my-vue3.esm.js";

export const Foo = {
    name: 'Foo',
    render() {
        const foo = h('div', {}, 'foo')
        // 具名插槽：1. 获取对应元素；2. 获取对应位置
        // 作用域
        const age = 18;
        return h('div', {}, [
            renderSlots(this.$slots, 'header', {age}), 
            foo, 
            renderSlots(this.$slots, 'footer')
        ]);
    },
    setup() {
        return {}
    }
}