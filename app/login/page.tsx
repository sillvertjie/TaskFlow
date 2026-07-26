import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-xl border border-foreground/10 bg-background p-8 shadow-lg">
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          Sign in to TaskFlow
        </h1>
        <p className="mb-6 text-foreground/70">
          Sign in to your TaskFlow account.
        </p>
        <AuthForm mode="login" />
        <p className="mt-6 text-center text-sm text-foreground/70">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
