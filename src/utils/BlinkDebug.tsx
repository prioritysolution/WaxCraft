"use client";

// TEMPORARY diagnostics for the popup/page blink issue. Remove after fix.
import { useEffect } from "react";

const TAG = "[BLINK]";

const describe = (el: Element | null | undefined): string => {
  if (!el || !(el instanceof HTMLElement)) return String(el?.nodeName ?? "null");
  const slot = el.getAttribute("data-slot");
  const role = el.getAttribute("role");
  const placement = el.getAttribute("data-placement");
  const cls = (el.className && typeof el.className === "string"
    ? el.className
    : ""
  )
    .split(" ")
    .slice(0, 4)
    .join(".");
  return `${el.tagName.toLowerCase()}${slot ? `[slot=${slot}]` : ""}${role ? `[role=${role}]` : ""}${placement ? `[placement=${placement}]` : ""}${cls ? `.${cls}` : ""}`;
};

const snapshot = () => {
  const html = document.documentElement;
  const body = document.body;
  const popovers = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[role="listbox"], [role="menu"], [data-slot="content"]',
    ),
  )
    .map((el) => el.closest<HTMLElement>("[data-placement]") ?? el)
    .filter((el, i, arr) => arr.indexOf(el) === i)
    .map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return `${el.getAttribute("data-placement") ?? "-"}@${Math.round(r.top)},${Math.round(r.left)} ${Math.round(r.width)}x${Math.round(r.height)} op=${Number(cs.opacity).toFixed(2)} tf=${cs.transform === "none" ? "none" : "set"}`;
    });
  const backdrops = Array.from(
    document.querySelectorAll<HTMLElement>('[class*="backdrop-blur"]'),
  ).map((el) => {
    const cs = getComputedStyle(el);
    return `${describe(el).slice(0, 40)} op=${Number(cs.opacity).toFixed(2)}`;
  });
  const content = document.querySelector<HTMLElement>("main > div.flex.h-full");
  const contentRect = content?.getBoundingClientRect();
  return {
    vpScrollbar: window.innerWidth - html.clientWidth,
    bodyScrollbar: body.offsetWidth - body.clientWidth,
    htmlStyle: html.getAttribute("style") || "",
    bodyStyle: body.getAttribute("style") || "",
    htmlScrollH: html.scrollHeight,
    innerH: window.innerHeight,
    contentX: contentRect ? Math.round(contentRect.left) : null,
    contentW: contentRect ? Math.round(contentRect.width) : null,
    popovers: popovers.join(" | "),
    backdrops: backdrops.join(" | "),
    active: describe(document.activeElement),
  };
};

export default function BlinkDebug() {
  useEffect(() => {
    let last = "";
    let frames = 0;
    let rafId = 0;
    const t0 = performance.now();

    const log = (reason: string) => {
      const snap = snapshot();
      const key = JSON.stringify(snap);
      if (key === last && reason === "frame") return;
      last = key;
      console.warn(
        `${TAG} +${Math.round(performance.now() - t0)}ms ${reason} ${key}`,
      );
    };

    const trackFrames = (count: number) => {
      frames = Math.max(frames, count);
      if (rafId) return;
      const tick = () => {
        log("frame");
        frames -= 1;
        rafId = frames > 0 ? requestAnimationFrame(tick) : 0;
      };
      rafId = requestAnimationFrame(tick);
    };

    const bodyObserver = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((n) =>
          log(`body+ ${describe(n as Element)}`),
        );
        m.removedNodes.forEach((n) =>
          log(`body- ${describe(n as Element)}`),
        );
      });
      trackFrames(45);
    });
    bodyObserver.observe(document.body, { childList: true });

    const portalObserver = new MutationObserver((mutations) => {
      let relevant = false;
      mutations.forEach((m) => {
        m.addedNodes.forEach((n) => {
          if (
            n instanceof HTMLElement &&
            (n.matches('[role="listbox"], [role="menu"], [data-placement], [role="dialog"]') ||
              n.querySelector('[role="listbox"], [role="menu"], [role="dialog"]'))
          ) {
            relevant = true;
            log(`mount ${describe(n)}`);
          }
        });
        m.removedNodes.forEach((n) => {
          if (
            n instanceof HTMLElement &&
            (n.matches('[role="listbox"], [role="menu"], [data-placement], [role="dialog"]') ||
              n.querySelector('[role="listbox"], [role="menu"], [role="dialog"]'))
          ) {
            relevant = true;
            log(`unmount ${describe(n)}`);
          }
        });
      });
      if (relevant) trackFrames(45);
    });
    portalObserver.observe(document.body, { childList: true, subtree: true });

    const styleObserver = new MutationObserver((mutations) => {
      mutations.forEach((m) =>
        log(`attr ${describe(m.target as Element)} ${m.attributeName}`),
      );
      trackFrames(30);
    });
    styleObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });
    styleObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    const onPointerDown = (e: PointerEvent) => {
      log(`pointerdown ${describe(e.target as Element)}`);
      trackFrames(45);
    };
    document.addEventListener("pointerdown", onPointerDown, true);

    const onScroll = (e: Event) => {
      const target = e.target as Element | Document;
      if (target === document) return log("scroll document");
      log(`scroll ${describe(target as Element)}`);
    };
    document.addEventListener("scroll", onScroll, true);

    console.warn(`${TAG} diagnostics active`);

    return () => {
      bodyObserver.disconnect();
      portalObserver.disconnect();
      styleObserver.disconnect();
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("scroll", onScroll, true);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
