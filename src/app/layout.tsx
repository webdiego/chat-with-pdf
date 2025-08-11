import type { Metadata } from "next";
import "../app/globals.css";

export const metadata: Metadata = {
  title: "Chat with pdf",
  description: "Use AI to chat with your pdf",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
