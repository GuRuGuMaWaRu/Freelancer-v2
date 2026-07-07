import type { IEarningsByClient } from "shared/types";

const DEFAULT_LABEL_WIDTH = 80;

const getMaxLabelLength = (data: IEarningsByClient[]): number => {
  if (data.length === 0) {
    return DEFAULT_LABEL_WIDTH;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  context.font = "16px outfit";

  const clientNamesWidth = data.map((item) =>
    Math.ceil(context.measureText(item.client).width),
  );

  return Math.max(DEFAULT_LABEL_WIDTH, ...clientNamesWidth);
};

export { getMaxLabelLength };
