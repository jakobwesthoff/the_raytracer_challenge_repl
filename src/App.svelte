<script lang="ts">
  import "@kahi-ui/framework/dist/kahi-ui.framework.css";

  import YamlEditor, { ChangeEvent } from "./components/YamlEditor.svelte";
  import RenderSurface from "./components/RenderSurface.svelte";
  import { RenderPool } from "./RenderPool";
  import { Mutex } from "./Mutex";
  import { onMount } from "svelte";
  import RenderArea from "./components/RenderArea.svelte";

  let editor: YamlEditor;

  let yaml = `
---
- light:
    type: point_light
    at: [-10, 10, -10]
    intensity: [1, 1, 1]

# Floor
- body:
    type: plane
    material:
      type: phong
      color: [0.5, 0.45, 0.45]
      specular: 0.0

# Left Sphere
- body:
    type: sphere
    material:
      type: phong
      color: [0.635, 0, 1]
    transforms:
      - type: scale
        to: [0.33, 0.33, 0.33]
      - type: translate
        to: [-1.5, 0.33, -0.75]

# Middle Sphere
- body:
    type: sphere
    material:
      type: phong
      color: [1, 0, 0.635]
      diffuse: 0.9
      specular: 1.8
    transforms:
      - type: translate
        to: [-0.5, 1.0, 0.5]

# Right Sphere
- body:
    type: sphere
    material:
      type: phong
      color: [0, 0.635, 1]
    transforms:
      - type: scale
        to: [0.5, 0.5, 0.5]
      - type: translate
        to: [1.5, 0.5, -0.5]

# Camera
- camera:
    name: main_camera
    width: 1280
    height: 720
    field_of_view: 1.047 # PI/3
    from: [0, 1.5, -5]
    to: [0, 1, 0]
    up: [0, 1, 0]

# Camera further moved down x
- camera:
    name: second_camera
    width: 1280
    height: 720
    field_of_view: 1.047 # PI/3
    from: [1, 0.5, -5]
    to: [0, 1, 0]
    up: [0, 1, 0]
`;

  const onchange = (event: CustomEvent<ChangeEvent>) => {
    yaml = event.detail.text;
  };

  const renderPoolMutex = new Mutex(new RenderPool());

  onMount(() => {
    editor.setText(yaml);
  });
</script>

<div class="wrapper">
  <header>The Raytracer Challenge in Rust</header>
  <main>
    <section class="renderer">
      <RenderArea {yaml} {renderPoolMutex} />
    </section>
    <section class="editor">
      <YamlEditor on:change={onchange} bind:this={editor} />
    </section>
  </main>
  <footer>Made with ❤️ by Jakob Westhoff</footer>
</div>

<style>
  /* :global(body) {
    display: flex;
    flex-direction: column;
  } */

  .wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  header {
    display: flex;
    height: 46px;
    /* box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1); */
    border-bottom: 1px solid black;
    font-size: 1.25rem;
  }

  main {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
  }

  section {
    display: flex;
    flex: 1;
  }

  section:not(:last-child) {
    border-right: 1px solid black;
  }

  footer {
    display: flex;
    height: 46px;
    /* box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1); */
    border-top: 1px solid black;
    font-size: 1.25rem;
  }
</style>
