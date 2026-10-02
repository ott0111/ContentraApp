import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contentra",
  description: "The operating system for creators, businesses, and agencies."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
