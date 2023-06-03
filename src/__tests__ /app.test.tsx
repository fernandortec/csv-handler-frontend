import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { App } from "../App";
import { apiClient } from "../services/api";

describe("App Component", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("inserts file successfully", async () => {
    const mockPost = jest
      .spyOn(apiClient, "post")
      .mockResolvedValue({ status: 200 });

    const mockGet = jest.spyOn(apiClient, "get").mockResolvedValue({
      data: [["John Doe", "New York", "USA", "Basketball"]],
    });

    render(<App />);
    const fileInput = screen.getByLabelText("INSERT FILE");

    fireEvent.change(fileInput, {
      target: { files: [new File([], "test.csv")] },
    });

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledTimes(1);
    });
  });

  it("filters data by columns", async () => {
    jest.spyOn(apiClient, "post").mockResolvedValue({ status: 200 });
    const mockGet = jest.spyOn(apiClient, "get").mockResolvedValue({
      data: [["John Doe", "New York", "USA", "Basketball"]],
    });

    render(<App />);
    const fileInput = screen.getByLabelText("INSERT FILE");

    fireEvent.change(fileInput, {
      target: { files: [new File([], "test.csv")] },
    });

    await waitFor(() => {
      const filterInput = screen.getByPlaceholderText(
        "Filter the data by columns"
      );

      expect(filterInput).toBeInTheDocument();
    });

    const filterInput = screen.getByPlaceholderText(
      "Filter the data by columns"
    );

    fireEvent.change(filterInput, { target: { value: "New York" } });
    fireEvent.keyDown(filterInput, { key: "Enter" });

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith("/api/users", {
        params: { name: "New York" },
      });
    });

    await waitFor(() => {
      expect(screen.getByText("City: New York")).toBeInTheDocument();
    });
  });

  it("reads data successfully", async () => {
    jest.spyOn(apiClient, "post").mockResolvedValue({ status: 200 });

    const mockGet = jest.spyOn(apiClient, "get").mockResolvedValue({
      data: [["John Doe", "New York", "USA", "Basketball"]],
    });

    render(<App />);
    const fileInput = screen.getByLabelText("INSERT FILE");

    fireEvent.change(fileInput, {
      target: { files: [new File([], "test.csv")] },
    });

    await waitFor(() => {
      const textField = screen.getByPlaceholderText(
        "Filter the data by columns"
      );

      expect(textField).toBeInTheDocument();
    });

    expect(mockGet).toBeCalled();
  });

  it("should load text field and cards", async () => {
    jest.spyOn(apiClient, "post").mockResolvedValue({ status: 200 });
    jest.spyOn(apiClient, "get").mockResolvedValue({
      data: [["John Doe", "New York", "USA", "Basketball"]],
    });

    render(<App />);
    const fileInput = screen.getByLabelText("INSERT FILE");

    fireEvent.change(fileInput, {
      target: { files: [new File([], "test.csv")] },
    });

    await waitFor(() => {
      const textField = screen.getByPlaceholderText(
        "Filter the data by columns"
      );

      expect(textField).toBeInTheDocument();
    });

    const cardHeader = screen.getByText("Name: John Doe");
    expect(cardHeader).toBeInTheDocument();
  });
});
