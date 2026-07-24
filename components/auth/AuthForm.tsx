"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthInput from "./AuthInput";
import SubmitButton from "./SubmitButton";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isRegister = mode === "register";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Something went wrong.");
        return;
      }

      if (isRegister) {
        router.push("/login");
      } else {
        router.push("/");
      }
    } catch {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-5"
    >
      <AuthInput
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        required
      />

      <AuthInput
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        required
      />

      {isRegister && (
        <AuthInput
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          required
        />
      )}

      {error && (
        <p className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <SubmitButton
        loading={loading}
        loadingText={isRegister ? "Registering..." : "Logging in..."}
      >
        {isRegister ? "Register" : "Login"}
      </SubmitButton>
    </form>
  );
}
