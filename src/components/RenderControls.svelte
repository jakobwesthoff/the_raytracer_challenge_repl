<script context="module" lang="ts">
  export type RenderRequestEventDetail = {
    yaml: string;
  };
  export type RenderRequestEvent = CustomEvent<RenderRequestEventDetail>;
</script>

<script lang="ts">
  import { Box, Menu, Overlay } from "@kahi-ui/framework";
  import { createEventDispatcher } from "svelte";
  import {
    Activity,
    CheckSquare,
    Download,
    Square,
    ZoomIn,
    ZoomOut,
  } from "svelte-lucide-icons";
  import { tooltip } from "../actions/tooltip";
  import { Debouncer } from "../lib/Debouncer";
  import type { Camera } from "../Render.worker";
  import { areCameraIdsEqual, cameras, selectedCamera } from "../stores/camera";
  import { canvasUrl, zoom } from "../stores/render";
  import CameraMenu from "./CameraMenu.svelte";
  import CheckMenuButton from "./CheckMenuButton.svelte";

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

  let autorender: boolean = true;

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
    const activeCameraName = $selectedCamera.id;
    link.download = `${activeCameraName}.png`;
    link.style.visibility = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
</script>

<Overlay.Container class="render-controls-overlay">
  <Overlay.Section
    class="render-controls-section"
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
  </Overlay.Section>
  <Overlay.Section
    class="render-controls-zoom-section"
    orientation="horizontal"
    alignment_x="right"
    alignment_y="bottom"
  >
    <Box palette="dark" shape="rounded" margin="medium" padding="small">
      <Menu.Container orientation="horizontal" sizing="tiny">
        <Menu.Button
          on:click={zoomOut}
          actions={[
            [
              tooltip,
              {
                title: "Zoom Out",
                placement: "top",
                withFocus: false,
                debounce: 600,
                size: ".75rem",
              },
            ],
          ]}
        >
          <ZoomOut />
        </Menu.Button>
        <Menu.Button
          palette="accent"
          on:click={zoomToFit}
          actions={[
            [
              tooltip,
              {
                title: "Zoom to Fit",
                placement: "top",
                withFocus: false,
                debounce: 600,
                size: ".75rem",
              },
            ],
          ]}
        >
          {#if $zoom !== "fit"}
            {zoomLevels[zoomIndex] * 100} %
          {:else}
            Fit
          {/if}
        </Menu.Button>
        <Menu.Button
          on:click={zoomIn}
          actions={[
            [
              tooltip,
              {
                title: "Zoom In",
                placement: "top",
                withFocus: false,
                debounce: 600,
                size: ".75rem",
              },
            ],
          ]}
        >
          <ZoomIn />
        </Menu.Button>
      </Menu.Container>
    </Box>
  </Overlay.Section>
</Overlay.Container>

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

  :global(.render-controls-zoom-section svg) {
    width: 18px;
    height: 18px;
  }
</style>
