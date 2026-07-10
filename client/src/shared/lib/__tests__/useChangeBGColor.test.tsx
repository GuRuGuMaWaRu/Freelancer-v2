import { render } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import { type Mock, vi } from "vitest";

import { toBrowserRgb } from "test/test-helpers";
import { useChangeBGColor } from "../hooks/useChangeBGColor";
import { colors } from "../../const";

vi.mock("react-router-dom", () => ({
  useLocation: vi.fn(),
}));

describe("useChangeBGColor", () => {
  const mockUseLocation = useLocation as Mock;
  const testPathname = "/projects";

  beforeEach(() => {
    document.body.style.backgroundColor = "";
    mockUseLocation.mockReturnValue({ pathname: testPathname });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should update the body background color when the pathname changes", () => {
    render(<TestComponent />);

    expect(document.body.style.backgroundColor).toBe(
      toBrowserRgb(colors.projectsPageBg),
    );
  });
});

function TestComponent() {
  useChangeBGColor();
  return null;
}
