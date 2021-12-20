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

  onMount(async () => {
    initialized = true;

    return () => {
      pool.release();
    };
  });
</script>

<div class="render-container">
  <canvas
    bind:this={canvasRef}
    style="transform-origin: 0 0; transform: scale({$zoom});"
  />
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
