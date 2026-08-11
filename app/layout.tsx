import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "LandHub | Find Your Perfect Land",
  description: "Verified land properties in the best locations.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
