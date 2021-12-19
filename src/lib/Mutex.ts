import { createDeferred, Deferred } from "./Deferred";

export type AcquiredMutex<T> = T & { release: () => void };

const releaseMutex = Symbol("releaseMutex");

export class Mutex<T extends object> {
  private waitlist: Deferred<AcquiredMutex<T>>[];
  private isAcquired = false;

  constructor(private inner: T) {
    this.waitlist = [];
  }

  public async acquire(): Promise<AcquiredMutex<T>> {
    if (this.isAcquired) {
      const deferred = createDeferred<AcquiredMutex<T>>();
      this.waitlist.push(deferred);
      return deferred.promise;
    }
    this.isAcquired = true;
    return new Proxy(this.inner, new MutexGuard(this)) as AcquiredMutex<T>;
  }

  public [releaseMutex]() {
    if (this.waitlist.length > 0) {
      const next = this.waitlist.shift();
      const guard = new Proxy(
        this.inner,
        new MutexGuard(this)
      ) as AcquiredMutex<T>;
      next.resolve(guard);
    } else {
      this.isAcquired = false;
    }
  }
}

export class MutexGuard<T extends object> {
  private isAcquired = true;
  constructor(private mutex: Mutex<T>) {}

  public get(target: object, property: PropertyKey, receiver?: any): any {
    if (!this.isAcquired && property === "release") {
      // Short circuit to allow double releases.
      return () => {};
    }

    if (!this.isAcquired) {
      throw new Error(`Released MutexGuard can not be used anymore`);
    }

    if (property === "release") {
      return () => {
        this.isAcquired = false;
        this.mutex[releaseMutex]();
      };
    }
    return Reflect.get(target, property, receiver);
  }
}
