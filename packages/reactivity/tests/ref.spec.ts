import { effect } from "../src/effect";
import { ref, isRef, unRef, proxyRefs } from "../src/ref";

describe('ref', () => {
    it('happy pass', () => {
        const a = ref(1);
        expect(a.value).toBe(1);
    });

    it('should be reactive', () => {
        const a = ref(1);
        let dummy;
        let call = 0;
        effect(() => {
            call++;
            dummy = a.value;
        });
        expect(call).toBe(1);
        expect(dummy).toBe(1);
        a.value = 2;
        expect(call).toBe(2);
        expect(dummy).toBe(2);
        // same value should not be triggered
        a.value = 2;
        expect(call).toBe(2);
        expect(dummy).toBe(2);
    });

    it('nested value should be reactive', () => {
        const a = ref({
            count: 1
        });
        let dummy;
        effect(() => {
            dummy = a.value.count;
        });
        expect(dummy).toBe(1);
        a.value.count = 2;
        expect(dummy).toBe(2);
    });

    it('is ref', () => {
        const a = ref(1);
        const b = 1;
        expect(isRef(a)).toBe(true);
        expect(isRef(b)).toBe(false);
    });

    it('unRef', () => {
        const a = ref(1);
        expect(unRef(a)).toBe(1);
        expect(unRef(1)).toBe(1);
    });

    it('proxyRefs', () => {
        const user = {
            age: ref(10),
            name: 'Leslie'
        };
        const proxyUser = proxyRefs(user);
        expect(proxyUser.age).toBe(10);
        expect(user.age.value).toBe(10);
        expect(proxyUser.name).toBe('Leslie');

        proxyUser.age = 20;
        expect(proxyUser.age).toBe(20);
        expect(user.age.value).toBe(20);

        proxyUser.age = ref(10);
        expect(proxyUser.age).toBe(10);
        expect(user.age.value).toBe(10);
    });
});