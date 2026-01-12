"use client";
import React, { useState, useContext } from "react";
import Link from "next/link";
import { BookOpen, Menu, X, LogOut, User } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const auth = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    auth?.logout();
    setIsOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-amber-600 to-orange-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg">
                <BookOpen className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-white font-bold text-xl">BookWorm</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-white hover:text-amber-100 transition-colors font-medium"
            >
              Home
            </Link>
            {auth?.user ? (
              <>
                <Link
                  href="/my-library"
                  className="text-white hover:text-amber-100 transition-colors font-medium"
                >
                  My Library
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-white">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{auth.user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-white hover:text-amber-100 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white hover:text-amber-100 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-white hover:text-amber-100 transition-colors font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-amber-100 focus:outline-none focus:text-amber-100"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-r from-amber-600 to-orange-600 border-t border-amber-500">
              <Link
                href="/"
                className="block px-3 py-2 text-white hover:text-amber-100 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              {auth?.user ? (
                <>
                  <Link
                    href="/my-library"
                    className="block px-3 py-2 text-white hover:text-amber-100 transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    My Library
                  </Link>
                  <div className="px-3 py-2 text-white font-medium">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{auth.user.name}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-white hover:text-amber-100 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-white hover:text-amber-100 transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-white hover:text-amber-100 transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
