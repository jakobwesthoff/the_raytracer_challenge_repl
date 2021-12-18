export type DebouncedCallback<T> = T & { clear: () => void };

export class Debouncer<T extends Function> {
  public static debounce<T extends Function>(
    callback: T,
    delay: number
  ): DebouncedCallback<T> {
    const debouncer = new Debouncer<T>(callback, delay);
    return debouncer.getDebouncedCallback();
  }

  private debounceTimeout: number;
  private debouncedCallback: DebouncedCallback<T>;

  constructor(private callback: T, private delay: number) {
    this.debounceTimeout = undefined;
    const debouncedCallback = (...args: unknown[]) => {
      if (this.debounceTimeout !== undefined) {
        window.clearTimeout(this.debounceTimeout);
        this.debounceTimeout = undefined;
      }
      this.debounceTimeout = window.setTimeout(() => {
        this.debounceTimeout = undefined;
        this.callback(...args);
      }, this.delay);
    };
    debouncedCallback.clear = () => {
      if (this.debounceTimeout !== undefined) {
        window.clearTimeout(this.debounceTimeout);
      }
    };

    this.debouncedCallback = debouncedCallback as any;
  }

  public getDebouncedCallback(): DebouncedCallback<T> {
    return this.debouncedCallback;
  }
}
