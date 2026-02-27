import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function TodoPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h2 className="text-2xl font-bold">Todos</h2>
        <p className="mt-4 text-muted-foreground">Todo list coming in Session 4...</p>
      </div>
    </div>
  );
}
