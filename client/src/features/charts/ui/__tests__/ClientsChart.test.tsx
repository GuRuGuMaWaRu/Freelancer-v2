import { render, screen } from "@testing-library/react";
import ResizeObserverPolyfill from "resize-observer-polyfill";
import { type Mock, vi } from "vitest";

import { MemoClientsChart } from "features/charts";
import { getMaxLabelLength } from "features/charts/lib";

global.ResizeObserver = ResizeObserverPolyfill;

vi.mock("features/charts/lib");

describe("Clients chart", () => {
  const mockGetMaxLabelLength = getMaxLabelLength as Mock;

  const fakeData = [
    { client: "Client 1", payment: 10000, projects: 10 },
    { client: "Client 2", payment: 12000, projects: 12 },
    { client: "Client 3", payment: 13000, projects: 13 },
  ];

  beforeEach(() => {
    mockGetMaxLabelLength.mockReturnValue(100);
  });

  it("should render", async () => {
    render(<MemoClientsChart data={fakeData} />);
  });

  it("should render empty state without chart when there is no data", () => {
    render(<MemoClientsChart data={[]} />);

    expect(screen.getByText("No client earnings in this range")).toBeTruthy();
  });
});
