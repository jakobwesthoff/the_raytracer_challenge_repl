<script context="module" lang="ts">
  export type RenderRequestEventDetail = {
    yaml: string;
  };
  export type RenderRequestEvent = CustomEvent<RenderRequestEventDetail>;
</script>

<script lang="ts">
  import { Box, Menu, Text, Overlay } from "@kahi-ui/framework";
  import { createEventDispatcher } from "svelte";
  import { Debouncer } from "../lib/Debouncer";
  import CheckMenuButton from "./CheckMenuButton.svelte";
  import {
    CheckSquare,
    Square,
    Activity,
    ZoomIn,
    ZoomOut,
    Download,
  } from "svelte-lucide-icons";
  import CameraMenu from "./CameraMenu.svelte";
  import {
    areCameraIdsEqual,
    areCamerasEqual,
    cameras,
    selectedCamera,
  } from "../stores/camera";
  import type { Camera } from "../Render.worker";
  import { canvasUrl, zoom } from "../stores/render";

  const dispatch = createEventDispatcher();

  export let yaml: string;
  export let debounce: number = 0;

  let lastEmittedYaml: string;
  let lastSelectedCamera: Camera;

  const dispatchRender = () => {
    lastEmittedYaml = yaml;
    lastSelectedCamera = $selectedCamera;
    const detail: RenderRequestEventDetail = { yaml };
    dispatch("render", detail);
  };

  let newDataAvailable = false;
  $: {
    newDataAvailable =
      yaml != lastEmittedYaml ||
      !areCameraIdsEqual($selectedCamera, lastSelectedCamera);
  }

  let debouncedRender = Debouncer.debounce(dispatchRender, debounce);
  $: if (autorender && newDataAvailable) debouncedRender();
  $: if (!autorender) debouncedRender.clear();

  $: if (lastSelectedCamera === undefined && $selectedCamera !== undefined) {
    lastSelectedCamera = $selectedCamera;
  }

  let autorender: boolean = false;

  // Zoom
  let zoomLevels = [
    0.125, 0.25, 0.33, 0.5, 0.66, 0.75, 0.875, 1.0, 1.125, 1.25, 1.33, 1.5,
    1.66, 1.75, 1.875, 2.0,
  ];
  let zoomIndex = 7;
  const zoomIn = () => {
    if ($zoom === "fit") {
      $zoom = zoomLevels[zoomIndex];
      return;
    }

    zoomIndex += 1;
    if (zoomIndex >= zoomLevels.length) {
      zoomIndex = zoomLevels.length - 1;
    }
    $zoom = zoomLevels[zoomIndex];
  };
  const zoomOut = () => {
    if ($zoom === "fit") {
      $zoom = zoomLevels[zoomIndex];
      return;
    }

    zoomIndex -= 1;
    if (zoomIndex < 0) {
      zoomIndex = 0;
    }
    $zoom = zoomLevels[zoomIndex];
  };
  const zoomToFit = () => {
    if ($zoom === "fit") {
      $zoom = zoomLevels[zoomIndex];
      return;
    }

    zoomIndex = 7;
    $zoom = "fit";
  };
  const saveRender = () => {
    const link = document.createElement("a");
    link.href = $canvasUrl;
    link.download = "render.png";
    link.style.visibility = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
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
      <CheckMenuButton checkedPalette="alert" bind:checked={autorender}>
        <svelte:fragment slot="checked">
          <CheckSquare />
          Auto Render
        </svelte:fragment>
        <svelte:fragment slot="unchecked">
          <Square />
          Auto Render
        </svelte:fragment>
      </CheckMenuButton>
      {#if $canvasUrl !== undefined}
        <Menu.Button on:click={saveRender}>
          <Download />
          Export PNG
        </Menu.Button>
      {/if}
      {#if $cameras.length > 1}
        <CameraMenu />
      {/if}
    </Menu.Container>
  </Box>
</Overlay>

<Overlay
  class="render-controls-overlay render-controls-zoom-overlay"
  orientation="horizontal"
  alignment_x="right"
  alignment_y="bottom"
>
  <Box palette="dark" shape="rounded" margin="medium" padding="small">
    <Menu.Container orientation="horizontal" sizing="tiny">
      <Menu.Button on:click={zoomOut}>
        <ZoomOut />
      </Menu.Button>
      <Menu.Button palette="accent" on:click={zoomToFit}>
        {#if $zoom !== "fit"}
          {zoomLevels[zoomIndex] * 100} %
        {:else}
          Fit
        {/if}
      </Menu.Button>
      <Menu.Button on:click={zoomIn}>
        <ZoomIn />
      </Menu.Button>
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

  :global(.render-controls-zoom-overlay svg) {
    width: 18px;
    height: 18px;
  }
</style>
