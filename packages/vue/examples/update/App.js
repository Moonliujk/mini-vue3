import { h, ref } from "../../dist/my-vue3.esm.js";

window.self = null;
export const App = {
    name: 'App',
    render() {
        return h('div', {
            id: 'root',
        }, [
            h('div', {}, `count: ${this.count}`),
            h('button', {
                onClick: this.onClick
            }, 'click me')
        ])
    },
    setup() {
        const count = ref(0);
        const onClick = () => {
            count.value++;
            console.log('click button', count.value);
        }
        return {
            count,
            onClick,
        }
    }
}