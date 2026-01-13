"use client";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "../lib/axios";
import { BookOpen, Users, MessageSquare, LogOut } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Stats {
  totalBooks: number;
  totalUsers: number;
  pendingReviews: number;
}

interface Book {
  _id: string;
  title: string;
  genre: string | { _id: string; name: string; __v: number };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalUsers: 0,
    pendingReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [genreData, setGenreData] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [booksRes, usersRes, reviewsRes, genresRes] = await Promise.all([
        api.get("/admin/books"),
        api.get("/admin/users"),
        api.get("/dashboard/reviews?status=pending"),
        api.get("/admin/genres"),
      ]);

      setStats({
        totalBooks: booksRes.data.length,
        totalUsers: usersRes.data.length,
        pendingReviews: reviewsRes.data.length,
      });

      // Process genre data for chart
      const genreCount: { [key: string]: number } = {};
      booksRes.data.forEach((book: Book) => {
        const genreName =
          typeof book.genre === "string" ? book.genre : book.genre?.name;
        if (genreName) {
          genreCount[genreName] = (genreCount[genreName] || 0) + 1;
        }
      });

      const chartData = Object.entries(genreCount).map(([name, count]) => ({
        name,
        count,
      }));

      setGenreData(chartData);
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

            {/* Books per Genre Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Books per Genre
              </h2>
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                </div>
              ) : (
                <div className="h-64">
                  <Bar
                    data={{
                      labels: genreData.map((item) => item.name),
                      datasets: [
                        {
                          label: "Number of Books",
                          data: genreData.map((item) => item.count),
                          backgroundColor: "rgba(245, 158, 11, 0.6)",
                          borderColor: "rgba(245, 158, 11, 1)",
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "top" as const,
                        },
                        title: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                          },
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

