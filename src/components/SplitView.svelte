<script lang="ts">
import { createEventDispatcher } from 'svelte';

  import { GripHorizontal, GripVertical } from "svelte-lucide-icons";
  import { slidable, SlideEvent } from "../actions/slidable";
  export let orientation: "horizontal" | "vertical" = "horizontal";

  let dispatch = createEventDispatcher();

  let splitPoint = 0.5;
  let inSlide = false;
  let oldStyle: string;
  let container: HTMLElement;

  const onSlide = (event: SlideEvent) => {
    splitPoint = event.detail.proportion;
    dispatch('slide', event.detail);
  };

  const onSlideStart = (event: Event) => {
    inSlide = true;
    oldStyle = document.body.style.cssText;
    document.body.style.cssText = `${oldStyle}; cursor: grab !important`;
    dispatch('slideStart');
  };

  const onSlideEnd = (event: Event) => {
    inSlide = false;
    document.body.style.cssText = oldStyle;
    oldStyle = undefined;
    dispatch('slideEnd');
  };
</script>

<main
  class="split-container"
  data-orientation={orientation}
  data-in-slide={inSlide}
  style="--split-point-a: {splitPoint}"
  bind:this={container}
>
  <section class="a">
    <slot name="a" />
  </section>
  <!-- @FIXME: Find a way to suppress the on:* type errors.
               It compiles as the slidable action makes this one available, but
               the linter does not seem to know about this.
  -->
  <span
    class="split-divider"
    data-orientation={orientation}
    data-in-slide={inSlide}
    use:slidable={{ container, orientation }}
    on:slide={onSlide}
    on:slideStart={onSlideStart}
    on:slideEnd={onSlideEnd}
  >
    {#if orientation == "horizontal"}
      <GripVertical />
      <GripVertical />
    {:else}
      <GripHorizontal />
      <GripHorizontal />
    {/if}
  </span>
  <section class="b">
    <slot name="b" />
  </section>
</main>

<style>
  .split-container {
    display: flex;
    flex-grow: 1;
    --split-point-a: 0.5;
    position: relative;
  }

  .split-container[data-orientation="horizontal"] {
    flex-direction: row;
  }
  .split-container[data-orientation="vertical"] {
    flex-direction: column;
  }

  .split-divider {
    display: flex;
    background: #1e2125;
    color: rgba(147, 156, 168, 0.5);
    justify-content: center;
    z-index: 99;
    box-shadow: -3px 2px 5px rgba(0, 0, 0, 0.5);
  }

  .split-container[data-orientation="vertical"] .split-divider {
    flex-direction: row;
    width: 100%;
  }

  .split-container[data-orientation="horizontal"] .split-divider {
    flex-direction: column;
    height: 100%;
  }

  .split-container[data-orientation="vertical"][data-in-slide="false"]
    .split-divider:hover {
    cursor: ns-resize;
  }

  .split-container[data-orientation="horizontal"][data-in-slide="false"]
    .split-divider:hover {
    cursor: ew-resize;
  }

  .split-divider:hover,
  .split-divider[data-in-slide="true"] {
    color: #db9e1c;
    background: #22252a;

  }

  .split-divider :global(svg) {
    width: 20px;
    height: 20px;
  }

  .split-container[data-orientation="vertical"] .split-divider > :global(svg) {
    margin: -3px 0 -3px -2.5px;
  }

  .split-container[data-orientation="horizontal"]
    .split-divider
    > :global(svg) {
    margin: -2.5px -2px 0 -3px;
  }

  section {
    display: flex;
    min-width: 100px;
  }

  section.a {
    width: calc(100% * var(--split-point-a));
  }

  section.b {
    flex-grow: 1;
  }
</style>
