"use client";
import Link from "next/link";
import { BookOpen, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <BookOpen className="w-24 h-24 text-amber-600 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Sorry, the page you&apos;re looking for doesn&apos;t exist. It might
            have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium gap-2"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>

          <div>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
