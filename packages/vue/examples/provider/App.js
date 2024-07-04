import { h, provide, inject, getCurrentInstance } from "../../dist/my-vue3.esm.js";

const Provider = {
    name: 'Provider',
    setup() {
        console.log('Provider: ', getCurrentInstance());
        provide('foo', 'foo Provider');
        provide('bar', 'barVal');
    },
    render() {
        return h('div', {}, [h('p', {}, 'Provider'), h(Middle)])
    }
};

const Middle = {
    name: 'Middle',
    setup() {
        console.log('Middle before', getCurrentInstance());
        provide('foo', 'foo Middle');
        const foo = inject('foo');
        console.log('Middle after', getCurrentInstance());

        return {
            foo
        }
    },
    render() {
        return h('div', {}, [h('p', {}, `Middle foo: ${this.foo}`), h(Consumer)])
    }
};

const Consumer = {
    name: 'Consumer',
    setup() {
        console.log('Consumer', getCurrentInstance());
        const foo = inject('foo');
        const bar = inject('bar');
        const baz = inject('baz', 'defaultValue');
        console.log(foo, bar, baz);
        return {
            foo,
            bar,
            baz,
        };
    },
    render() {
        return h('div', {}, `Consumer: - ${this.foo} - ${this.bar} - ${this.baz}`)
    }
};

export const App = {
    name: 'App',
    render() {
        return h('div', {}, [h('p', {}, 'apiInject'), h(Provider)])
    },
    setup() {}
}