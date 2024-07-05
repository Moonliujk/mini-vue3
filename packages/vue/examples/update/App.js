import { h, ref } from "../../dist/my-vue3.esm.js";

window.self = null;
export const App = {
    name: 'App',
    render() {
        return h('div', {
            id: 'root',
            ...this.props,
        }, [
            h('div', {}, `count: ${this.count}`),
            h('button', {
                    onClick: this.onClick
                },
            'click me'),
            h('button', {
                onClick: this.onChangePropsDemo1
            },
            'change props 值改变 - 修改'),
            h('button', {
                onClick: this.onChangePropsDemo2
            },
            'change props 值变为undefined - 删除'),
            h('button', {
                onClick: this.onChangePropsDemo3
            },
            'change props key在新值没有了 - 删除'),
        ])
    },
    setup() {
        const count = ref(0);
        const props = ref({
            foo: 'foo',
            bar: 'bar',
        });
    
        const onClick = () => {
            count.value++;
            console.log('click button', count.value);
        };
        const onChangePropsDemo1 = () => {
            props.value.foo = 'new-foo';
        };
        const onChangePropsDemo2 = () => {
            props.value.foo = undefined;
        };
        const onChangePropsDemo3 = () => {
            props.value = {
                foo: 'foo'
            };
        };
        return {
            count,
            onClick,
            props,
            onChangePropsDemo1,
            onChangePropsDemo2,
            onChangePropsDemo3,
        }
    }
}