import {reactive} from '../src/reactive.ts';
import { computed } from "../src/computed.ts";
import {vi} from 'vitest';

describe('computed', () => {
    it('happy pass', () => {
        const user = reactive({
            age: 1
        });
        const age = computed(() => {
            return user.age;
        });
        expect(age.value).toBe(1);
    });

    it('should compute laze', () => {
        const value = reactive({
            foo: 1
        });
        const getter = vi.fn(() => {
            return value.foo;
        });
        const cValue = computed(getter);

        // lazy
        expect(getter).not.toHaveBeenCalled();
        expect(cValue.value).toBe(1);
        expect(getter).toHaveBeenCalledTimes(1);

        // should not computed again
        cValue.value;
        expect(getter).toHaveBeenCalledTimes(1);

        // should not computed until needed
        value.foo = 2;
        expect(getter).toHaveBeenCalledTimes(1);

        // now it show computed
        expect(cValue.value).toBe(2);
        expect(getter).toHaveBeenCalledTimes(2);

        // should not computed again
        cValue.value;
        expect(getter).toHaveBeenCalledTimes(2);
    });
});