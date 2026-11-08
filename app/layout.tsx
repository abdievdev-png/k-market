import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seoul Market | Koreys mahsulotlari",
  description: "Koreys mahsulotlari uchun Seoul Market internet-do‘koni."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uz"><body>{children}</body></html>;
}