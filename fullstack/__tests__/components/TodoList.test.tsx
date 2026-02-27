import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoList from "@/components/TodoList";

describe("TodoList", () => {
  const mockTodos = [
    {
      id: "1",
      title: "Buy groceries",
      completed: false,
      createdAt: new Date("2025-02-20"),
      userId: "user-1",
    },
    {
      id: "2",
      title: "Finish project",
      completed: true,
      createdAt: new Date("2025-02-21"),
      userId: "user-1",
    },
  ];

  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering Todo Items", () => {
    it("should render all todos", () => {
      render(
        <TodoList
          todos={mockTodos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          isLoading={false}
        />
      );

      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(screen.getByText("Finish project")).toBeInTheDocument();
    });

    it("should render TodoItem components with correct props", () => {
      render(
        <TodoList
          todos={mockTodos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          isLoading={false}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(2);
      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).toBeChecked();
    });

    it("should pass onToggle callback to TodoItem", async () => {
      const user = userEvent.setup();

      render(
        <TodoList
          todos={mockTodos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          isLoading={false}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[0]);

      expect(mockOnToggle).toHaveBeenCalledWith("1");
    });

    it("should pass onDelete callback to TodoItem", async () => {
      const user = userEvent.setup();

      render(
        <TodoList
          todos={mockTodos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          isLoading={false}
        />
      );

      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      await user.click(deleteButtons[0]);

      expect(mockOnDelete).toHaveBeenCalledWith("1");
    });
  });

  describe("Empty State", () => {
    it("should show empty state message when todos array is empty", () => {
      render(
        <TodoList
          todos={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          isLoading={false}
        />
      );

      expect(screen.getByText("No todos yet")).toBeInTheDocument();
    });

    it("should show empty state icon and description", () => {
      render(
        <TodoList
          todos={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          isLoading={false}
        />
      );

      expect(screen.getByText("No todos yet")).toBeInTheDocument();
      expect(screen.getByText("Create your first todo to get started!")).toBeInTheDocument();
    });

    it("should not show any TodoItem when empty", () => {
      render(
        <TodoList
          todos={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          isLoading={false}
        />
      );

      const checkboxes = screen.queryAllByRole("checkbox");
      expect(checkboxes).toHaveLength(0);
    });
  });

  describe("Loading State", () => {
    it("should show skeleton loaders when loading", () => {
      const { container } = render(
        <TodoList
          todos={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          isLoading={true}
        />
      );

      const skeletons = container.querySelectorAll("[data-testid='skeleton']");
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("should not show todos when loading", () => {
      render(
        <TodoList
          todos={mockTodos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          isLoading={true}
        />
      );

      expect(screen.queryByText("Buy groceries")).not.toBeInTheDocument();
    });

    it("should render multiple skeleton items", () => {
      const { container } = render(
        <TodoList
          todos={[]}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          isLoading={true}
        />
      );

      const skeletons = container.querySelectorAll("[data-testid='skeleton']");
      // Should have at least 3 skeleton loaders
      expect(skeletons.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Edge Cases", () => {
    it("should handle single todo", () => {
      const singleTodo = mockTodos.slice(0, 1);

      render(
        <TodoList
          todos={singleTodo}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          isLoading={false}
        />
      );

      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    });

    it("should handle many todos", () => {
      const manyTodos = Array.from({ length: 50 }, (_, i) => ({
        id: String(i),
        title: `Todo ${i}`,
        completed: i % 2 === 0,
        createdAt: new Date(),
        userId: "user-1",
      }));

      render(
        <TodoList
          todos={manyTodos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          isLoading={false}
        />
      );

      expect(screen.getByText("Todo 0")).toBeInTheDocument();
      expect(screen.getByText("Todo 49")).toBeInTheDocument();
    });

    it("should handle all todos completed", () => {
      const allCompletedTodos = mockTodos.map((todo) => ({
        ...todo,
        completed: true,
      }));

      render(
        <TodoList
          todos={allCompletedTodos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          isLoading={false}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });
  });
});
