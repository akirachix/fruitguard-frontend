import React from "react";
import { render, screen, fireEvent } from "@testing-library/react"; 
import HomePage from "./page";

jest.mock("react-icons/fi", () => ({
  FiSearch: () => <span data-testid="search-icon" />,
}));

jest.mock("../hooks/useFetchAgrovets", () => ({
  useFetchAgrovets: jest.fn(),
}));
jest.mock("../hooks/useFetchDevices", () => ({
  useFetchDevices: jest.fn(),
}));

import * as useFetchAgrovetsModule from "../hooks/useFetchAgrovets";
import * as useFetchDevicesModule from "../hooks/useFetchDevices";

const mockAgrovets = [
  { id: 1, name: "Mary Agrovet", location: "Nairobi", phone: "12345" },
  { id: 2, name: "John Farms", location: "Eldoret", phone: "67890" },
  { id: 3, name: "Agrovet Pro", location: "Kisumu", phone: "11111" },
  { id: 4, name: "Janes Agro Supplies", location: "Mombasa", phone: "55555" },
  { id: 5, name: "Green Agrovet", location: "Thika", phone: "22222" },
  { id: 6, name: "Farmers Hub", location: "Meru", phone: "33333" },
  { id: 7, name: "Quality Agrovets", location: "Kitale", phone: "44444" },
  { id: 8, name: "Agro Plus", location: "Machakos", phone: "55555" },
];

const defaultAgrovetsProps = {
  agrovets: mockAgrovets,
  agrovetsCount: mockAgrovets.length,
  loading: false,
  error: null,
};

const defaultDevicesProps = {
  trapsCount: 15,
  loading: false,
  error: null,
};

beforeEach(() => {
  jest.clearAllMocks();
});

function setupAgrovetHook(props = {}) {
  (useFetchAgrovetsModule.useFetchAgrovets as jest.Mock).mockReturnValue({
    ...defaultAgrovetsProps,
    ...props,
  });
}

function setupDevicesHook(props = {}) {
  (useFetchDevicesModule.useFetchDevices as jest.Mock).mockReturnValue({
    ...defaultDevicesProps,
    ...props,
  });
}

describe("HomePage", () => {
  it("renders stats cards correctly", () => {
    setupAgrovetHook();
    setupDevicesHook();

    render(<HomePage />);
    expect(screen.getByText("Total traps")).toBeInTheDocument();
    expect(screen.getByText(defaultDevicesProps.trapsCount)).toBeInTheDocument();
    expect(screen.getByText("Number of agrovets")).toBeInTheDocument();
    expect(screen.getByText(defaultAgrovetsProps.agrovetsCount)).toBeInTheDocument();
  });

  it("table headers render correctly", () => {
    setupAgrovetHook();
    setupDevicesHook();

    render(<HomePage />);
    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("Phone No")).toBeInTheDocument();
  });

  it("renders agrovet table with data (first page)", () => {
    setupAgrovetHook();
    setupDevicesHook();

    render(<HomePage />);

    mockAgrovets.slice(0, 6).forEach((agrovet) => {
      expect(screen.getByText(agrovet.name)).toBeInTheDocument();
      expect(screen.getByText(agrovet.location)).toBeInTheDocument();
      expect(screen.getByText(agrovet.phone)).toBeInTheDocument();
      expect(screen.getByText(agrovet.id)).toBeInTheDocument();
    });

    expect(screen.queryByText("Quality Agrovets")).not.toBeInTheDocument();
    expect(screen.queryByText("Agro Plus")).not.toBeInTheDocument();
  });

  it("pagination works next/previous", () => {
    setupAgrovetHook();
    setupDevicesHook();

    render(<HomePage />);

    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Quality Agrovets")).toBeInTheDocument();
    expect(screen.getByText("Agro Plus")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Previous"));
    expect(screen.queryByText("Quality Agrovets")).not.toBeInTheDocument();
    expect(screen.queryByText("Agro Plus")).not.toBeInTheDocument();

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
  });

  it("previous button is disabled on first page, next disabled on last", () => {
    setupAgrovetHook();
    setupDevicesHook();

    render(<HomePage />);
    const prevBtn = screen.getByText("Previous") as HTMLButtonElement;
    const nextBtn = screen.getByText("Next") as HTMLButtonElement;
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    fireEvent.click(nextBtn);
    expect(nextBtn).toBeDisabled();
    expect(prevBtn).not.toBeDisabled();
  });

  it("search filters agrovet managers by name (case-insensitive)", () => {
    setupAgrovetHook();
    setupDevicesHook();

    render(<HomePage />);
    const input = screen.getByPlaceholderText("Search by name");
    fireEvent.change(input, { target: { value: "mary" } });
    expect(screen.getByText("Mary Agrovet")).toBeInTheDocument();

    mockAgrovets
      .filter((a) => a.name !== "Mary Agrovet")
      .forEach((agrovet) => {
        expect(screen.queryByText(agrovet.name)).not.toBeInTheDocument();
      });

    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  });

  it("shows message if search yields no results", () => {
    setupAgrovetHook();
    setupDevicesHook();

    render(<HomePage />);
    const input = screen.getByPlaceholderText("Search by name");
    fireEvent.change(input, { target: { value: "notfound" } });
    expect(screen.getByText(/No agrovet manager found with that name/)).toBeInTheDocument();
  });
});