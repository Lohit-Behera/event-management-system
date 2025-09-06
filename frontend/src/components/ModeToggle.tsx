"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { flushSync } from "react-dom";

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const ref = React.useRef<HTMLButtonElement>(null);
  const handleClick = async () => {
    if (
      !ref.current ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      console.warn("View Transitions API not supported in this browser");
      setTheme(theme === "dark" || resolvedTheme === "dark" ? "light" : "dark");
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(
          theme === "dark" || resolvedTheme === "dark" ? "light" : "dark"
        );
      });
    }).ready;

    const { top, left, width, height } = ref.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRadius = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };
  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      onClick={() => handleClick()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4.5"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 3l0 18" />
        <path d="M12 9l4.65 -4.65" />
        <path d="M12 14.3l7.37 -7.37" />
        <path d="M12 19.6l8.85 -8.85" />
      </svg>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
