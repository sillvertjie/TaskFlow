import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-xl border border-foreground/10 bg-background p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          Create your account
        </h1>
        <p className="mb-6 text-foreground/70">Create your TaskFlow account.</p>
        <AuthForm mode="register" />
        <p className="mt-6 text-center text-sm text-foreground/70">
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
