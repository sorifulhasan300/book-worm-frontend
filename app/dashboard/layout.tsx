import type { Metadata } from "next";
import "../globals.css";
import { AuthProvider } from "../context/AuthContext";
import AdminSidebar from "./components/AdminSidebar";

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
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </AuthProvider>
  );
}
