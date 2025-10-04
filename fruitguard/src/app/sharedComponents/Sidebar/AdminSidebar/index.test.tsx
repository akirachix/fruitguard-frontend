import { render, screen, fireEvent } from "@testing-library/react";
import AdminSidebar from ".";

describe("AdminSidebar", () => {
  test("renders sidebar with nav items and logout button", () => {
    render(<AdminSidebar />);

    expect(screen.getByAltText("FruitGuard logo")).toBeInTheDocument();
    expect(screen.getByText("FruitGuard")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Manage Team")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });


  test("clicking logout shows confirmation modal", () => {
    render(<AdminSidebar />);
    expect(screen.queryByText("Do you want to logout?")).toBeNull();
    fireEvent.click(screen.getByText("Log out"));

  
    expect(screen.getByText("Do you want to logout?")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Proceed")).toBeInTheDocument();
  });

  test("clicking cancel hides the confirmation modal", () => {
    render(<AdminSidebar />);
    fireEvent.click(screen.getByText("Log out"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Do you want to logout?")).toBeNull();
  });

  test("proceed button links to /login", () => {
    render(<AdminSidebar />);
    fireEvent.click(screen.getByText("Log out"));

    const proceedLink = screen.getByRole("link", { name: "Proceed" });
    expect(proceedLink).toHaveAttribute("href", "/login");
  });
});
