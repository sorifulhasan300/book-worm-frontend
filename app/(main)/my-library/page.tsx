"use client";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import React, { useState, useEffect } from "react";
import { BookOpen, Star, Heart, Loader2 } from "lucide-react";
import api from "@/app/lib/axios";

interface Book {
  _id: string;
  title: string;
  author: string;
}

interface LibraryItem {
  _id: string;
  user: string;
  book: Book;
  shelf: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface LibraryData {
  want: LibraryItem[];
  reading: LibraryItem[];
  read: LibraryItem[];
}

export default function MyLibraryPage() {
  const [libraryData, setLibraryData] = useState<LibraryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        const response = await api.get("/self/me");
        setLibraryData(response.data);
      } catch (err) {
        setError("Failed to load library data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, []);

  const renderShelf = (title: string, items: LibraryItem[], color: string) => (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-1 h-8 bg-${color}-500 rounded-full`}></div>
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {items.length} {items.length === 1 ? "book" : "books"}
        </span>
      </div>
      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No books in this shelf yet
          </h3>
          <p className="text-gray-500">
            Start building your library by adding books to your{" "}
            {title.toLowerCase()} list.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Book Cover */}
              <div className="aspect-[3/4] bg-gradient-to-br from-amber-100 to-orange-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-amber-600" />
                </div>
                <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors">
                  <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>
                {/* Progress Badge */}
                <div className="absolute bottom-3 left-3 bg-white rounded-full px-2 py-1 shadow-md">
                  <span className="text-xs font-medium text-gray-700">
                    {item.progress}%
                  </span>
                </div>
              </div>

              {/* Book Details */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                  {item.book.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  by {item.book.author}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Reading Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        item.progress === 100
                          ? "bg-green-500"
                          : item.progress > 50
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item.shelf === "read"
                        ? "bg-green-100 text-green-800"
                        : item.shelf === "reading"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.shelf === "read"
                      ? "Completed"
                      : item.shelf === "reading"
                      ? "Reading"
                      : "Want to Read"}
                  </span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.5</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <ProtectedRoute requiredRole="user">
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute requiredRole="user">
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="user">
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                My Library
              </h1>
              <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                Track your reading journey and organize your personal book
                collection
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {libraryData && (
            <>
              {renderShelf("Want to Read", libraryData.want, "amber")}
              {renderShelf("Currently Reading", libraryData.reading, "blue")}
              {renderShelf("Read", libraryData.read, "green")}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
