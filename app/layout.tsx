import type { Metadata } from "next";

import Header from "@/components/layout/Header";
import { ToastProvider } from "@/lib/toast/context";

import "./globals.css";

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Simple task management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Header />

          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
