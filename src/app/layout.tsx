import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Contentra — The Operating System for Creators", template: "%s · Contentra" },
  description: "Contentra connects your business, content, audience, analytics and AI into one growth system for creators, businesses and agencies.",
  icons: { icon: "/assets/Contentra_Logo_FINAL.png", shortcut: "/assets/Contentra_Logo_FINAL.png", apple: "/assets/Contentra_Logo_FINAL.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
