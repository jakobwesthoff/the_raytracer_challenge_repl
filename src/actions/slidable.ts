type SlideEventDetail = { proportion: number };
export type SlideEvent = CustomEvent<SlideEventDetail>;
export type SlidableOptions = {
  orientation: "vertical" | "horizontal";
  container: HTMLElement;
};

export function slidable(
  node: HTMLElement,
  { orientation, container }: SlidableOptions
) {
  let inProgress = false;

  const blockMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onMouseDown = (event: MouseEvent) => {
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", blockMouseDown);
    node.dispatchEvent(new CustomEvent("slideStart"));
    inProgress = true;
  };

  const onMouseUp = (event: MouseEvent) => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousedown", blockMouseDown);
    node.dispatchEvent(new CustomEvent("slideEnd"));
    inProgress = false;
  };

  const onMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    let containerRect = container.getBoundingClientRect();
    let position: number;
    let dimension: number;

    if (orientation === "horizontal") {
      position = Math.max(
        Math.min(containerRect.right, event.clientX),
        containerRect.left
      );
      dimension = containerRect.width;
    } else {
      position = Math.max(
        Math.min(containerRect.bottom, event.clientY),
        containerRect.top
      );
      dimension = containerRect.height;
    }

    const proportion = position / dimension;
    node.dispatchEvent(
      new CustomEvent<SlideEventDetail>("slide", { detail: { proportion } })
    );
    event.stopPropagation();
  };

  node.addEventListener("mousedown", onMouseDown);

  return {
    update(options: SlidableOptions) {
      container = options.container;
      orientation = options.orientation;
    },

    destroy() {
      node.removeEventListener("mousedown", onMouseDown);
      if (inProgress) {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("mousedown", blockMouseDown);
      }
    },
  };
}
