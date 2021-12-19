<script context="module" lang="ts">
  export type RenderRequestEventDetail = {
    yaml: string;
  };
  export type RenderRequestEvent = CustomEvent<RenderRequestEventDetail>;
</script>

<script lang="ts">
  import { Box, Menu, Overlay } from "@kahi-ui/framework";
  import { createEventDispatcher } from "svelte";
  import { Debouncer } from "../lib/Debouncer";
  import CheckMenuButton from "./CheckMenuButton.svelte";
  import { CheckSquare, Square, Activity } from "svelte-lucide-icons";

  const dispatch = createEventDispatcher();

  export let yaml: string;
  export let debounce: number = 0;
  let lastEmittedYaml: string;

  const dispatchRender = () => {
    lastEmittedYaml = yaml;
    const detail: RenderRequestEventDetail = { yaml };
    dispatch("render", detail);
  };

  let newDataAvailable = false;
  $: newDataAvailable = yaml != lastEmittedYaml;

  let debouncedRender = Debouncer.debounce(dispatchRender, debounce);
  $: if (autorender && newDataAvailable) debouncedRender();
  $: if (!autorender) debouncedRender.clear();

  let autorender: boolean = false;
</script>

<Overlay
  class="render-controls-overlay"
  orientation="horizontal"
  alignment_x="left"
  alignment_y="top"
>
  <Box palette="dark" shape="rounded" margin="medium" padding="small">
    <Menu.Container orientation="horizontal" sizing="tiny">
      {#if newDataAvailable}
        <Menu.Button palette="affirmative" on:click={dispatchRender}>
          <Activity />
          Raytrace Scene
        </Menu.Button>
      {:else}
        <Menu.Button palette="accent" on:click={dispatchRender}>
          <Activity />
          Raytrace Scene
        </Menu.Button>
      {/if}
      <CheckMenuButton
        checkedPalette="alert"
        bind:checked={autorender}
      >
        <svelte:fragment slot="checked">
          <CheckSquare />
          Auto Render
        </svelte:fragment>
        <svelte:fragment slot="unchecked">
          <Square />
          Auto Render
        </svelte:fragment>
      </CheckMenuButton>
    </Menu.Container>
  </Box>
</Overlay>

<style>
  :global(.render-controls-overlay) {
    position: absolute;
  }

  :global(.render-controls-overlay) :global(.box:hover) {
    transition: opacity 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
  }
  :global(.render-controls-overlay) :global(.box:not(:hover)) {
    opacity: 0.5;
  }
</style>
