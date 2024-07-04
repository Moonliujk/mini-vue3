import { h } from "../dist/my-vue3.esm.js";
import {Foo} from "./Foo.js";

window.self = null;
export const App = {
    name: 'App',
    render() {
        return h('div', {
            id: 'root',
            onClick() {
                console.log('click me');
            },
            class: ['red', 'big']
        }, [
            h('div', {}, `hello ${this.msg}`),
            h(Foo, {
                count: 1
            })
        ])
    },
    setup() {
        return {
            msg: 'Leslie~'
        }
    }
}