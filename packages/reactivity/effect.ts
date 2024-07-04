import { extend } from '@my-vue3/share'

const targetMap = new Map();
let activeEffect;
let shouldTrack;


export class ReactiveEffect {
    deps = [];
    private _fn;
    isStop = false;
    active = true;
    onStop?: () => void;
    constructor(fn, public scheduler?) {
        this._fn = fn;
    }

    run() {
        if (!this.active) {
            return this._fn();
        }
        
        shouldTrack = true;
        activeEffect = this;
        const res = this._fn();
        shouldTrack = false;

        return res;  
    }

    stop() {
        if (this.active) {
            cleanupEffect(this);
            this.onStop && this.onStop();
            this.active = false;
        }
    }
}

function cleanupEffect(effect) {
    effect.deps.forEach((dep: Set<ReactiveEffect>) => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}

export function effect(fn, options: any = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    extend(_effect, options);

    _effect.run();
    let runner: any = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}

export function stop(runner) {
    const effect = runner.effect;
    effect.stop();
}

export function isTracking () {
    return shouldTrack && activeEffect !== undefined;
}

export function track(target, key) {
    if (!isTracking()) return;

    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }

    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }

    trackEffects(dep);
}

export function trackEffects(dep) {
    if (dep.has(activeEffect)) return;

    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}

export function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);

    triggerEffects(dep);
}

export function triggerEffects(dep) {
    for (let effect of dep) {
        effect.scheduler ? effect.scheduler() : effect.run();
    }
}