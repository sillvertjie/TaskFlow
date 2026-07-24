import type { ReactNode } from "react";

interface SubmitButtonProps {
  loading: boolean;
  loadingText: string;
  children: ReactNode;
}

export default function SubmitButton({
  loading,
  loadingText,
  children,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? loadingText : children}
    </button>
  );
}
