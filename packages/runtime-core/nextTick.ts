
const queue: any[] = [];
let isFlushing = false;
const p = Promise.resolve();

export function nextTick(fn) {
    return fn ? p.then(fn) : p;
}

export function queueJob(job) {
    if (!queue.includes(job)) {
        queue.push(job);
    }

    flushJobs();
}

function flushJobs() {
    if (isFlushing) return;
    isFlushing = true;

    return Promise.resolve().then(() => {
        let job;
        while(job = queue.pop()) job();
    });
}