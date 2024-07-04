import { h } from "../../dist/my-vue3.esm.js";

export const Foo = {
    render() {
        const btn = h('button', {
            onClick: this.emitAdd
        }, 'emitAdd');
        const foo = h('div', {}, 'foo');
        return h('div', {}, [btn, foo])
    },
    setup(props, {emit}) {
        const emitAdd = () => {
            console.log('emit 11');
            emit('add', 1, 2);
        };
        return {
            emitAdd
        }
    }
}