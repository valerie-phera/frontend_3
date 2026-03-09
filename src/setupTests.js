import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// JSDOM doesn't implement canvas APIs by default.
// We only need a tiny subset for ResultsPage gradient sampling.
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  configurable: true,
  value: () => {
    return {
      createLinearGradient: () => ({
        addColorStop: () => {},
      }),
      fillStyle: "",
      fillRect: () => {},
      getImageData: () => ({ data: new Uint8ClampedArray([0, 0, 0, 255]) }),
    };
  },
});

afterEach(() => {
  cleanup();
});

