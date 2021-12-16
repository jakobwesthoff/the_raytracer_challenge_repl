<script context="module" lang="ts">
  export type RenderRequestEventDetail = {
    yaml: string;
  };
  export type RenderRequestEvent = CustomEvent<RenderRequestEventDetail>;
</script>

<script lang="ts">
  import { Badge, Button, Check, Stack, Text } from "@kahi-ui/framework";
  import { createEventDispatcher } from "svelte";
  import { Debouncer } from "../Debouncer";
  import CheckButton from "./CheckButton.svelte";
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

<div class="controls-container">
  <div class="actions-container">
    {#if newDataAvailable}
      <Button palette="affirmative" on:click={dispatchRender}
        >Raytrace Scene</Button
      >
    {:else}
      <Button palette="dark" on:click={dispatchRender}>Raytrace Scene</Button>
    {/if}
  </div>
  <div class="autorender-container">
    <!-- <Stack orientation="horizontal">
      <Check margin_right="small" palette="accent" bind:state={autorender} />
      <Badge margin_right="medium">Automatic Rendering</Badge>
    </Stack> -->
    <CheckButton
      palette="dark"
      checkedPalette="alert"
      bind:checked={autorender}
    >
      Auto Render
    </CheckButton>
  </div>
</div>

<style>
  div.controls-container {
    display: flex;
    flex-direction: row;
    height: 48px;
    align-items: center;
  }

  div.actions-container {
    display: flex;
    flex-direction: row;
    align-self: center;
    flex-grow: 1;
  }

  div.autorender-container {
    display: flex;
    flex-direction: row;
    align-self: center;
  }
</style>
