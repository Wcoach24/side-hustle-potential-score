import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Side Hustle Potential Score | Discover Your Earning Power",
  description: "Answer 5 questions and discover your Side Hustle Potential Score. See how much you could realistically earn outside your 9-5.",
  openGraph: {
    title: "I scored 84/100 on the Side Hustle Potential Test 🔥",
    description: "Discover your Side Hustle Potential Score — takes 2 minutes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Side Hustle Potential Score",
    description: "Discover how ready you are to generate income outside your 9-5.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
