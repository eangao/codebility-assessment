import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoItem from "@/components/TodoItem";

describe("TodoItem", () => {
  const mockTodo = {
    id: "1",
    title: "Test Todo",
    completed: false,
    createdAt: new Date("2025-02-20"),
    userId: "user-1",
  };

  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render todo title", () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText("Test Todo")).toBeInTheDocument();
    });

    it("should render creation date in small text", () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText(/Feb 20, 2025/)).toBeInTheDocument();
    });

    it("should render checkbox", () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it("should render 'Pending' badge when incomplete", () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText("Pending")).toBeInTheDocument();
    });

    it("should render 'Completed' badge when completed", () => {
      const completedTodo = { ...mockTodo, completed: true };

      render(
        <TodoItem
          todo={completedTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText("Completed")).toBeInTheDocument();
    });

    it("should render delete button with Trash2 icon", () => {
      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("should apply strikethrough to title when completed", () => {
      const completedTodo = { ...mockTodo, completed: true };

      const { container } = render(
        <TodoItem
          todo={completedTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );

      const titleElement = container.querySelector(".line-through");
      expect(titleElement).toBeInTheDocument();
    });

    it("should not apply strikethrough to title when not completed", () => {
      const { container } = render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );

      const titleElement = container.querySelector(".line-through");
      expect(titleElement).not.toBeInTheDocument();
    });

    it("should apply muted text style when completed", () => {
      const completedTodo = { ...mockTodo, completed: true };

      const { container } = render(
        <TodoItem
          todo={completedTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );

      const titleElement = screen.getByText("Test Todo");
      expect(titleElement.className).toContain("text-muted-foreground");
    });

    it("should not apply muted text style when not completed", () => {
      const { container } = render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );

      const titleElement = screen.getByText("Test Todo");
      expect(titleElement.className).not.toContain("text-muted-foreground");
    });
  });

  describe("Interactions", () => {
    it("should call onToggle with todo id when checkbox is clicked", async () => {
      const user = userEvent.setup();

      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);

      expect(mockOnToggle).toHaveBeenCalledWith("1");
    });

    it("should call onDelete with todo id when delete button is clicked", async () => {
      const user = userEvent.setup();

      render(
        <TodoItem
          todo={mockTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith("1");
    });

    it("should check checkbox when todo is completed", () => {
      const completedTodo = { ...mockTodo, completed: true };

      render(
        <TodoItem
          todo={completedTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long todo titles", () => {
      const longTodo = {
        ...mockTodo,
        title: "A".repeat(200),
      };

      render(
        <TodoItem
          todo={longTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText("A".repeat(200))).toBeInTheDocument();
    });

    it("should handle special characters in title", () => {
      const specialTodo = {
        ...mockTodo,
        title: "Test & <Todo> with 'quotes' and \"double quotes\"",
      };

      render(
        <TodoItem
          todo={specialTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );

      expect(
        screen.getByText(
          "Test & <Todo> with 'quotes' and \"double quotes\""
        )
      ).toBeInTheDocument();
    });

    it("should handle different date formats correctly", () => {
      const recentTodo = {
        ...mockTodo,
        createdAt: new Date("2025-02-27"),
      };

      render(
        <TodoItem
          todo={recentTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText(/Feb 27, 2025/)).toBeInTheDocument();
    });
  });
});
