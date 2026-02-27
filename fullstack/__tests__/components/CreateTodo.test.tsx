import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateTodo from "@/components/CreateTodo";

describe("CreateTodo", () => {
  const mockOnCreate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render input field", () => {
      render(<CreateTodo onCreateTodo={mockOnCreate} />);

      const input = screen.getByPlaceholderText(/add a new todo/i);
      expect(input).toBeInTheDocument();
    });

    it("should render submit button", () => {
      render(<CreateTodo onCreateTodo={mockOnCreate} />);

      const button = screen.getByRole("button", { name: /add/i });
      expect(button).toBeInTheDocument();
    });

    it("should have correct input attributes", () => {
      render(<CreateTodo onCreateTodo={mockOnCreate} />);

      const input = screen.getByPlaceholderText(/add a new todo/i);
      expect(input).toHaveAttribute("type", "text");
    });
  });

  describe("Form Layout", () => {
    it("should display input and button in flex row", () => {
      const { container } = render(
        <CreateTodo onCreateTodo={mockOnCreate} />
      );

      const formElement = container.querySelector(".flex");
      expect(formElement).toBeInTheDocument();
    });
  });

  describe("User Input", () => {
    it("should update input value as user types", async () => {
      const user = userEvent.setup();

      render(<CreateTodo onCreateTodo={mockOnCreate} />);

      const input = screen.getByPlaceholderText(/add a new todo/i) as HTMLInputElement;
      await user.type(input, "New todo task");

      expect(input.value).toBe("New todo task");
    });

    it("should call onCreateTodo with input value on form submit", async () => {
      const user = userEvent.setup();

      render(<CreateTodo onCreateTodo={mockOnCreate} />);

      const input = screen.getByPlaceholderText(/add a new todo/i);
      const button = screen.getByRole("button", { name: /add/i });

      await user.type(input, "Test todo");
      await user.click(button);

      expect(mockOnCreate).toHaveBeenCalledWith("Test todo");
    });

    it("should clear input after successful submission", async () => {
      const user = userEvent.setup();

      render(<CreateTodo onCreateTodo={mockOnCreate} />);

      const input = screen.getByPlaceholderText(/add a new todo/i) as HTMLInputElement;
      const button = screen.getByRole("button", { name: /add/i });

      await user.type(input, "Test todo");
      await user.click(button);

      expect(input.value).toBe("");
    });

    it("should trim whitespace from input", async () => {
      const user = userEvent.setup();

      render(<CreateTodo onCreateTodo={mockOnCreate} />);

      const input = screen.getByPlaceholderText(/add a new todo/i);
      const button = screen.getByRole("button", { name: /add/i });

      await user.type(input, "  Test todo  ");
      await user.click(button);

      expect(mockOnCreate).toHaveBeenCalledWith("Test todo");
    });
  });

  describe("Validation", () => {
    it("should not call onCreateTodo when input is empty", async () => {
      const user = userEvent.setup();

      render(<CreateTodo onCreateTodo={mockOnCreate} />);

      const button = screen.getByRole("button", { name: /add/i });
      await user.click(button);

      expect(mockOnCreate).not.toHaveBeenCalled();
    });

    it("should not call onCreateTodo when input is only whitespace", async () => {
      const user = userEvent.setup();

      render(<CreateTodo onCreateTodo={mockOnCreate} />);

      const input = screen.getByPlaceholderText(/add a new todo/i);
      const button = screen.getByRole("button", { name: /add/i });

      await user.type(input, "   ");
      await user.click(button);

      expect(mockOnCreate).not.toHaveBeenCalled();
    });

    it("should disable button while loading", () => {
      render(<CreateTodo onCreateTodo={mockOnCreate} isLoading={true} />);

      const button = screen.getByRole("button", { name: /add/i });
      expect(button).toBeDisabled();
    });

    it("should show loading spinner when loading", () => {
      render(<CreateTodo onCreateTodo={mockOnCreate} isLoading={true} />);

      const spinner = screen.getByRole("button").querySelector("svg");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle input with numbers and mixed case", async () => {
      const user = userEvent.setup();

      render(<CreateTodo onCreateTodo={mockOnCreate} />);

      const input = screen.getByPlaceholderText(/add a new todo/i);
      const button = screen.getByRole("button", { name: /add/i });

      await user.type(input, "Task123MixedCase");
      await user.click(button);

      expect(mockOnCreate).toHaveBeenCalledWith("Task123MixedCase");
    });

    it("should render loading state with Loader2 icon when isLoading is true", () => {
      render(<CreateTodo onCreateTodo={mockOnCreate} isLoading={true} />);

      const button = screen.getByRole("button", { name: /adding/i });
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    it("should allow form submission via button click", async () => {
      const user = userEvent.setup();

      render(<CreateTodo onCreateTodo={mockOnCreate} />);

      const input = screen.getByPlaceholderText(/add a new todo/i);
      const button = screen.getByRole("button", { name: /add/i });

      await user.type(input, "Test todo");
      await user.click(button);

      expect(mockOnCreate).toHaveBeenCalledWith("Test todo");
    });
  });

  describe("Multiple Submissions", () => {
    it("should allow multiple todo submissions with proper clearing", async () => {
      const user = userEvent.setup();

      render(<CreateTodo onCreateTodo={mockOnCreate} />);

      const input = screen.getByPlaceholderText(/add a new todo/i) as HTMLInputElement;
      const button = screen.getByRole("button", { name: /add/i });

      // First submission
      await user.type(input, "First todo");
      await user.click(button);
      expect(mockOnCreate).toHaveBeenCalledWith("First todo");
      // Input should be cleared
      expect(input.value).toBe("");

      // Second submission
      await user.type(input, "Second todo");
      await user.click(button);
      expect(mockOnCreate).toHaveBeenCalledWith("Second todo");

      expect(mockOnCreate).toHaveBeenCalledTimes(2);
    });
  });
});
