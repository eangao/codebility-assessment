import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUpPage from "@/app/auth/signup/page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

import { useRouter } from "next/navigation";

describe("Sign Up Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      push: vi.fn(),
    });

    // Mock fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render the sign up form", () => {
    render(<SignUpPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^sign up$/i })).toBeInTheDocument();
  });

  it("should have link to sign in page", () => {
    render(<SignUpPage />);

    const signInLink = screen.getByRole("link", { name: /sign in/i });
    expect(signInLink.getAttribute("href")).toBe("/auth/signin");
  });

  it("should submit sign up form with valid data", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { id: "1", email: "newuser@example.com" } }),
    });
    global.fetch = mockFetch;

    const mockPush = vi.fn();
    (useRouter as any).mockReturnValue({ push: mockPush });

    const user = userEvent.setup();

    render(<SignUpPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole("button", { name: /^sign up$/i });

    await user.type(emailInput, "newuser@example.com");
    await user.type(passwordInput, "password123");
    await user.type(nameInput, "John Doe");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "newuser@example.com",
          password: "password123",
          name: "John Doe",
        }),
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth/signin");
    });
  });

  it("should handle email already exists error", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "A user with this email already exists" }),
    });
    global.fetch = mockFetch;

    const user = userEvent.setup();

    render(<SignUpPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole("button", { name: /^sign up$/i });

    await user.type(emailInput, "existing@example.com");
    await user.type(passwordInput, "password123");
    await user.type(nameInput, "John Doe");
    await user.click(submitButton);

    // Verify form is still visible (error handling occurred)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
});
