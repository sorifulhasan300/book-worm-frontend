"use client";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  BookOpen,
  Star,
  ArrowLeft,
  Plus,
  Heart,
  Calendar,
  FileText,
  Hash,
  Loader2,
  MessageSquare,
  Send,
  ChevronDown,
} from "lucide-react";
import { AuthContext } from "@/app/context/AuthContext";
import api from "@/app/lib/axios";
import { showError } from "@/app/lib/sweetalert";
import { AxiosError } from "axios";
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

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  bookId: string;
  rating: number;
  review: string;
  status: string;
  createdAt: string;
}

export default function BookDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const auth = useContext(AuthContext);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, review: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showShelfDropdown, setShowShelfDropdown] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBookDetails();
      fetchReviews();
    }
  }, [id]);
  console.log(book);
  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/books/${id}`);
      const rawBook: RawBook = response.data;
      const genre =
        typeof rawBook.genre === "string" ? rawBook.genre : rawBook.genre?.name;
      const transformedBook: Book = {
        id: rawBook._id,
        title: rawBook.title,
        author: rawBook.author,
        genre,
        description: rawBook.description,
        cover_image: rawBook.cover_image,
        published_year: rawBook.published_year,
        pages: rawBook.pages,
        rating: rawBook.rating,
        total_ratings: rawBook.total_ratings,
        isbn: rawBook.isbn,
      };
      setBook(transformedBook);
    } catch (err) {
      console.error("Error fetching book details:", err);
      setError("Failed to load book details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/review/${id}`);
      setReviews(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const message = (axiosError.response?.data as { message?: string })
        ?.message;
      showError(
        "Review Fetching Failed",
        message || "Something went wrong while fetching reviews"
      );
    }
  };

  const submitReview = async () => {
    if (!auth?.user) return;
    try {
      await api.post("/review", {
        bookId: id,
        rating: newReview.rating,
        review: newReview.review,
        status: "pending",
      });
      setNewReview({ rating: 5, review: "" });
      setShowReviewForm(false);
      fetchReviews();
    } catch (error) {
      const axiosError = error as AxiosError;
      const message = (axiosError.response?.data as { message?: string })
        ?.message;
      showError(
        "Review Submitting Failed",
        message || "Something went wrong while submitting your review"
      );
    }
  };

  const addToShelf = async (shelf: string) => {
    if (!auth?.user) return;
    console.log(shelf);
    try {
      const shelfMapping: { [key: string]: string } = {
        "Want to Read": "want",
        "Currently Reading": "reading",
        Read: "read",
      };
      const backendShelf = shelfMapping[shelf] || shelf;
      const progress = shelf === "Read" ? book?.pages || 100 : 0;
      await api.post("/self", { bookId: id, shelf: backendShelf, progress });
      alert(`Added to ${shelf}`);
      setShowShelfDropdown(false);
    } catch (err) {
      console.error("Error adding to shelf:", err);
      showError(
        "Add to Shelf Failed",
        "Something went wrong while adding the book to your shelf"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Book Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The requested book could not be found."}
          </p>
          <Link
            href="/browse"
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
          >
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/browse"
            className="inline-flex items-center text-amber-100 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Browse
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Book Details</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Book Cover */}
            <div className="md:w-1/3 p-8 flex justify-center">
              <div className="w-64 h-80 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg shadow-lg flex items-center justify-center relative">
                <BookOpen className="w-20 h-20 text-amber-600" />
                {auth?.user && (
                  <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Book Details */}
            <div className="md:w-2/3 p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {book.title}
                </h2>
                <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg text-gray-700 ml-1">
                      {book.rating?.toFixed(1) || "N/A"}
                    </span>
                    {book.total_ratings && (
                      <span className="text-sm text-gray-500 ml-1">
                        ({book.total_ratings} ratings)
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {book.genre}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {book.published_year && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{book.published_year}</span>
                    </div>
                  )}
                  {book.pages && (
                    <div className="flex items-center text-gray-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="text-sm">{book.pages} pages</span>
                    </div>
                  )}
                  {book.isbn && (
                    <div className="flex items-center text-gray-600">
                      <Hash className="w-4 h-4 mr-2" />
                      <span className="text-sm">{book.isbn}</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  {auth?.user ? (
                    <>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowShelfDropdown(!showShelfDropdown)
                          }
                          className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                          Add to Shelf
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        {showShelfDropdown && (
                          <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => addToShelf("Want to Read")}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                            >
                              Want to Read
                            </button>
                            <button
                              onClick={() => addToShelf("Currently Reading")}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                            >
                              Currently Reading
                            </button>
                            <button
                              onClick={() => addToShelf("Read")}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-50"
                            >
                              Read
                            </button>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
                      >
                        <MessageSquare className="w-5 h-5" />
                        Write Review
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                    >
                      Login to Add to Library
                    </Link>
                  )}
                </div>

                {/* Review Form */}
                {showReviewForm && auth?.user && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-lg font-semibold mb-4">
                      Write a Review
                    </h4>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() =>
                              setNewReview({ ...newReview, rating: star })
                            }
                            className="text-yellow-400 hover:text-yellow-500"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= newReview.rating ? "fill-current" : ""
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review
                      </label>
                      <textarea
                        value={newReview.review}
                        onChange={(e) =>
                          setNewReview({ ...newReview, review: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        rows={4}
                        placeholder="Share your thoughts about this book..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={submitReview}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Submit Review
                      </button>
                      <button
                        onClick={() => setShowReviewForm(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Reviews Section */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Reviews ({reviews.length})
                  </h3>
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review._id}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-800">
                              {review.user.name}
                            </span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.review}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No reviews yet. Be the first to review!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
