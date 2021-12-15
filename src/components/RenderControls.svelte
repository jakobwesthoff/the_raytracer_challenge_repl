<script context="module" lang="ts">
  export type RenderRequestEventDetail = {
    yaml: string;
  };
  export type RenderRequestEvent = CustomEvent<RenderRequestEventDetail>;
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Debouncer } from "../Debouncer";
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

<div class="container">
  <button on:click={dispatchRender}>Render</button>
  {#if newDataAvailable}
    <span>(NEW)</span>
  {/if}
  <label>
    <input type="checkbox" bind:checked={autorender} />
    enable autorender
  </label>
</div>

<style>
  div.container {
    display: flex;
    flex-direction: row;
    height: 64px;
  }

  button {
    display: block;
    height: 95%;
  }
</style>
