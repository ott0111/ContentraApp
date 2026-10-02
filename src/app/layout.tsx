import ContentraLogo from "../../Assets/Contentra_Logo_FINAL.png";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Contentra — The Operating System for Creators", template: "%s · Contentra" },
  description: "Contentra connects your business, content, audience, analytics and AI into one growth system for creators, businesses and agencies.",
  icons: { icon: ContentraLogo.src, shortcut: ContentraLogo.src, apple: ContentraLogo.src },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
