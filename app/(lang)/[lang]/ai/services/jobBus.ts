// app/(lang)/[lang]/ai/server/jobBus.ts
import { EventEmitter } from 'node:events';

export type JobEvent =
    | { type: 'status'; status: 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED' }
    | { type: 'image'; index: number; base64?: string; url?: string }
    | { type: 'error'; message: string }
    | { type: 'done' };

class MemoryBus {
    private channels = new Map<string, EventEmitter>();
    get(jobId: string) {
        let e = this.channels.get(jobId);
        if (!e) {
            e = new EventEmitter({ captureRejections: true });
            e.setMaxListeners(1000);
            this.channels.set(jobId, e);
        }
        return e;
    }
    publish(jobId: string, ev: JobEvent) {
        // console.log(`Publishing job ${jobId}-${ev.type}-${ev.status}-${ev.base64}`);
        this.get(jobId).emit('ev', ev);
    }
    subscribe(jobId: string, fn: (ev: JobEvent) => void) {
        const e = this.get(jobId);
        e.on('ev', fn);
        return () => e.off('ev', fn);
    }
    clear(jobId: string) {
        const e = this.channels.get(jobId);
        if (e) {
            e.removeAllListeners();
            this.channels.delete(jobId);
        }
    }
}

export const JobBus = new MemoryBus();
// If you later want Redis, implement the same publish/subscribe/clear API.
