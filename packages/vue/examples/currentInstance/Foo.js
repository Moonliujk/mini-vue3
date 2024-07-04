import { h, getCurrentInstance } from "../../dist/my-vue3.esm.js";

export const Foo = {
    name: 'Foo',
    render() {
        return h('div', {}, 'foo');
    },
    setup() {
        const instance = getCurrentInstance();
        console.log("foo: ", instance);
        return {}
    }
}