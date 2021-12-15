<script lang="ts">
  import type { Mutex } from "../Mutex";
  import type { RenderPool } from "../RenderPool";
  import RenderControls, { RenderRequestEvent } from "./RenderControls.svelte";
  import RenderSurface from "./RenderSurface.svelte";

  export let renderPoolMutex: Mutex<RenderPool>;
  export let yaml: string;
  let surface: RenderSurface;

  const onRender = (event: RenderRequestEvent) => {
    surface.render(event.detail.yaml);
  };
</script>

<div class="container">
  <RenderControls {yaml} on:render={onRender} />
  <RenderSurface {renderPoolMutex} bind:this={surface} />
</div>

<style>
  div.container {
    display:flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
</style>
