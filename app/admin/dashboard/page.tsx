"use client";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import React from "react";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Welcome to the admin dashboard. Here you can manage users, books,
            and system settings.
          </p>
          {/* Add more content as needed */}
        </div>
      </div>
    </ProtectedRoute>
  );
}
