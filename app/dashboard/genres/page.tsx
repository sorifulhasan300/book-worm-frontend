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
} from "lucide-react";

interface Genre {
  _id: string;
  name: string;
  description?: string;
}

export default function ManageGenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await api.get("/admin/genres");
      setGenres(response.data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGenre) {
        await api.put(`/admin/genres/${editingGenre._id}`, formData);
      } else {
        await api.post("/admin/genres", formData);
      }
      setFormData({ name: "", description: "" });
      setShowAddForm(false);
      setEditingGenre(null);
      fetchGenres();
    } catch (error) {
      console.error("Error saving genre:", error);
    }
  };

  const deleteGenre = async (id: string) => {
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
        await api.delete(`/admin/genres/${id}`);
        Swal.fire("Deleted!", "The genre has been deleted.", "success");
        fetchGenres();
      } catch (error) {
        console.error("Error deleting genre:", error);
        Swal.fire("Error!", "Failed to delete the genre.", "error");
      }
    }
  };

  const startEdit = (genre: Genre) => {
    setEditingGenre(genre);
    setFormData({ name: genre.name, description: genre.description || "" });
    setShowAddForm(true);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-100 flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Manage Genres
              </h1>
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setEditingGenre(null);
                  setFormData({ name: "", description: "" });
                }}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Genre
              </button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {editingGenre ? "Edit Genre" : "Add New Genre"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      {editingGenre ? "Update" : "Add"} Genre
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingGenre(null);
                        setFormData({ name: "", description: "" });
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Genres List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading genres...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {genres.map((genre) => (
                        <tr key={genre._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {genre.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {genre.description || "No description"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(genre)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => deleteGenre(genre._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
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
