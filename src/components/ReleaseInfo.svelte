<script lang="ts">
  import {
    buildDate,
    gitVersion,
    wasmWrapperInfo,
    wasmRaytracerInfo,
  } from "../../build.info.json";
  import { Card, Code, Heading, Overlay, Spacer } from "@kahi-ui/framework";
  import { X } from "svelte-lucide-icons";

  export let logic_id: string;
  export let logic_state: boolean = false;
</script>

<Overlay.Container
  class="release-info-overlay"
  {logic_id}
  bind:logic_state
  loading="lazy"
>
  <Overlay.Backdrop />
  <Overlay.Section>
    <Card.Container palette="auto" max_height="75" max_width="75">
      <Card.Header>
        Release Version Information
        <Spacer />
        <Overlay.Button palette="inverse" variation="clear">
          <X />
        </Overlay.Button>
      </Card.Header>
      <div class="scrollable-release-info-card">
        <Card.Section>
          <Heading is="h3">REPL:</Heading>
          <p>
            <strong>Version:</strong>
            <Code>{gitVersion}</Code><br />
            <strong>Build Date:</strong>
            <Code>{buildDate}</Code><br />
          </p>
        </Card.Section>
        <Card.Section>
          <Heading is="h3">WASM Module:</Heading>
          <p>
            <strong>Wrapper:</strong>
            <Code>{wasmWrapperInfo}</Code>
          </p>
          <p>
            <strong>Raytracer:</strong>
            <Code>{wasmRaytracerInfo}</Code>
          </p>
        </Card.Section>
      </div>

      <Card.Footer>
        <Overlay.Button palette="inverse" variation="clear"
          >Close</Overlay.Button
        >
      </Card.Footer>
    </Card.Container>
  </Overlay.Section>
</Overlay.Container>

<style>
  :global(.context-backdrop),
  :global(.release-info-overlay) {
    z-index: 300;
  }
  .scrollable-release-info-card {
    overflow: auto;
    padding: 6px 18px 24px 18px;
  }

  .scrollable-release-info-card :global(section) {
    margin-top: 18px;
  }

  .scrollable-release-info-card :global(p) {
    margin-top: 14px;
  }
</style>
