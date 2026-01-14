"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (auth?.loading) return; // Still loading

    if (!auth?.user || !auth?.token) {
      // Not authenticated, redirect to login
      router.push("/login");
      return;
    }

    if (requiredRole && auth.user.role !== requiredRole) {
      // Not authorized, redirect based on role
      if (auth.user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/my-library");
      }
      return;
    }
  }, [auth?.loading, auth?.user, auth?.token, requiredRole, router]);

  // Show loading or nothing while checking authentication
  if (auth?.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // If not authenticated or not authorized, don't render children
  if (
    !auth?.user ||
    !auth?.token ||
    (requiredRole && auth.user.role !== requiredRole)
  ) {
    return null;
  }

  return <>{children}</>;
}
