<script lang="ts">
  import { onMount } from "svelte";
  import type { AcquiredMutex, Mutex } from "../lib/Mutex";
  import type { RenderPool } from "../lib/RenderPool";
  import { cameras, selectedCamera } from "../stores/camera";
  import { zoom } from "../stores/render";

  export let renderPoolMutex: Mutex<RenderPool>;

  let pool: AcquiredMutex<RenderPool>;
  let canvasRef: HTMLCanvasElement;
  let initialized = false;
  let renderedYaml: string;
  let zoomTransformation: string;
  let containerWidth: number, containerHeight: number;

  export const updateCameras = async (yaml: string): Promise<void> => {
    if (pool !== undefined) {
      console.time("Stopping old render");
      await pool.stop();
      console.timeEnd("Stopping old render");
    }
    console.time("Waiting to acquire render pool");
    pool = await renderPoolMutex.acquire();
    console.timeEnd("Waiting to acquire render pool");
    try {
      console.time("Getting cameras");
      await pool.loadYaml(yaml);
      const loadedCameras = await pool.getCameras();
      loadedCameras.sort((a, b) => a.id.localeCompare(b.id));
      $cameras = loadedCameras;
    } catch (e) {
      throw e;
    } finally {
      console.timeEnd("Getting cameras");
      pool.release();
      pool = undefined;
    }
  };

  export const render = async (yaml: string): Promise<void> => {
    renderedYaml = yaml;
    await updateCameras(yaml);
    if (pool !== undefined) {
      console.time("Stopping old render");
      await pool.stop();
      console.timeEnd("Stopping old render");
    }
    console.time("Waiting to render");
    pool = await renderPoolMutex.acquire();
    console.timeEnd("Waiting to render");
    try {
      console.time("Rendering");
      await pool.loadYaml(yaml);
      let cameraToRender = $selectedCamera;
      canvasRef.setAttribute("width", `${cameraToRender.width}`);
      canvasRef.setAttribute("height", `${cameraToRender.height}`);
      let ctx = canvasRef.getContext("2d");
      await pool.render(cameraToRender.id, (data, { x1, y1 }) => {
        ctx.putImageData(data, x1, y1);
      });
    } catch (e) {
      throw e;
    } finally {
      console.timeEnd("Rendering");
      pool.release();
      pool = undefined;
    }
  };

  $: if ($zoom === "fit") {
    if (
      canvasRef &&
      canvasRef.width !== undefined &&
      canvasRef.height !== undefined
    ) {
      if (
        canvasRef.height * (containerWidth / canvasRef.width) <=
        containerHeight
      ) {
        zoomTransformation = `width: 100%;`;
      } else {
        zoomTransformation = `height: 100%;`;
      }
    } else {
      zoomTransformation = "";
    }
  } else {
    zoomTransformation = `transform-origin: 0 0; transform: scale(${$zoom});`;
  }

  onMount(async () => {
    initialized = true;

    return () => {
      pool.release();
    };
  });
</script>

<div
  class="render-container"
  bind:clientHeight={containerHeight}
  bind:clientWidth={containerWidth}
>
  <canvas bind:this={canvasRef} style={zoomTransformation} />
</div>

<style>
  .render-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
