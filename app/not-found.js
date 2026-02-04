import Link from "next/link";
import { MoveLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full">
        <h1 className="text-9xl font-bold text-teal-100 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Oops! The page you are looking for keeps smiling, but we can't seem to
          find it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-full hover:bg-teal-700 transition-all hover:scale-105"
          >
            <Home size={20} />
            Back to Home
          </Link>
          <Link
            href="/book-appointment"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-teal-600 border-2 border-teal-600 font-semibold rounded-full hover:bg-teal-50 transition-all hover:scale-105"
          >
            <MoveLeft size={20} />
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}
