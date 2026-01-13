import type { Metadata } from "next";
import "../globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata: Metadata = {
  title: "BookWorm Admin - Dashboard",
  description: "Admin dashboard for BookWorm",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
