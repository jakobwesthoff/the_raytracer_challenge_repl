<script lang="ts">
  import { onMount } from "svelte";
  import type { AcquiredMutex, Mutex } from "../Mutex";
  import type { RenderPool } from "../RenderPool";

  export let renderPoolMutex: Mutex<RenderPool>;

  let pool: AcquiredMutex<RenderPool>;
  let canvasRef: HTMLCanvasElement;
  let initialized = false;
  let renderedYaml: string;

  export const render = async (yaml: string) => {
    renderedYaml = yaml;
    if (pool !== undefined) {
      console.time("Stopping old render");
      await pool.stop();
      console.timeEnd("Stopping old render");
    }
    console.time("Waiting to render");
    pool = await renderPoolMutex.acquire();
    console.timeEnd("Waiting to render");
    console.time("Rendering");
    await pool.loadYaml(yaml);
    let cameras = await pool.getCameras();
    let cameraToRender = cameras[0];
    canvasRef.setAttribute("width", `${cameraToRender.width}`);
    canvasRef.setAttribute("height", `${cameraToRender.height}`);
    let ctx = canvasRef.getContext("2d");
    await pool.render(cameraToRender.id, (data, { x1, y1 }) => {
      ctx.putImageData(data, x1, y1);
    });
    console.timeEnd("Rendering");
    pool.release();
    pool = undefined;
  };

  onMount(async () => {
    initialized = true;

    return () => {
      pool.release();
    };
  });
</script>

<div class="render-container">
  <canvas bind:this={canvasRef} />
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
