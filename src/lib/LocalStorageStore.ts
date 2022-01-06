import { writable, type Updater, type Writable } from "svelte/store";

export const localStorageStore = <TStorageType>(
  key: string,
  initialValue?: TStorageType
): Writable<TStorageType> => {
  if (!("localStorage" in window)) {
    return writable<TStorageType>(initialValue);
  }

  const packed = window.localStorage.getItem(key);
  if (packed !== null) {
    initialValue = JSON.parse(packed);
  }

  const { subscribe, set, update } = writable<TStorageType>(initialValue);

  return {
    subscribe,
    set(value: TStorageType) {
      window.localStorage.setItem(key, JSON.stringify(value));
      set(value);
    },
    update(updater: Updater<TStorageType>) {
      update((currentValue) => {
        const newValue = updater(currentValue);
        window.localStorage.setItem(key, JSON.stringify(newValue));
        return newValue;
      });
    },
  };
};
