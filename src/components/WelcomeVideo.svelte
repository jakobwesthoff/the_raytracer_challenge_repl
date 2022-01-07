<script lang="ts">
  import { Card, Check, Overlay, Spacer } from "@kahi-ui/framework";
  import LiteYouTube from "./LiteYouTube.svelte";
  import { Lightbulb, X } from "svelte-lucide-icons";
  import { showWelcomeVideo } from "../stores/welcome";

  export let logic_id: string;
  export let logic_state: boolean = false;
</script>

<Overlay.Container
  class="welcome-video-overlay"
  {logic_id}
  bind:logic_state
  loading="lazy"
>
  <Overlay.Backdrop />
  <Overlay.Section>
    <Card.Container palette="auto">
      <Card.Header>
        <Lightbulb />
        Welcome: Tutorial
        <Spacer />
        <Overlay.Button palette="inverse" variation="clear">
          <X />
        </Overlay.Button>
      </Card.Header>
      <Card.Section>
        <LiteYouTube
          videoId="aXqCk33MWG8"
          playLabel="The Raytracer Challenge REPL: Introduction"
          params="controls=1"
        />
      </Card.Section>
      <Card.Footer>
        <Check
          id="show-welcome-video-next-time"
          palette="alert"
          size="tiny"
          bind:state={$showWelcomeVideo}
        >
          Show next time the raytracer is opened
        </Check>
        <Spacer />
        <Overlay.Button palette="inverse" variation="clear">
          Close
        </Overlay.Button>
      </Card.Footer>
    </Card.Container>
  </Overlay.Section>
</Overlay.Container>

<style>
  :global(.context-backdrop),
  :global(.welcome-video-overlay) {
    z-index: 300;
  }
</style>
