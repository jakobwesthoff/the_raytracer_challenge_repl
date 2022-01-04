export type TrplClickEvent = CustomEvent<MouseEvent>;

export function trplclickable(node: HTMLElement) {
  const onClick = (event: MouseEvent) => {
    if (event.detail === 3) {
      node.dispatchEvent(new CustomEvent("trplclick", { detail: event }));
    }
  };

  node.addEventListener("click", onClick);

  return {
    destroy() {
      node.removeEventListener("click", onClick);
    },
  };
}
