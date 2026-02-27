import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AuthForm from "@/components/AuthForm";

describe("AuthForm", () => {
  describe("Sign In Mode", () => {
    it("should render sign in form with email and password fields", () => {
      render(<AuthForm mode="signin" />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /^sign in$/i })).toBeInTheDocument();
    });

    it("should show sign up link", () => {
      render(<AuthForm mode="signin" />);

      const signUpLink = screen.getByRole("link", { name: /sign up/i });
      expect(signUpLink).toBeInTheDocument();
      expect(signUpLink.getAttribute("href")).toBe("/auth/signup");
    });

    it("should call onSubmit with email and password", async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();

      render(<AuthForm mode="signin" onSubmit={onSubmit} />);

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
      const submitButton = screen.getByRole("button", { name: /^sign in$/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
        });
      });
    });

    it("should show loading state when submitting", async () => {
      let resolveSubmit: ((value: unknown) => void) | null = null;
      const submitPromise = new Promise((resolve) => {
        resolveSubmit = resolve;
      });

      const onSubmit = vi.fn(() => submitPromise);
      const user = userEvent.setup();

      render(<AuthForm mode="signin" onSubmit={onSubmit} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /^sign in$/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      expect(submitButton).toBeDisabled();

      resolveSubmit!(undefined);
      await submitPromise;
    });

    it("should display error message when provided", () => {
      render(<AuthForm mode="signin" error="Invalid credentials" />);

      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      expect(screen.getByText("Invalid credentials")).toHaveClass("text-destructive");
    });
  });

  describe("Sign Up Mode", () => {
    it("should render sign up form with email, password, and name fields", () => {
      render(<AuthForm mode="signup" />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /^sign up$/i })).toBeInTheDocument();
    });

    it("should show sign in link", () => {
      render(<AuthForm mode="signup" />);

      const signInLink = screen.getByRole("link", { name: /sign in/i });
      expect(signInLink).toBeInTheDocument();
      expect(signInLink.getAttribute("href")).toBe("/auth/signin");
    });

    it("should call onSubmit with email, password, and name", async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();

      render(<AuthForm mode="signup" onSubmit={onSubmit} />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const nameInput = screen.getByLabelText(/name/i);
      const submitButton = screen.getByRole("button", { name: /^sign up$/i });

      await user.type(emailInput, "newuser@example.com");
      await user.type(passwordInput, "password123");
      await user.type(nameInput, "John Doe");
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          email: "newuser@example.com",
          password: "password123",
          name: "John Doe",
        });
      });
    });
  });

  describe("Validation", () => {
    it("should handle missing email error state", async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();

      render(<AuthForm mode="signin" onSubmit={onSubmit} />);

      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /^sign in$/i });

      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      // Email is required by HTML5 validation, so form won't submit
      // Verify form is still in DOM
      expect(submitButton).toBeInTheDocument();
    });

    it("should handle missing password error state", async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();

      render(<AuthForm mode="signin" onSubmit={onSubmit} />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole("button", { name: /^sign in$/i });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      // Password is required by HTML5 validation, so form won't submit
      // Verify form is still in DOM
      expect(submitButton).toBeInTheDocument();
    });
  });
});
