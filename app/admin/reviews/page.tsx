"use client";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import { Check, X, Eye } from "lucide-react";

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  bookId: {
    _id: string;
    title: string;
    author: string;
  };
  rating: number;
  review: string;
  status: string;
  createdAt: string;
}

export default function ModerateReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">(
    "pending"
  );

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      const status = filter === "all" ? "" : `?status=${filter}`;
      const response = await api.get(`/admin/reviews${status}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const moderateReview = async (
    reviewId: string,
    action: "approve" | "reject"
  ) => {
    try {
      await api.put(`/admin/reviews/${reviewId}`, {
        status: action === "approve" ? "approved" : "rejected",
      });
      fetchReviews();
    } catch (error) {
      console.error("Error moderating review:", error);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    return review.status === filter;
  });

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              Moderate Reviews
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg ${
                  filter === "pending"
                    ? "bg-amber-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Pending ({reviews.filter((r) => r.status === "pending").length})
              </button>
              <button
                onClick={() => setFilter("approved")}
                className={`px-4 py-2 rounded-lg ${
                  filter === "approved"
                    ? "bg-amber-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Approved (
                {reviews.filter((r) => r.status === "approved").length})
              </button>
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg ${
                  filter === "all"
                    ? "bg-amber-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All ({reviews.length})
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading reviews...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Review
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Book
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReviews.map((review) => (
                      <tr key={review._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="max-w-xs truncate text-sm text-gray-900">
                            {review.review}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {review.bookId.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            by {review.bookId.author}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {review.user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {review.rating}/5
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              review.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : review.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {review.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            {review.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    moderateReview(review._id, "approve")
                                  }
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Check className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    moderateReview(review._id, "reject")
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </>
                            )}
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-5 h-5" />
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
