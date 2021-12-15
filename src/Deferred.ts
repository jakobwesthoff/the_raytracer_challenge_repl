export interface Deferred<T> {
  promise: Promise<T>;
  resolve: (result: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

export function createDeferred<T>(): Deferred<T> {
  let resolve: (result: T | PromiseLike<T>) => void;
  let reject: (reason?: any) => void;
  const promise = new Promise<T>((innerResolve, innerReject) => {
    resolve = innerResolve;
    reject = innerReject;
  });

  return {
    resolve,
    reject,
    promise,
  };
}
