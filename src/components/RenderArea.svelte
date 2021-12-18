<script lang="ts">
  import type { Mutex } from "../Mutex";
  import type { RenderPool } from "../RenderPool";
  import RenderControls, { RenderRequestEvent } from "./RenderControls.svelte";
  import RenderSurface from "./RenderSurface.svelte";

  export let renderPoolMutex: Mutex<RenderPool>;
  export let yaml: string;
  let surface: RenderSurface;

  const onRender = async (event: RenderRequestEvent) => {
    try {
      await surface.render(event.detail.yaml);
    } catch (error) {
      console.log(`Error during rendering: ${error}`);
    }
  };
</script>

<div class="render-area-container">
  <div class="surface-container">
    <RenderSurface {renderPoolMutex} bind:this={surface} />
  </div>
  <div class="controls-container">
    <RenderControls {yaml} on:render={onRender} />
  </div>
</div>

<style>
  div.render-area-container {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  div.surface-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .controls-container {
    background: rgba(0, 0, 0, 0.8);
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.8);
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    opacity: 0.5;
    transition: opacity 0.2s ease-out !important;
    padding: 0 12px;
  }
  .controls-container:hover {
    opacity: 1;
  }
</style>
