/// <reference types="svelte" />
import { TrplClickEvent } from "./trplclickableable";

declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    ontrplclick?: (event: TrplClickEvent) => any;
  }
}
