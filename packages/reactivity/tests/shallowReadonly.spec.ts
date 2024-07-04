import { isReactive, isReadonly, shallowReadonly } from "../reactive";

describe('shallowReadonly', () => {
    it('happy pass', () => {
        const original = {foo: 1, bar: {baz: 1}};
        const proxy = shallowReadonly(original);
        expect(isReadonly(proxy)).toBe(true);
        expect(isReactive(proxy)).toBe(false);
        expect(isReadonly(proxy.bar)).toBe(false);
    });
});