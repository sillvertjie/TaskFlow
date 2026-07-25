import Link from "next/link";

import AuthForm from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-xl bg-background p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          Create Account
        </h1>

        <p className="mb-6 text-gray-700">Create your TaskFlow account.</p>

        <AuthForm mode="register" />

        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
