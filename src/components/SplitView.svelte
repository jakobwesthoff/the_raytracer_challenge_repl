<script lang="ts">
  import { slidable, SlideEvent } from "../actions/slidable";
  export let orientation: "horizontal" | "vertical" = "horizontal";

  let splitPoint = 0.2;
  let container: HTMLElement;

  const onSlide = (event: SlideEvent) => {
    splitPoint = event.detail.proportion;
  };
</script>

<main
  class="split-container {orientation}"
  style="--split-point-a: {splitPoint}"
  bind:this={container}
>
  <section class="a">
    <slot name="a" />
  </section>
  <!-- @FIXME: Find a way to suppress the on:slide type error.
               It compiles as the slidable action makes this one available, but
               the linter does not seem to know about this.
  -->
  <span
    class="split-divider {orientation}"
    use:slidable={{ container, orientation }}
    on:slide={onSlide}
  />
  <section class="b">
    <slot name="b" />
  </section>
</main>

<style>
  .split-container {
    display: flex;
    flex-grow: 1;
    --split-point-a: 0.5;
  }

  .split-container:global(.horizontal) {
    flex-direction: row;
  }
  .split-container:global(.vertical) {
    flex-direction: column;
  }

  .split-divider {
    display: block;
    background: goldenrod;
  }

  .split-divider:global(.vertical) {
    height: 12px;
    width: 100%;
  }
  .split-divider:global(.horizontal) {
    width: 12px;
    height: 100%;
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
