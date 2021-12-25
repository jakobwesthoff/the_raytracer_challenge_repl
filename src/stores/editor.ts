import { writable } from "svelte/store";

const createErrorStore = () => {
  const { subscribe, set, update } = writable([]);

  const addErrorMessage = (message: string) => {
    update((old) => [message, ...old]);
  };

  const clearAllErrorMessages = () => {
    set([]);
  };

  return { subscribe, addErrorMessage, clearAllErrorMessages };
};

export const errors = createErrorStore();
