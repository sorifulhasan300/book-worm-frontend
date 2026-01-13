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
  Search,
} from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string | { _id: string; name: string; __v: number };
  genre: string | { _id: string; name: string; __v: number };
  description: string;
  cover_image?: string;
  published_year?: number;
  pages?: number;
  rating?: number;
  total_ratings?: number;
  isbn?: string;
}

interface Genre {
  _id: string;
  name: string;
  description?: string;
}

export default function ManageBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    coverImage: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/admin/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: string) => {
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
        await api.delete(`/admin/books/${id}`);
        Swal.fire("Deleted!", "The book has been deleted.", "success");
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
        Swal.fire("Error!", "Failed to delete the book.", "error");
      }
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await api.get("/admin/genres");
      setGenres(response.data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bookData = {
        title: formData.title,
        author: formData.author,
        genre: formData.genre,
        description: formData.description,
        coverImage: formData.coverImage,
      };

      if (isEditing && editingBook) {
        await api.put(`/admin/books/${editingBook._id}`, bookData);
      } else {
        await api.post("/admin/books", bookData);
      }

      setShowAddForm(false);
      setIsEditing(false);
      setEditingBook(null);
      setFormData({
        title: "",
        author: "",
        genre: "",
        description: "",
        coverImage: "",
      });
      fetchBooks();
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const startEditing = (book: Book) => {
    setIsEditing(true);
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: typeof book.author === "string" ? book.author : book.author.name,
      genre: typeof book.genre === "string" ? book.genre : book.genre?._id,
      description: book.description,
      coverImage: book.cover_image || "",
    });
    setShowAddForm(true);
    fetchGenres();
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof book.author === "string" ? book.author : book.author.name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen  p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Manage Books</h1>
            <button
              onClick={() => {
                setShowAddForm(true);
                fetchGenres();
              }}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Book
            </button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search books by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Add Book Form */}
          {showAddForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Add New Book
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) =>
                      setFormData({ ...formData, genre: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a genre</option>
                    {genres.map((genre) => (
                      <option key={genre._id} value={genre._id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) =>
                      setFormData({ ...formData, coverImage: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    {isEditing ? "Update Book" : "Add Book"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setIsEditing(false);
                      setEditingBook(null);
                      setFormData({
                        title: "",
                        author: "",
                        genre: "",
                        description: "",
                        coverImage: "",
                      });
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Books Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading books...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Book
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Genre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBooks.map((book) => (
                      <tr key={book._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className="h-12 w-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                                <span className="text-amber-600 font-semibold text-sm">
                                  {book.title.charAt(0)}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {book.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {book.isbn}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {typeof book.author === "string"
                            ? book.author
                            : book.author.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {typeof book.genre === "string"
                            ? book.genre
                            : book.genre?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {book.rating
                            ? `${book.rating.toFixed(1)} (${
                                book.total_ratings
                              })`
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditing(book)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => deleteBook(book._id)}
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
    </ProtectedRoute>
  );
}
