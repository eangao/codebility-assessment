import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignInPage from "@/app/auth/signin/page";

// Mock next-auth/react
vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

// Mock the auth module
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}));

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

describe("Sign In Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: vi.fn() });
    (useSearchParams as any).mockReturnValue(new URLSearchParams());
  });

  it("should render the sign in form", () => {
    render(<SignInPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeInTheDocument();
  });

  it("should have link to sign up page", () => {
    render(<SignInPage />);

    const signUpLink = screen.getByRole("link", { name: /sign up/i });
    expect(signUpLink.getAttribute("href")).toBe("/auth/signup");
  });

  it("should submit sign in form with valid credentials", async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ ok: true });
    (signIn as any).mockImplementation(mockSignIn);

    const user = userEvent.setup();

    render(<SignInPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /^sign in$/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password123",
        redirect: false,
      });
    });
  });

  it("should handle failed sign in", async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ ok: false, error: "Invalid credentials" });
    (signIn as any).mockImplementation(mockSignIn);

    const user = userEvent.setup();

    render(<SignInPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /^sign in$/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    // Verify form is still visible (error handling occurred)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
});
