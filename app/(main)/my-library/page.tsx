"use client";
import React from "react";
import ProtectedRoute from "../components/ProtectedRoute";

export default function MyLibraryPage() {
  return (
    <ProtectedRoute requiredRole="user">
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">My Library</h1>
          <p className="text-lg text-gray-600">
            Welcome to your personal library. Here you can manage your books and
            reading progress.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
