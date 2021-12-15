<script context="module" lang="ts">
  export type ChangeEvent = {
    text: string;
  };
</script>

<script lang="ts">
  import type { Editor, EditorConfiguration } from "codemirror";
  import { createEventDispatcher } from "svelte";
  import { Debouncer } from "../Debouncer";
  import { createDeferred, Deferred } from "../Deferred";
  import Codemirror, { EditorEvent } from "./Codemirror.svelte";
  // Important: Load theme after Editor component, to allow for correct css
  // nesting
  import "codemirror-one-dark-theme/one-dark.css";

  let waitingUpdates: { text: string; deferred: Deferred<void> }[] = [];

  export let debounce: number = 500;
  export const setText = async (text: string): Promise<void> => {
    if (editor) {
      // Try to save the scroll position
      let { left, top } = editor.getScrollInfo();
      editor.setValue(text);
      editor.scrollTo(left, top);
    } else {
      const deferred = createDeferred<void>();
      waitingUpdates.push({ text, deferred });
      return deferred.promise;
    }
  };

  const config: EditorConfiguration = {
    lineNumbers: true,
    lineWrapping: false,
    mode: {
      name: "yaml",
    },
    theme: "one-dark",
  };

  let dispatch = createEventDispatcher();

  let editor: Editor;
  const onEditor = (event: CustomEvent<EditorEvent>) =>
    (editor = event.detail.editor);

  $: if (editor) {
    editor.setSize("100%", "100%");
    editor.on(
      "change",
      Debouncer.debounce(
        (editor: Editor) =>
          dispatch("change", { text: editor.getValue() } as ChangeEvent),
        debounce
      )
    );
    if (waitingUpdates.length > 0) {
      while (waitingUpdates.length > 0) {
        let waiting = waitingUpdates.shift();
        editor.setValue(waiting.text);
        waiting.deferred.resolve();
      }
    }
  }
</script>

<div class="editor-container">
  <Codemirror {config} on:editor={onEditor} />
</div>

<style>
  div.editor-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  div.editor-container :global(.CodeMirror) {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
  }

  div.editor-container :global(.CodeMirror-linenumber) {
    padding: 1px 16px 0 5px;
    font-size: 10px;
  }

  div.editor-container :global(.CodeMirror-lines) {
    padding-left: 8px;
  }
</style>
