import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export interface TestUser {
  id: string;
  email: string;
  password: string;
}

export async function createTestUser(
  email: string,
  password: string = "password123"
): Promise<TestUser> {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: email.split("@")[0],
    },
  });
  return {
    id: user.id,
    email: user.email,
    password, // Return unhashed for signin test
  };
}

export async function cleanupDatabase() {
  // Delete todos first (foreign key constraint)
  await prisma.todo.deleteMany({});
  // Then delete users
  await prisma.user.deleteMany({});
}
