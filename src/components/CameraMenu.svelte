<script lang="ts">
  import {
    Card,
    ContextButton,
    Menu,
    Overlay,
    Popover,
    Spacer,
    Stack,
    Text,
  } from "@kahi-ui/framework";
  import { onMount } from "svelte";
  import { CheckSquare, Square, Video } from "svelte-lucide-icons";
  import { __wbg_set_camera_height } from "../../rust/pkg/raytracer_bg.wasm";
  import type { Camera } from "../Render.worker";
  import { areCamerasEqual, cameras, selectedCamera } from "../stores/camera";

  let state = false;
  let popoverCheckBox: HTMLInputElement;
  let button: HTMLButtonElement;

  const selectCamera = (camera: Camera) => {
    $selectedCamera = camera;
  };

  const onOpenPopover = async () => {
    state = !state;
  };

  const isChildOf = (element: HTMLElement, candidate: HTMLElement): boolean => {
    return (
      candidate.parentElement === element ||
      (candidate.parentElement !== null &&
        isChildOf(element, candidate.parentElement))
    );
  };

  const closePopover = (event: Event) => {
    if (
      event.target === button ||
      isChildOf(button, event.target as HTMLElement)
    ) {
      return;
    }

    state = false;
  };

  $: if (popoverCheckBox) {
    popoverCheckBox.checked = state;
  }

  $: if (state) {
    document.addEventListener("click", closePopover);
  }

  $: if (!state) {
    document.removeEventListener("click", closePopover);
  }

  onMount(() => {
    popoverCheckBox = document.getElementById(
      "camera-selection"
    ) as HTMLInputElement;
  });
</script>

<Menu.Item>
  <button on:click={onOpenPopover} bind:this={button}><Video /> Camera</button>
  <Popover
    logic_id="camera-selection"
    alignment_x="right"
    spacing="medium"
    hidden
  >
    {#if $cameras.length > 0}
      <Card.Container
        palette="auto"
        elevation="medium"
        max_width="content-fit"
        margin="none"
        padding="none"
      >
        <Card.Section>
          <Menu.Container sizing="tiny">
            {#each $cameras as camera}
              <Menu.Button on:click={() => selectCamera(camera)}>
                {#if areCamerasEqual(camera, $selectedCamera)}
                  <CheckSquare />
                {:else}
                  <Square />
                {/if}
                {camera.id}
              </Menu.Button>
            {/each}
          </Menu.Container>
        </Card.Section>
      </Card.Container>
    {/if}
  </Popover>
</Menu.Item>
