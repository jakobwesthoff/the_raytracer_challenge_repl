import { writable } from "svelte/store";
export type Zoom = number | "fit";
export const zoom = writable<Zoom>(1.0);
