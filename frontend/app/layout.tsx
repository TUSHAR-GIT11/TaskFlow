// @ts-ignore - allow side-effect CSS import without type declarations
import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";
import ApolloWrapper from "./lib/apollo-provider"
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {/* Navbar */}
        <nav className="w-full bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            
            {/* Logo / Brand */}
            <Link href="/" className="text-xl font-semibold text-gray-900">
              Task<span className="text-blue-600">Flow</span>
            </Link>

            {/* Auth Links */}
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="text-sm font-medium text-white bg-blue-600
                           px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign up
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <ApolloWrapper>
           <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
        </ApolloWrapper>
          
      </body>
    </html>
  );
}
