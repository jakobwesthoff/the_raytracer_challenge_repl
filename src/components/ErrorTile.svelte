<script lang="ts">
  import {
    Text,
    Stack,
    Tile,
    Overlay,
    Button,
    Transition,
  } from "@kahi-ui/framework";
  import { AlertTriangle } from "svelte-lucide-icons";
  import { errors } from "../stores/editor";

  let renderedMessage: string = $errors.length === 0 ? "" : $errors[0];
  let variation: "enter" | "exit" = "enter";
  let hideTile = true;

  $: if ($errors.length === 0) {
    variation = "exit";
  } else {
    renderedMessage = $errors[0];
    hideTile = false;
    variation = "enter";
  }
  const onAnimationEnd = () => {
    if (variation == "exit") {
      hideTile = true;
    }
  };
</script>

<Overlay
  class="error-tile-overlay"
  orientation="horizontal"
  alignment_y="bottom"
  alignment_x="right"
>
  <Stack margin="medium" padding="small">
    {#if !hideTile}
      <Transition animation="fade" {variation} on:animationend={onAnimationEnd}>
        <Tile.Container width="content-max">
          <Tile.Figure>
            <AlertTriangle />
          </Tile.Figure>
          <Tile.Section>
            <Tile.Header>
              <Text size="medium">Warning:</Text>
            </Tile.Header>
            <Text><Text is="small">{renderedMessage}</Text></Text>
          </Tile.Section>
          <!-- <Tile.Footer>
            <Button
              size="small"
              palette="accent"
              on:click={() => (message = "")}>DISMISS</Button
            >
          </Tile.Footer> -->
        </Tile.Container>
      </Transition>
    {/if}
  </Stack>
</Overlay>

<style>
  :global(.error-tile-overlay) {
    position: absolute;
    z-index: 200;
  }

  :global(.error-tile-overlay figure) {
    color: #d79518;
  }

  :global(.error-tile-overlay) :global(.tile:hover) {
    transition: opacity 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
  }
  :global(.error-tile-overlay) :global(.tile:not(:hover)) {
    opacity: 0.8;
  }
</style>
