"use client";
import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  BookOpen,
  Star,
  ChevronLeft,
  ChevronRight,
  Heart,
  Plus,
  Loader2,
} from "lucide-react";
import { AuthContext } from "@/app/context/AuthContext";
import api from "@/app/lib/axios";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  cover_image?: string;
  published_year?: number;
  pages?: number;
  rating?: number;
  total_ratings?: number;
  isbn?: string;
}

interface RawBook {
  _id: string;
  title: string;
  author: string;
  genre: { _id: string; name: string; __v?: number } | string;
  description: string;
  cover_image?: string;
  published_year?: number;
  pages?: number;
  rating?: number;
  total_ratings?: number;
  isbn?: string;
}

export default function BrowseBooksPage() {
  const auth = useContext(AuthContext);
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 12;

  // Get unique genres for filter dropdown
  const genres = [...new Set(books.map((book) => book.genre))].sort();

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [books, searchQuery, selectedGenre]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/books");
      console.log(response.data);
      const transformedBooks = response.data.map((book: RawBook) => {
        const genre =
          typeof book.genre === "string" ? book.genre : book.genre?.name;
        return {
          id: book._id,
          title: book.title,
          author: book.author,
          genre,
          description: book.description,
          cover_image: book.cover_image,
          published_year: book.published_year,
          pages: book.pages,
          rating: book.rating,
          total_ratings: book.total_ratings,
          isbn: book.isbn,
        };
      });
      setBooks(transformedBooks);
      setFilteredBooks(transformedBooks);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load books. Using sample data instead.");
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = () => {
    let filtered = books;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.isbn?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Genre filter
    if (selectedGenre) {
      filtered = filtered.filter((book) => book.genre === selectedGenre);
    }

    setFilteredBooks(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderBookCard = (book: Book) => {
    if (viewMode === "list") {
      return (
        <div
          key={book.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
        >
          <div className="flex gap-6">
            {/* Book Cover */}
            <div className="flex-shrink-0 w-24 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-amber-600" />
            </div>

            {/* Book Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 mb-2">by {book.author}</p>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {book.rating?.toFixed(1) || "N/A"}
                      </span>
                      {book.total_ratings && (
                        <span className="text-xs text-gray-500 ml-1">
                          ({book.total_ratings})
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {book.genre}
                    </span>
                    {book.pages && (
                      <span className="text-xs text-gray-500">
                        {book.pages} pages
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {book.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  <Link
                    href={`/books/${book.id}`}
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium text-center"
                  >
                    View Details
                  </Link>
                  {auth?.user && (
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-1">
                      <Plus className="w-4 h-4" />
                      Add to Shelf
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Grid view
    return (
      <div
        key={book.id}
        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
      >
        {/* Book Cover */}
        <div className="aspect-[3/4] bg-gradient-to-br from-amber-100 to-orange-100 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-amber-600" />
          </div>
          {auth?.user && (
            <button className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors">
              <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
            </button>
          )}
        </div>

        {/* Book Details */}
        <div className="p-6">
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">
                {book.rating?.toFixed(1) || "N/A"}
              </span>
              {book.total_ratings && (
                <span className="text-xs text-gray-500 ml-1">
                  ({book.total_ratings})
                </span>
              )}
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
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Browse Books
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Discover your next favorite book from our extensive collection
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Genre Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="block w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-lg border ${
                  viewMode === "grid"
                    ? "bg-amber-600 text-white border-amber-600"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-lg border ${
                  viewMode === "list"
                    ? "bg-amber-600 text-white border-amber-600"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredBooks.length)}{" "}
            of {filteredBooks.length} books
            {searchQuery && ` for "${searchQuery}"`}
            {selectedGenre && ` in ${selectedGenre}`}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Books Grid/List */}
        {currentBooks.length > 0 ? (
          <>
            <div
              className={`grid gap-6 mb-8 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {currentBooks.map(renderBookCard)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      const distance = Math.abs(page - currentPage);
                      return (
                        distance === 0 ||
                        distance === 1 ||
                        page === 1 ||
                        page === totalPages
                      );
                    })
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 py-2 text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg ${
                            page === currentPage
                              ? "bg-amber-600 text-white"
                              : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No books found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or browse all books.
            </p>
            {(searchQuery || selectedGenre) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGenre("");
                }}
                className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
