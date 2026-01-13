"use client";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "../../lib/axios";
import Swal from "sweetalert2";
import {
  BookOpen,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  LayoutDashboard,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Play,
} from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string | { _id: string; name: string; __v: number };
  genre: string | { _id: string; name: string; __v: number };
}

interface Tutorial {
  _id: string;
  title: string;
  youtubeUrl: string;
  book: Book;
}

export default function ManageTutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    youtubeUrl: "",
    book: "",
  });

  useEffect(() => {
    fetchTutorials();
    fetchBooks();
  }, []);

  const fetchTutorials = async () => {
    try {
      const response = await api.get("/tutorial");
      setTutorials(response.data);
    } catch (error) {
      console.error("Error fetching tutorials:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await api.get("/admin/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/tutorial", formData);
      setFormData({ title: "", youtubeUrl: "", book: "" });
      setShowAddForm(false);
      fetchTutorials();
      Swal.fire("Success!", "Tutorial added successfully.", "success");
    } catch (error) {
      console.error("Error saving tutorial:", error);
      Swal.fire("Error!", "Failed to add tutorial.", "error");
    }
  };

  const deleteTutorial = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/tutorial/${id}`);
        Swal.fire("Deleted!", "The tutorial has been deleted.", "success");
        fetchTutorials();
      } catch (error) {
        console.error("Error deleting tutorial:", error);
        Swal.fire("Error!", "Failed to delete the tutorial.", "error");
      }
    }
  };

  const extractVideoId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-100 flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Manage Tutorials
              </h1>
              <button
                onClick={() => {
                  setShowAddForm(true);
                  fetchBooks();
                }}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Tutorial
              </button>
            </div>

            {/* Add Tutorial Form */}
            {showAddForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Add New Tutorial
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, youtubeUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Book
                    </label>
                    <select
                      value={formData.book}
                      onChange={(e) =>
                        setFormData({ ...formData, book: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a book</option>
                      {books.map((book) => (
                        <option key={book._id} value={book._id}>
                          {book.title} -{" "}
                          {typeof book.author === "string"
                            ? book.author
                            : book.author.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Add Tutorial
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setFormData({ title: "", youtubeUrl: "", book: "" });
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tutorials List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading tutorials...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tutorial
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Book
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Video
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tutorials.map((tutorial) => (
                        <tr key={tutorial._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <div className="h-12 w-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                                  <Play className="w-6 h-6 text-red-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {tutorial.title}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {tutorial.book.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <a
                              href={tutorial.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 hover:text-red-800 flex items-center gap-1"
                            >
                              <Play className="w-4 h-4" />
                              Watch Video
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => deleteTutorial(tutorial._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
