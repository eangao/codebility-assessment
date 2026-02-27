"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import AuthForm from "@/components/AuthForm";

interface SignInData {
  email: string;
  password: string;
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const callbackError = searchParams.get("error");
    if (callbackError) {
      setError("Invalid credentials");
    }
  }, [searchParams]);

  const handleSubmit = async (data: SignInData) => {
    try {
      setError(null);

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!result?.ok) {
        setError("Invalid credentials");
        return;
      }

      router.push("/todos");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during sign in"
      );
    }
  };

  return (
    <AuthForm
      mode="signin"
      onSubmit={handleSubmit}
      error={error || undefined}
    />
  );
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <SignInContent />
      </Suspense>
    </div>
  );
}
