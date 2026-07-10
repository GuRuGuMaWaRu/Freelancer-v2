import {
  render as rtlRender,
  screen,
  waitForElementToBeRemoved,
  RenderOptions
} from "@testing-library/react";
import React from "react";
import { AppProviders } from "app";

async function render(
  ui: React.ReactElement,
  renderOptions: RenderOptions = {}
) {
  const returnValue = {
    ...rtlRender(ui, {
      wrapper: AppProviders,
      ...renderOptions
    })
  };

  await waitForLoadingToFinish();

  return returnValue;
}

const waitForLoadingToFinish = async () => {
  const getLoading = () => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i)
  ];

  const loadingElements = getLoading();

  if (loadingElements.length > 0) {
    await waitForElementToBeRemoved(getLoading, { timeout: 4000 });
  }
};

/**
 * Converts a CSS color constant to the format the browser assigns to
 * element.style (e.g. hex becomes "rgb(r, g, b)").
 * Use when asserting on document.body.style.backgroundColor or similar.
 */
export function toBrowserRgb(cssColor: string): string {
  const hexMatch = cssColor.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);

  if (hexMatch) {
    let hex = hexMatch[1];

    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    return `rgb(${r}, ${g}, ${b})`;
  }

  const rgbMatch =
    cssColor.match(/^rgb\s*\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\)$/) ||
    cssColor.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);

  if (rgbMatch) {
    return `rgb(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]})`;
  }

  return cssColor;
}

export * from "@testing-library/react";
export { render, waitForLoadingToFinish };
