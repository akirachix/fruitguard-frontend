import { render, screen, fireEvent } from "@testing-library/react";
import AgrovetSidebar from ".";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("AgrovetSidebar", () => {
  const mockUsePathname = usePathname as jest.Mock;

  beforeEach(() => {
    mockUsePathname.mockReset();
  });

  test("renders sidebar with navigation items and logout button", () => {
    mockUsePathname.mockReturnValue("/farmer-registration");
    render(<AgrovetSidebar />);

    expect(screen.getByAltText("FruitGuard logo")).toBeInTheDocument();
    expect(screen.getByText("FruitGuard")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Profile" })).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  test("clicking navigation links changes active state", () => {
    mockUsePathname.mockReturnValue("/farmer-registration");
    const { rerender } = render(<AgrovetSidebar />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    const profileLink = screen.getByRole("link", { name: "Profile" });

    expect(homeLink).toHaveAttribute("aria-current", "page");
    expect(profileLink).not.toHaveAttribute("aria-current");

    mockUsePathname.mockReturnValue("/agrovet-profile");
    rerender(<AgrovetSidebar />);

    expect(profileLink).toHaveAttribute("aria-current", "page");
    expect(homeLink).not.toHaveAttribute("aria-current");
  });

  test("clicking logout shows confirmation modal", () => {
    mockUsePathname.mockReturnValue("/farmer-registration");
    render(<AgrovetSidebar />);

    expect(screen.queryByText("Do you want to logout?")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Log out"));
    expect(screen.getByText("Do you want to logout?")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Proceed")).toBeInTheDocument();
  });

  test("clicking cancel hides the logout confirmation modal", () => {
    mockUsePathname.mockReturnValue("/farmer-registration");
    render(<AgrovetSidebar />);

    fireEvent.click(screen.getByText("Log out"));
    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByText("Do you want to logout?")).not.toBeInTheDocument();
  });

  test("proceed button links to /Login", () => {
    mockUsePathname.mockReturnValue("/farmer-registration");
    render(<AgrovetSidebar />);

    fireEvent.click(screen.getByText("Log out"));

    const proceedLink = screen.getByRole("link", { name: "Proceed" });
    expect(proceedLink).toHaveAttribute("href", "/Login");
  });
});