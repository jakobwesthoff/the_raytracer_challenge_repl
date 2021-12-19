<script lang="ts">
  import "@kahi-ui/framework/dist/kahi-ui.framework.css";

  import YamlEditor, { ChangeEvent } from "./components/YamlEditor.svelte";
  import RenderSurface from "./components/RenderSurface.svelte";
  import { RenderPool } from "./lib/RenderPool";
  import { Mutex } from "./lib/Mutex";
  import { onMount } from "svelte";
  import RenderArea, {
    RenderErrorEvent,
    RenderFinishedEvent,
  } from "./components/RenderArea.svelte";
  import SplitView from "./components/SplitView.svelte";
  import type { SlideEvent } from "./actions/slidable";
  import { Debouncer } from "./lib/Debouncer";
  import {
    FunctionSquare,
    Github,
    Heart,
    Twitter,
    Youtube,
  } from "svelte-lucide-icons";
  import { Anchor, Menu } from "@kahi-ui/framework";
  import ErrorTile from "./components/ErrorTile.svelte";
  import three_spheres_world from "./worlds/three_spheres.yaml";

  let editor: YamlEditor;
  let hideEditor = false;

  let yaml = three_spheres_world;

  let errorTile: ErrorTile;

  const onchange = (event: CustomEvent<ChangeEvent>) => {
    yaml = event.detail.text;
  };

  const onSlideStart = () => {
    hideEditor = true;
  };

  const onSlideEnd = () => {
    hideEditor = false;
  };

  const onRenderError = (event: RenderErrorEvent) => {
    errorTile.addErrorMessage(event.detail.error.message);
  };

  const onRenderFinished = (event: RenderFinishedEvent) => {
    errorTile.clearErrorMessages();
  };

  const renderPoolMutex = new Mutex(new RenderPool());

  onMount(() => {
    editor.setText(yaml);
  });
</script>

<div class="wrapper">
  <header>
    <h1>
      <FunctionSquare /> The Raytracer Challenge in Rust
    </h1>
    <div class="links">
      <Menu.Container orientation="horizontal" sizing="tiny">
        <Menu.Anchor
          href="https://github.com/jakobwesthoff/the_ray_tracer_challenge_in_rust"
        >
          <Github />
        </Menu.Anchor>
        <Menu.Anchor
          href="https://www.youtube.com/channel/UC-2w7N7aCqs_QclGUtXkSqg"
        >
          <Youtube />
        </Menu.Anchor>
        <Menu.Anchor href="https://twitter.com/jakobwesthoff/" palette="light">
          <Twitter />
        </Menu.Anchor>
      </Menu.Container>
    </div>
  </header>
  <SplitView on:slideStart={onSlideStart} on:slideEnd={onSlideEnd}>
    <svelte:fragment slot="a">
      <RenderArea
        {yaml}
        {renderPoolMutex}
        on:error={onRenderError}
        on:finished={onRenderFinished}
      />
    </svelte:fragment>
    <svelte:fragment slot="b">
      <ErrorTile bind:this={errorTile} />
      <YamlEditor on:change={onchange} hidden={hideEditor} bind:this={editor} />
    </svelte:fragment>
  </SplitView>
  <footer>
    Made with &nbsp; <Heart /> &nbsp; by &nbsp; <Anchor
      palette="accent"
      href="http://westhoffswelt.de">Jakob Westhoff</Anchor
    >
  </footer>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  header {
    display: flex;
    background: #282c34;
    /* color: #a6adb8; */
    color: #f2f2f2;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.5);
    display: flex;
    height: 46px;
    font-size: 1.25rem;
    z-index: 100;
    align-items: center;
    padding: 0 0 0 8px;
  }
  header h1 {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    font-size: 1.3rem;
  }

  header h1 > :global(svg) {
    width: 28px;
    height: 28px;
    margin-right: 8px;
  }

  header .links {
    margin-right: 8px;
  }

  footer {
    display: flex;
    height: 36px;
    background: #282c34;
    z-index: 100;
    font-size: 1rem;
    box-shadow: 0px -3px 5px rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
  }
  footer > :global(svg) {
    width: 20px;
    height: 20px;
  }
</style>
