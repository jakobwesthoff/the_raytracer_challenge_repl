<script context="module" lang="ts">
  export type EditorEvent = {
    editor: Editor;
  };
</script>

<script lang="ts">
  import CodeMirror, { Editor, EditorConfiguration } from "codemirror";
  import "codemirror/mode/yaml/yaml";
  import "codemirror/lib/codemirror.css";

  import { onMount, createEventDispatcher } from "svelte";

  export let config: EditorConfiguration = {};

  let dispatch = createEventDispatcher();

  let container: HTMLElement;

  let editor: Editor;

  onMount(() => {
    editor = CodeMirror(container, config);
    setTimeout(() => dispatch("editor", { editor } as EditorEvent), 100);
  });
</script>

<div bind:this={container} />

<style>
</style>
