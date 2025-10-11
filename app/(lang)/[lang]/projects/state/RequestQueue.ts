// app/(lang)/[lang]/projects/state/RequestQueue.ts

/**
 * Simple per-project mutation queue.
 * Ensures generator mutations execute sequentially (FIFO),
 * preventing server-side commit races with stale headId.
 */

type Task<T> = () => Promise<T>;

const queues = new Map<string, Promise<any>>();

/**
 * Enqueue a task for a given projectId. Runs after the prior task finishes.
 * Returns the task's own promise result.
 */
export function enqueue<T>(projectId: string, task: Task<T>): Promise<T> {
    const prev = queues.get(projectId) ?? Promise.resolve();
    const run = prev
        .catch(() => {
            // swallow previous errors so chain continues
        })
        .then(task);

    // Store a "settled" promise to keep the chain alive regardless of success/failure
    queues.set(projectId, run.then(() => undefined, () => undefined));
    return run;
}
