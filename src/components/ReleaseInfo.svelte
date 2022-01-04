<script lang="ts">
  import {
    buildDate,
    gitVersion,
    wasmWrapperInfo,
    wasmRaytracerInfo,
  } from "../../build.info.json";
  import {
    Card,
    Code,
    ContextButton,
    Heading,
    Overlay,
  } from "@kahi-ui/framework";

  export let logic_id: string;
  export let logic_state: boolean = false;
</script>

<Overlay
  class="release-info-overlay"
  {logic_id}
  bind:state={logic_state}
  loading="lazy"
  captive
>
  <Card.Container palette="auto" max_height="75" max_width="75">
    <Card.Header>Release Version Information</Card.Header>
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
      <ContextButton palette="inverse" variation="clear">Close</ContextButton>
    </Card.Footer>
  </Card.Container>
</Overlay>

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
