import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "@/components/Navbar";

// Mock next-auth/react
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display app title", () => {
    (useSession as any).mockReturnValue({ data: null });

    render(<Navbar />);

    expect(screen.getByText("Todo App")).toBeInTheDocument();
  });

  it("should show user email when authenticated", () => {
    (useSession as any).mockReturnValue({
      data: {
        user: {
          email: "test@example.com",
          name: "Test User",
        },
      },
    });

    render(<Navbar />);

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("should not show user email when not authenticated", () => {
    (useSession as any).mockReturnValue({ data: null });

    render(<Navbar />);

    expect(screen.queryByText("test@example.com")).not.toBeInTheDocument();
  });

  it("should have sign out button when authenticated", () => {
    (useSession as any).mockReturnValue({
      data: {
        user: {
          email: "test@example.com",
        },
      },
    });

    render(<Navbar />);

    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });

  it("should not have sign out button when not authenticated", () => {
    (useSession as any).mockReturnValue({ data: null });

    render(<Navbar />);

    expect(screen.queryByRole("button", { name: /sign out/i })).not.toBeInTheDocument();
  });

  it("should call signOut on sign out button click", async () => {
    const mockSignOut = vi.fn();

    (useSession as any).mockReturnValue({
      data: {
        user: {
          email: "test@example.com",
        },
      },
    });
    (signOut as any).mockImplementation(mockSignOut);
    (useRouter as any).mockReturnValue({
      push: vi.fn(),
    });

    const user = userEvent.setup();

    render(<Navbar />);

    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    await user.click(signOutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
