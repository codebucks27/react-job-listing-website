import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let reportWebVitals;
let metrics;
let loadWebVitals;

beforeEach(async () => {
  vi.resetModules();
  metrics = {
    onCLS: vi.fn(),
    onINP: vi.fn(),
    onFCP: vi.fn(),
    onLCP: vi.fn(),
    onTTFB: vi.fn(),
  };
  loadWebVitals = vi.fn(() => metrics);
  vi.doMock("web-vitals", loadWebVitals);
  ({ default: reportWebVitals } = await import("./reportWebVitals.js"));
});

afterEach(() => {
  vi.doUnmock("web-vitals");
});

describe("reportWebVitals", () => {
  it("registers the provided callback for all five supported metrics", async () => {
    const callback = vi.fn();

    reportWebVitals(callback);
    await vi.dynamicImportSettled();

    expect(loadWebVitals).toHaveBeenCalledTimes(1);
    for (const registerMetric of Object.values(metrics)) {
      expect(registerMetric).toHaveBeenCalledTimes(1);
      expect(registerMetric).toHaveBeenCalledWith(callback);
    }
  });

  it("does not load or register metrics without a function", async () => {
    for (const callback of [undefined, null, false, 42, "callback", {}]) {
      reportWebVitals(callback);
    }
    await vi.dynamicImportSettled();

    expect(loadWebVitals).not.toHaveBeenCalled();
    for (const registerMetric of Object.values(metrics)) {
      expect(registerMetric).not.toHaveBeenCalled();
    }
  });
});
