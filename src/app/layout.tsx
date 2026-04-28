import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { FirestoreSync } from "@/components/FirestoreSync";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Aura | Deep Focus & Productivity",
  description: "A premium, intelligent productivity platform that helps users focus deeply, manage tasks efficiently, and build long-term consistency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-foreground bg-background selection:bg-primary/30 min-h-screen flex flex-col`}>
        <AuthProvider>
          <FirestoreSync />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
