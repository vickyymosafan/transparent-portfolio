import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vicky Mosafan — Creative Developer | AI × Web × 3D",
  description:
    "Interactive 3D architectural portfolio of Vicky Mosafan — Creative Developer specializing in Next.js, TypeScript, Three.js procedural environments, and applied AI systems.",
  keywords: [
    "Vicky Mosafan",
    "Creative Developer",
    "Fullstack Engineer",
    "Three.js Portfolio",
    "React Three Fiber",
    "Next.js",
    "TypeScript",
    "AI Developer",
    "Architectural 3D Web",
  ],
  openGraph: {
    title: "Vicky Mosafan — Creative Developer | AI × Web × 3D",
    description:
      "Interactive 3D architectural portfolio exploring modern minimalist architecture, procedural Three.js environments, and production AI systems.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased bg-background text-foreground selection:bg-primary selection:text-primary-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
