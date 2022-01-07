import { Debouncer } from "../lib/Debouncer";
import { computePosition, offset, shift } from "@floating-ui/dom";

export type TooltipOptions =
  | string
  | {
      title: string;
      debounce?: number;
    };

export function tooltip(node: HTMLElement, options: TooltipOptions) {
  let debounce = 250;
  let title = "";
  if (typeof options === "string") {
    title = options;
  } else {
    title = options.title;
    if (options.debounce !== undefined) {
      debounce = options.debounce;
    }
  }

  let tooltipNode: HTMLElement | undefined;
  let focused: boolean = false;
  let hovered: boolean = false;

  const createTooltipNode = () => {
    if (tooltipNode !== undefined && tooltipNode.parentElement !== undefined) {
      return;
    }

    tooltipNode = document.createElement("div");
    tooltipNode.innerHTML = title;
    Object.assign(tooltipNode.style, {
      position: "absolute",
      zIndex: "999",
      opacity: 0,
      visibility: "hidden",
      transition: "opacity 0.2s, visibility 0.2s",
      padding: "8px 16px",
      border:
        "var(--card-border-width) rgba(var(--card-border-color), var(--card-border-opacity)) solid",
      borderRadius: "var(--card-border-radius)",
      background: "rgb(var(--palette-background-normal))",
      color: "rgb(var(--palette-foreground-normal))",
      boxShadow: "var(--elevation)",
    });

    document.body.appendChild(tooltipNode);

    computePosition(node, tooltipNode, {
      middleware: [offset(4), shift()],
    }).then(({ x, y }) => {
      Object.assign(tooltipNode.style, {
        left: `${x}px`,
        top: `${y}px`,
        opacity: 1,
        visibility: "initial",
      });
    });
  };

  const destroyTooltipNode = () => {
    if (tooltipNode !== undefined) {
      if (tooltipNode.parentNode !== undefined) {
        tooltipNode.parentNode.removeChild(tooltipNode);
      }
      tooltipNode = undefined;
    }
  };

  const debouncedShow = Debouncer.debounce(() => {
    createTooltipNode();
  }, debounce);

  const onMouseEnter = () => {
    hovered = true;
    debouncedShow();
  };

  const onMouseLeave = () => {
    hovered = false;
    if (!focused) {
      debouncedShow.clear();
      destroyTooltipNode();
    }
  };

  const onFocus = () => {
    focused = true;
    debouncedShow();
  };

  const onBlur = () => {
    focused = false;
    if (!hovered) {
      debouncedShow.clear();
      destroyTooltipNode();
    }
  };

  node.addEventListener("mouseenter", onMouseEnter);
  node.addEventListener("mouseleave", onMouseLeave);
  node.addEventListener("focus", onFocus);
  node.addEventListener("blur", onBlur);

  return {
    destroy() {
      node.removeEventListener("mouseenter", onMouseEnter);
      node.removeEventListener("mouseleave", onMouseLeave);
      node.removeEventListener("focus", onMouseEnter);
      node.removeEventListener("blur", onMouseLeave);
      destroyTooltipNode();
    },
  };
}
