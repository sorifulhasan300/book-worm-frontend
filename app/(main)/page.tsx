"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";
import {
  BookOpen,
  TrendingUp,
  Star,
  Clock,
  Users,
  Search,
  Filter,
  ChevronRight,
  Heart,
  Award,
  Calendar,
} from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  genre: string;
  rating: number;
  description: string;
}

interface ReadingStats {
  booksRead: number;
  pagesRead: number;
  readingStreak: number;
  favoriteGenre: string;
}

export default function Home() {
  const auth = useContext(AuthContext);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [readingStats, setReadingStats] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls for demo purposes
    const fetchHomeData = async () => {
      try {
        // Mock data - replace with actual API calls
        const mockBooks: Book[] = [
          {
            id: "1",
            title: "The Midnight Library",
            author: "Matt Haig",
            cover: "/api/placeholder/200/300",
            genre: "Fiction",
            rating: 4.5,
            description:
              "A novel about all the choices that go into a life well lived.",
          },
          {
            id: "2",
            title: "Atomic Habits",
            author: "James Clear",
            cover: "/api/placeholder/200/300",
            genre: "Self-Help",
            rating: 4.8,
            description:
              "An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
          },
          {
            id: "3",
            title: "The Seven Husbands of Evelyn Hugo",
            author: "Taylor Jenkins Reid",
            cover: "/api/placeholder/200/300",
            genre: "Romance",
            rating: 4.6,
            description: "A reclusive Hollywood icon finally tells her story.",
          },
        ];

        const mockStats: ReadingStats = {
          booksRead: 24,
          pagesRead: 8420,
          readingStreak: 7,
          favoriteGenre: "Fiction",
        };

        setRecommendedBooks(mockBooks);
        setReadingStats(mockStats);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to BookWorm
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 mb-8 max-w-3xl mx-auto">
              Discover your next favorite book. Track your reading journey and
              connect with fellow book lovers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/browse"
                className="bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors inline-flex items-center justify-center"
              >
                <Search className="w-5 h-5 mr-2" />
                Browse Books
              </Link>
              {auth?.user && (
                <Link
                  href="/my-library"
                  className="bg-amber-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors inline-flex items-center justify-center"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  My Library
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Reading Stats Overview */}
        {auth?.user && readingStats && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Your Reading Journey
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
                  <BookOpen className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {readingStats.booksRead}
                </h3>
                <p className="text-gray-600">Books Read</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {readingStats.pagesRead.toLocaleString()}
                </h3>
                <p className="text-gray-600">Pages Read</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {readingStats.readingStreak}
                </h3>
                <p className="text-gray-600">Day Streak</p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {readingStats.favoriteGenre}
                </h3>
                <p className="text-gray-600">Favorite Genre</p>
              </div>
            </div>
          </div>
        )}

        {/* Personalized Recommendations */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {auth?.user ? "Recommended for You" : "Popular Books"}
            </h2>
            <Link
              href="/browse"
              className="text-amber-600 hover:text-amber-700 font-semibold inline-flex items-center"
            >
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-[3/4] bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-amber-600" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="bg-white rounded-full p-1 shadow-md">
                      <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-pointer" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {book.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2">
                      {book.genre}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {book.title}
                  </h3>

                  <p className="text-gray-600 mb-4">by {book.author}</p>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {book.description}
                  </p>

                  <div className="flex gap-2">
                    <Link
                      href={`/books/${book.id}`}
                      className="flex-1 bg-amber-600 text-white text-center py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                    >
                      View Details
                    </Link>
                    {auth?.user && (
                      <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                        Add to Shelf
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        {!auth?.user && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
              <Users className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Join the BookWorm Community
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Create your account to track your reading progress, get
              personalized recommendations, and connect with fellow book
              enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="bg-white text-amber-600 border-2 border-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
