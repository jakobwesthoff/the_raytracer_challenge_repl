import { SlideEvent } from "./slidable";

declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    onslide?: (event: SlideEvent) => any;
    onslideStart?: (event: Event) => any;
    onslideEnd?: (event: Event) => any;
  }
}
