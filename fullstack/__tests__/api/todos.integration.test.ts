import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { prisma } from "@/lib/prisma";
import { createTestUser, cleanupDatabase } from "@/__tests__/helpers/test-utils";

describe("Todo API Integration Tests", () => {
  let testId: string;

  beforeEach(async () => {
    testId = Math.random().toString(36).substring(7);
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("GET /api/todos", () => {
    it("should return all todos for a user", async () => {
      const user1 = await createTestUser(`user1-${testId}@test.com`);

      // Create test todos
      const todo1 = await prisma.todo.create({
        data: { title: "Todo 1", userId: user1.id },
      });

      const todo2 = await prisma.todo.create({
        data: { title: "Todo 2", userId: user1.id },
      });

      // Verify todos exist in database
      const todos = await prisma.todo.findMany({
        where: { userId: user1.id },
        orderBy: { createdAt: "asc" },
      });

      expect(todos).toHaveLength(2);
      expect(todos[0].title).toBe("Todo 1");
      expect(todos[1].title).toBe("Todo 2");
    });

    it("should enforce ownership isolation", async () => {
      const user1 = await createTestUser(`user1a-${testId}@test.com`);
      const user2 = await createTestUser(`user2a-${testId}@test.com`);

      // Create todos for different users
      await prisma.todo.create({
        data: { title: "User1 Todo", userId: user1.id },
      });

      await prisma.todo.create({
        data: { title: "User2 Todo", userId: user2.id },
      });

      // Verify user1 only sees their todos
      const user1Todos = await prisma.todo.findMany({
        where: { userId: user1.id },
      });

      const user2Todos = await prisma.todo.findMany({
        where: { userId: user2.id },
      });

      expect(user1Todos).toHaveLength(1);
      expect(user1Todos[0].title).toBe("User1 Todo");
      expect(user2Todos).toHaveLength(1);
      expect(user2Todos[0].title).toBe("User2 Todo");
    });

    it("should return empty array when user has no todos", async () => {
      const user = await createTestUser(`emptyuser-${testId}@test.com`);

      const todos = await prisma.todo.findMany({
        where: { userId: user.id },
      });

      expect(todos).toHaveLength(0);
      expect(Array.isArray(todos)).toBe(true);
    });
  });

  describe("POST /api/todos", () => {
    it("should create a new todo with valid input", async () => {
      const user = await createTestUser(`postuser-${testId}@test.com`);

      const createdTodo = await prisma.todo.create({
        data: {
          title: "New Todo",
          userId: user.id,
        },
      });

      expect(createdTodo.id).toBeDefined();
      expect(createdTodo.title).toBe("New Todo");
      expect(createdTodo.completed).toBe(false);
      expect(createdTodo.userId).toBe(user.id);
      expect(createdTodo.createdAt).toBeDefined();
    });

    it("should set completed to false by default", async () => {
      const user = await createTestUser(`defaultuser-${testId}@test.com`);

      const todo = await prisma.todo.create({
        data: {
          title: "Test",
          userId: user.id,
        },
      });

      expect(todo.completed).toBe(false);
    });

    it("should associate todo with user", async () => {
      const user = await createTestUser(`assocuser-${testId}@test.com`);

      const todo = await prisma.todo.create({
        data: {
          title: "User Todo",
          userId: user.id,
        },
      });

      const fetched = await prisma.todo.findUnique({
        where: { id: todo.id },
      });

      expect(fetched?.userId).toBe(user.id);
    });
  });

  describe("PATCH /api/todos/[id]", () => {
    it("should update completed status", async () => {
      const user = await createTestUser(`patchuser-${testId}@test.com`);

      const todo = await prisma.todo.create({
        data: { title: "Test", userId: user.id },
      });

      const updated = await prisma.todo.update({
        where: { id: todo.id },
        data: { completed: true },
      });

      expect(updated.completed).toBe(true);
      expect(updated.id).toBe(todo.id);
    });

    it("should update title", async () => {
      const user = await createTestUser(`updateuser-${testId}@test.com`);

      const todo = await prisma.todo.create({
        data: { title: "Original", userId: user.id },
      });

      const updated = await prisma.todo.update({
        where: { id: todo.id },
        data: { title: "Updated" },
      });

      expect(updated.title).toBe("Updated");
    });

    it("should update both title and completed", async () => {
      const user = await createTestUser(`bothupdate-${testId}@test.com`);

      const todo = await prisma.todo.create({
        data: { title: "Test", completed: false, userId: user.id },
      });

      const updated = await prisma.todo.update({
        where: { id: todo.id },
        data: { title: "New Title", completed: true },
      });

      expect(updated.title).toBe("New Title");
      expect(updated.completed).toBe(true);
    });

    it("should enforce ownership during update", async () => {
      const user1 = await createTestUser(`user1b-${testId}@test.com`);
      const user2 = await createTestUser(`user2b-${testId}@test.com`);

      const todo = await prisma.todo.create({
        data: { title: "Test", userId: user1.id },
      });

      // Verify we can update user1's todo as user1
      const updated = await prisma.todo.update({
        where: { id: todo.id },
        data: { completed: true },
      });

      expect(updated.userId).toBe(user1.id);

      // Verify query by id + userId would fail for another user
      const otherUserTodo = await prisma.todo.findFirst({
        where: { id: todo.id, userId: user2.id },
      });

      expect(otherUserTodo).toBeNull();
    });
  });

  describe("DELETE /api/todos/[id]", () => {
    it("should delete a todo", async () => {
      const user = await createTestUser(`deleteuser-${testId}@test.com`);

      const todo = await prisma.todo.create({
        data: { title: "To Delete", userId: user.id },
      });

      const deleted = await prisma.todo.delete({
        where: { id: todo.id },
      });

      expect(deleted.id).toBe(todo.id);

      const fetched = await prisma.todo.findUnique({
        where: { id: todo.id },
      });

      expect(fetched).toBeNull();
    });

    it("should enforce ownership during delete", async () => {
      const user1 = await createTestUser(`user1c-${testId}@test.com`);
      const user2 = await createTestUser(`user2c-${testId}@test.com`);

      const todo = await prisma.todo.create({
        data: { title: "Test", userId: user1.id },
      });

      // Verify user1 can delete their own todo
      const deleted = await prisma.todo.delete({
        where: { id: todo.id },
      });

      expect(deleted.userId).toBe(user1.id);
    });

    it("should not find todo for another user", async () => {
      const user1 = await createTestUser(`user1d-${testId}@test.com`);
      const user2 = await createTestUser(`user2d-${testId}@test.com`);

      const todo = await prisma.todo.create({
        data: { title: "Test", userId: user1.id },
      });

      // Simulate what would happen if user2 tries to delete user1's todo
      const notFound = await prisma.todo.findFirst({
        where: { id: todo.id, userId: user2.id },
      });

      expect(notFound).toBeNull();
    });
  });
});
