import ProtectedRoute from "@/app/components/ProtectedRoute";
import {
  BarChart3,
  BookOpen,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AdminSidebar() {
  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Manage Books",
      href: "/dashboard/books",
      icon: BookOpen,
    },
    {
      title: "Manage Genres",
      href: "/dashboard/genres",
      icon: Settings,
    },
    {
      title: "Manage Users",
      href: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Moderate Reviews",
      href: "/dashboard/reviews",
      icon: MessageSquare,
    },
    {
      title: "Manage Tutorials",
      href: "/dashboard/tutorials",
      icon: BarChart3,
    },
  ];
  return (
    <ProtectedRoute requiredRole="admin">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <div className="px-3">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.title}
              </Link>
            ))}
          </div>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <Link
            href="/"
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Back to Site
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
