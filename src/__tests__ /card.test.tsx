import { render, screen } from "@testing-library/react";
import { Card } from "../components/card";

describe("Card Component", () => {
  const row = ["John Doe", "New York", "USA", "Basketball"];

  it("renders the card with correct values", () => {
    render(<Card row={row} />);

    expect(screen.getByText(`Name: ${row[0]}`)).toBeInTheDocument();
    expect(screen.getByText(`City: ${row[1]}`)).toBeInTheDocument();
    expect(screen.getByText(`Country: ${row[2]}`)).toBeInTheDocument();
    expect(screen.getByText(`Favorite sport: ${row[3]}`)).toBeInTheDocument();
  });

  it("displays the correct text colors", () => {
    render(<Card row={row} />);

    expect(screen.getByText(`Name: ${row[0]}`)).toHaveStyle(
      "color: rgba(0, 0, 0, 0.87)"
    );
    expect(screen.getByText(`City: ${row[1]}`)).toHaveStyle(
      "color: rgba(0, 0, 0, 0.6)"
    );
    expect(screen.getByText(`Country: ${row[2]}`)).toHaveStyle(
      "color: rgba(0, 0, 0, 0.87)"
    );
    expect(screen.getByText(`Favorite sport: ${row[3]}`)).toHaveStyle(
      "color: rgba(0, 0, 0, 0.6)"
    );
  });
});
