import { off } from "codemirror";
import { Readable, Updater, Writable, writable } from "svelte/store";
export type Zoom = number | "fit";

const createCanvasUrlStore = (canvasBlob: Writable<Blob>): Readable<string> => {
  const { subscribe, update } = writable(undefined);

  canvasBlob.subscribe((newBlob) => {
    if (newBlob !== undefined) {
      update((currentUrl) => {
        if (currentUrl !== undefined) {
          window.URL.revokeObjectURL(currentUrl);
        }
        return window.URL.createObjectURL(newBlob);
      });
    } else {
      update((currentUrl) => {
        if (currentUrl !== undefined) {
          window.URL.revokeObjectURL(currentUrl);
        }
        return undefined;
      });
    }
  });

  return { subscribe };
};

export const zoom = writable<Zoom>(1.0);
export const canvasBlob: Writable<Blob> = writable(undefined);
export const canvasUrl = createCanvasUrlStore(canvasBlob);
