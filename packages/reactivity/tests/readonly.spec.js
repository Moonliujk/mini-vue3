import { readonly } from "../src/reactive.ts";
import {vi} from "vitest";
describe('readonly', () => {
    it('happy pass', () => {
        
        const origin = {foo: 1, bar: {baz: 2}};
        const wrapped = readonly(origin);
        expect(wrapped).not.toBe(origin);
        expect(wrapped.foo).toBe(1);
    });

    it('setter forbidden', () => {
        console.warn = vi.fn();
        const wrapped = readonly({foo: 1});
        wrapped.foo = 2;
        expect(console.warn).toBeCalled();
    })
});