"use client";
import React from "react";
import Link from "next/link";
import { BookOpen, Facebook, Twitter, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg">
                <BookOpen className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-white font-bold text-xl">BookWorm</span>
            </div>
            <p className="text-amber-100 mb-4 max-w-md">
              Your digital library companion. Discover, read, and manage your
              favorite books all in one place.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white hover:text-amber-100 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-white hover:text-amber-100 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-white hover:text-amber-100 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-white hover:text-amber-100 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-amber-100 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/my-library"
                  className="text-amber-100 hover:text-white transition-colors"
                >
                  My Library
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-amber-100 hover:text-white transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-amber-100 hover:text-white transition-colors"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-amber-100 hover:text-white transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-amber-100 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-amber-100 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-amber-100 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-amber-500 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-amber-100 text-sm">
            © {new Date().getFullYear()} BookWorm. All rights reserved.
          </p>
          <p className="text-amber-100 text-sm mt-2 md:mt-0 italic">
            "A room without books is like a body without a soul." — Marcus
            Tullius Cicero
          </p>
        </div>
      </div>
    </footer>
  );
}
