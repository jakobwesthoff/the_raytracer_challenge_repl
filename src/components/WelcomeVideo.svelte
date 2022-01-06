<script lang="ts">
  import { Card, Check, Overlay, Spacer } from "@kahi-ui/framework";
  import LiteYouTube from "svelte-lite-youtube-embed";
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
      <Card.Header>Welcome: Tutorial</Card.Header>
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

  :global(.welcome-video-overlay) :global(.lite-youtube) {
    width: 75vw;
    max-height: calc(75vh - 36px * 2);
    max-width: inherit;
  }

  /* This is needed in order to ensure the playbutton style is not overwritten
   * partially by kahi-ui styling */
  :global(.lite-youtube > .lite-youtube-playbtn) {
    width: 68px !important;
    height: 48px !important;
    position: absolute !important;
    cursor: pointer !important;
    transform: translate3d(-50%, -50%, 0) !important;
    top: 50% !important;
    left: 50% !important;
    z-index: 1 !important;
    background-color: transparent !important;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 68 48"><path fill="%23f00" fill-opacity="0.8" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path><path d="M 45,24 27,14 27,34" fill="%23fff"></path></svg>') !important;
    filter: grayscale(100%) !important;
    transition: filter 0.1s cubic-bezier(0, 0, 0.2, 1) !important;
    border: none !important;
    outline: 0 !important;
  }
  :global(.lite-youtube:hover > .lite-youtube-playbtn),
  :global(.lite-youtube .lite-youtube-playbtn:focus) {
    filter: none !important;
  }
  :global(.lite-youtube.lite-youtube-activated) {
    cursor: unset !important;
  }
  :global(.lite-youtube.lite-youtube-activated::before),
  :global(.lite-youtube.lite-youtube-activated > .lite-youtube-playbtn) {
    opacity: 0 !important;
    pointer-events: none !important;
  }
</style>
