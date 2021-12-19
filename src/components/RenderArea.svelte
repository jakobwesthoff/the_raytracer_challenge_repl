<script context="module" lang="ts">
  export type RenderErrorEventDetail = { error: Error };
  export type RenderErrorEvent = CustomEvent<RenderErrorEventDetail>;

  export type RenderFinishedEventDetail = {};
  export type RenderFinishedEvent = CustomEvent<RenderFinishedEventDetail>;
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { Mutex } from "../Mutex";
  import type { RenderPool } from "../RenderPool";
  import type { RenderRequestEvent } from "./RenderControls.svelte";
  import RenderControls from "./RenderControls.svelte";
  import RenderSurface from "./RenderSurface.svelte";

  export let renderPoolMutex: Mutex<RenderPool>;
  export let yaml: string;

  let dispatch = createEventDispatcher();

  let surface: RenderSurface;

  const onRender = async (event: RenderRequestEvent) => {
    try {
      await surface.render(event.detail.yaml);
      dispatch("finished", {});
    } catch (error) {
      dispatch("error", { error });
    }
  };
</script>

<div class="render-area-container">
  <div>
    <RenderControls {yaml} on:render={onRender} />
  </div>
  <div class="full-frame">
    <RenderSurface {renderPoolMutex} bind:this={surface} />
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

  div.full-frame {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
</style>
