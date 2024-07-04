import { effect, stop } from "../effect";
import { reactive } from "../reactive";

describe('effect', () => {
    it('happy pass', () => {
        const user = reactive({
            age: 10
        });
        let dummy;
        effect(() => {
            dummy = user.age;
        })
        expect(dummy).toBe(10);
        user.age++;
        expect(dummy).toBe(11);
    });

    it('should return a runner when call effect', () => {
        let foo = 10;
        let runner = effect(() => {
            foo++;
            return 'foo';
        });
        expect(foo).toBe(11);
        let r = runner();
        expect(foo).toBe(12);
        expect(r).toBe('foo');
    });

    it('scheduler', () => {
        let dummy;
        let run;
        let scheduler = jest.fn(() => {
            run = runner;
        });
        const obj = reactive({foo: 1});
        const runner = effect(() => {
            dummy = obj.foo;
        }, {
            scheduler
        });
        expect(dummy).toBe(1);
        obj.foo++;
        expect(scheduler).toHaveBeenCalledTimes(1);
        expect(dummy).toBe(1);
        run();
        expect(dummy).toBe(2);
    });

    it('stop', () => {
        let dummy;
        let obj = reactive({foo: 1});
        const runner = effect(() => {
            dummy = obj.foo;
        });
        obj.foo = 2;
        expect(dummy).toBe(2);
        stop(runner);
        obj.foo++;
        expect(dummy).toBe(2);

        runner();
        expect(dummy).toBe(3);
    });

    it('onStop', () => {
        let onStop = jest.fn();
        let dummy;
        let obj = reactive({foo: 1});
        const runner = effect(() => {
            dummy = obj.foo;
        }, {
            onStop
        });
        stop(runner);
        expect(onStop).toHaveBeenCalledTimes(1);
    });
});