import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ResultsPage from "./ResultsPage";

const mockNavigate = vi.fn();
const mockAddResults = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../context/HistoryContext", () => ({
  useHistory: () => ({
    addResults: mockAddResults,
  }),
}));

function renderWithState(state) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/results", state }]}>
      <ResultsPage />
    </MemoryRouter>
  );
}

describe("ResultsPage", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders 0 tests scanned when no selectedTests in location.state", () => {
    renderWithState(undefined);

    expect(screen.getByRole("heading", { name: /results/i })).toBeInTheDocument();
    expect(screen.getByText(/0\s+test(s)?\s+scanned/i)).toBeInTheDocument();
  });

  it("renders one result for selected test and uses deterministic random values", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    renderWithState({ selectedTests: ["S"] });

    // generated in effect; wait for content that depends on results
    expect((await screen.findAllByText("Test S")).length).toBeGreaterThan(0);
    expect(screen.getByText(/1\s+test(s)?\s+scanned/i)).toBeInTheDocument();
    expect(screen.getByText("3.5")).toBeInTheDocument();
    expect(screen.getByText("Strongly Acidic")).toBeInTheDocument();
    expect(screen.getByText(/confidence:/i)).toBeInTheDocument();
    expect(screen.getByText("70")).toBeInTheDocument();
  });

  it("navigates to scan and history from buttons", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    renderWithState({ selectedTests: ["S"] });

    expect((await screen.findAllByText("Test S")).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /scan again/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/scan");

    fireEvent.click(screen.getByRole("button", { name: /view history/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/history");
  });
});

