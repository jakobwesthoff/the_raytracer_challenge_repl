import { Debouncer } from "../lib/Debouncer";
import {
  computePosition,
  offset,
  shift,
  type Placement,
} from "@floating-ui/dom";
import { TOKENS_PLACEMENT } from "@kahi-ui/framework";

export type { Placement } from "@floating-ui/dom";

export type TooltipOptions =
  | string
  | {
      title: string;
      debounce?: number;
      placement?: Placement;
      withFocus?: boolean;
      size?: string;
    };

export function tooltip(node: HTMLElement, options: TooltipOptions) {
  let debounce = 250;
  let title = "";
  let placement: Placement = "bottom";
  let withFocus = true;
  let size = "inherit";

  if (typeof options === "string") {
    title = options;
  } else {
    title = options.title;
    if (options.debounce !== undefined) {
      debounce = options.debounce;
    }
    if (options.placement !== undefined) {
      placement = options.placement;
    }
    if (options.withFocus !== undefined) {
      withFocus = options.withFocus;
    }
    if (options.size !== undefined) {
      size = options.size;
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
      fontSize: size,
    });

    document.body.appendChild(tooltipNode);

    computePosition(node, tooltipNode, {
      middleware: [offset(12), shift()],
      placement,
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
  if (withFocus) {
    node.addEventListener("focus", onFocus);
    node.addEventListener("blur", onBlur);
  }

  return {
    destroy() {
      node.removeEventListener("mouseenter", onMouseEnter);
      node.removeEventListener("mouseleave", onMouseLeave);
      if (withFocus) {
        node.removeEventListener("focus", onMouseEnter);
        node.removeEventListener("blur", onMouseLeave);
      }
      destroyTooltipNode();
    },
  };
}
