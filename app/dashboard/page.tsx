"use client";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "../lib/axios";
import { BookOpen, Users, MessageSquare, LogOut } from "lucide-react";

interface Stats {
  totalBooks: number;
  totalUsers: number;
  pendingReviews: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalUsers: 0,
    pendingReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [booksRes, usersRes, reviewsRes] = await Promise.all([
        api.get("/dashboard/books"),
        api.get("/dashboard/users"),
        api.get("/dashboard/reviews?status=pending"),
      ]);
      setStats({
        totalBooks: booksRes.data.length,
        totalUsers: usersRes.data.length,
        pendingReviews: reviewsRes.data.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Pending Reviews",
      value: stats.pendingReviews,
      icon: MessageSquare,
      color: "text-orange-600",
    },
  ];

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-100 flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Dashboard Overview
            </h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {loading ? "..." : stat.value}
                      </p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
