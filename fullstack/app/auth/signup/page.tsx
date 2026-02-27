"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthForm from "@/components/AuthForm";

interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: SignUpData | { email: string; password: string }) => {
    try {
      setError(null);

      // Type guard to ensure we have SignUpData
      if (!("name" in data)) {
        setError("Name is required");
        return;
      }

      // Client-side validation
      if (data.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create account");
        return;
      }

      router.push("/auth/signin");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during sign up"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <AuthForm
        mode="signup"
        onSubmit={handleSubmit}
        error={error || undefined}
      />
    </div>
  );
}
