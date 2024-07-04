import { h, createTextVNode } from "../../dist/my-vue3.esm.js";
import { Foo } from "./Foo.js";

window.self = null;
export const App = {
    name: 'App',
    render() {
        const app = h('div', {}, 'App');
        const foo = h(Foo, {}, {
            header: ({age}) => [
                h('div', {}, 'Header: Great ' + age),
                createTextVNode('你好！')
            ],
            footer: () => h('div', {}, 'Footer: Leslie')
        });
        return h('div', {}, [app, foo])
    },
    setup() {
        return {}
    }
}