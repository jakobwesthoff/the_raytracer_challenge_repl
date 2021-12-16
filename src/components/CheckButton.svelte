<script context="module" lang="ts">
  type Palette = "auto" | "inverse" | "inherit" | "accent" | "dark" | "light" | "alert" | "affirmative" | "negative" | undefined;
</script>
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "@kahi-ui/framework";

  export let checked = false;
  export let checkedPalette: Palette = "affirmative";

  let dispatch = createEventDispatcher();

  const flipChecked = () => {
    checked = !checked;
  };

  $: dispatch("checked", { checked });
</script>

{#if checked}
  <Button {...$$props} palette={checkedPalette} on:click={flipChecked}>
    <slot />
  </Button>
{:else}
  <Button {...$$props} on:click={flipChecked}>
    <slot />
  </Button>
{/if}
