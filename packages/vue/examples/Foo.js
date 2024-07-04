import { h } from "../dist/my-vue3.esm.js";

export const Foo = {
    render() {
        console.log(this.msg, this.$el);
        return h('div', {}, `foo: ${this.count}`)
    },
    setup(props) {
        // props.count
        console.log('props', props.count++);
        return {
            msg: 'Leslie~'
        }
    }
}