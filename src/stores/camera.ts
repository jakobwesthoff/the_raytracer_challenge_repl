import type { Updater, Writable } from "svelte/store";
import { writable } from "svelte/store";
import type { Camera } from "../Render.worker";

export const areCamerasEqual = (a: Camera, b: Camera): boolean => {
  return (
    a === b ||
    (a && b && a.id === b.id && a.width === b.width && a.height === b.height)
  );
};

export const areCameraIdsEqual = (a?: Camera, b?: Camera): boolean => {
  return a === b || (a && b && a.id === b.id);
};

const createCamerasStore = (): Writable<Camera[]> => {
  const { subscribe, set, update } = writable<Camera[]>([]);

  return {
    subscribe,
    set,
    update,
  };
};

const createSelectedCameraStore = (): Writable<Camera> => {
  const { subscribe, set, update } = writable<Camera>(undefined);

  let currentCameras: Camera[];
  let currentSelectedCamera: Camera = undefined;

  cameras.subscribe((newCameras) => {
    currentCameras = newCameras;
    if (currentSelectedCamera === undefined) {
      set((currentSelectedCamera = newCameras[0]));
    } else {
      const possiblyUpdatedSelectedCamera = currentCameras.find(
        (candidate) => candidate.id === currentSelectedCamera.id
      );
      if (possiblyUpdatedSelectedCamera === undefined) {
        set((currentSelectedCamera = currentCameras[0]));
      } else if (
        !areCamerasEqual(possiblyUpdatedSelectedCamera, currentSelectedCamera)
      ) {
        set((currentSelectedCamera = possiblyUpdatedSelectedCamera));
      }
    }
  });

  const innerSet = (camera: Camera) => {
    if (
      !currentCameras.find((candidate) =>
        areCamerasEqual(candidate, currentSelectedCamera)
      )
    ) {
      throw new Error(
        `Selected Camera '${JSON.stringify(
          camera
        )}' is not available within active cameras '${JSON.stringify(
          currentCameras
        )}'`
      );
    }

    set((currentSelectedCamera = camera));
  };

  const innerUpdate = (updater: Updater<Camera>) => {
    const newCamera = updater(currentSelectedCamera);
    innerSet(newCamera);
  };

  return {
    subscribe,
    set: innerSet,
    update: innerUpdate,
  };
};

export const cameras = createCamerasStore();
export const selectedCamera = createSelectedCameraStore();
