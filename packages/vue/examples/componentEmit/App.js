import { h } from "../../dist/my-vue3.esm.js";
import {Foo} from "./Foo.js";

window.self = null;
export const App = {
    name: 'App',
    render() {
        return h('div', {
            id: 'root',
            class: ['red', 'big']
        }, [
            h('div', {}, `hello ${this.msg}`),
            h(Foo, {
                onAdd(a, b) {
                    console.log('on add', a, b);
                }
            })
        ])
    },
    setup() {
        return {
            msg: 'Leslie~'
        }
    }
}