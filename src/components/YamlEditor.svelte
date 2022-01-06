<script context="module" lang="ts">
  export type ChangeEvent = {
    text: string;
  };
</script>

<script lang="ts">
  import type { Editor, EditorConfiguration } from "codemirror";
  import "codemirror-one-dark-theme/one-dark.css";
  import { createEventDispatcher } from "svelte";
  import { Debouncer } from "../lib/Debouncer";
  import type { Deferred } from "../lib/Deferred";
  import { createDeferred } from "../lib/Deferred";
  import Codemirror from "./Codemirror.svelte";
  import type { EditorEvent } from "./Codemirror.svelte";

  let waitingUpdates: { text: string; deferred: Deferred<void> }[] = [];

  export let debounce: number = 500;
  export let hidden: boolean = false;
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

  export const refresh = () => {
    if (editor) {
      editor.refresh();
    }
  };

  const config: EditorConfiguration = {
    lineNumbers: true,
    lineWrapping: false,
    mode: {
      name: "yaml",
    },
    theme: "one-dark",
    viewportMargin: Infinity,
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

<div class="editor-container" data-editor-hidden={hidden}>
  <Codemirror {config} on:editor={onEditor} />
</div>

<style>
  div.editor-container {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 99;
    line-height: 1.4;
    background: #282c34;
  }
  div.editor-container[data-editor-hidden="true"] :global(.CodeMirror) {
    display: none;
  }

  div.editor-container :global(.CodeMirror) {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: auto;
    width: 100%;
  }

  div.editor-container :global(.cm-s-one-dark),
  div.editor-container :global(.CodeMirror) :global(*) {
    font-size: 14px;
  }

  div.editor-container :global(.CodeMirror-linenumber) {
    padding: 1px 16px 0 5px;
    font-size: 10px;
  }

  div.editor-container :global(.CodeMirror-lines) {
    padding-left: 8px;
  }
</style>
