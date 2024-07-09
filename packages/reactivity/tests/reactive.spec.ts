import { reactive, isReactive, isReadonly, readonly, isProxy } from "../src/reactive";

describe('reactive', () => {
    it('happy pass', () => {
        const original = {foo: 1};
        const proxy = reactive(original);
        expect(proxy).not.toBe(original);
        expect(proxy.foo).toBe(1);
        original.foo++;
        expect(proxy.foo).toBe(2);
        expect(isProxy(proxy)).toBe(true);
    });

    it('nested reactive', () => {
        const original = {
            nested: {
                foo: 1
            },
            arr: [{
                bar: 1
            }]
        };
        const wrapped = reactive(original);
        expect(isReactive(wrapped.nested)).toBe(true);
        expect(isReactive(wrapped.arr)).toBe(true);
        expect(isReactive(wrapped.arr[0])).toBe(true);
    });

    it('isReadonly && isReactive', () => {
        const origin = {foo: 1, bar: {baz: 2}};
        const proxy = readonly(origin);
        expect(proxy).not.toBe(origin);
        expect(isReadonly(proxy)).toBe(true);
        expect(isReadonly(origin)).toBe(false);
        expect(isReadonly(proxy.bar)).toBe(true);
        expect(isReadonly(origin.bar)).toBe(false);
        expect(isProxy(proxy)).toBe(true);
    });
});