import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";



export const metadata: Metadata = {
  title: "Sui Tinder",
  description: "A next-generation crypto dating app powered by Sui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
      >
        <Toaster richColors position="top-center" />

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
