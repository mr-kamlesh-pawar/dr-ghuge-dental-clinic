"use client";

import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { 
  Star, 
  Calendar,
  AlertCircle,
  ThumbsUp
} from "lucide-react";

const ReviewsComponent = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to render stars
  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={`${
            star <= rating 
              ? "fill-yellow-400 text-yellow-400" 
              : "fill-gray-200 text-gray-300"
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-semibold text-gray-700">
        {rating.toFixed(1)}
      </span>
    </div>
  );

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Recently";
    }
  };

  // Function to get initials
  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Fetch reviews function
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch enough reviews for the marquee (e.g., 20) in a single request
        const response = await fetch(
          `/api/dental-reviews?limit=20&sort=newest`,
          {
            cache: 'force-cache',
            next: { revalidate: 3600 } // Cache for 1 hour
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch reviews');
        }

        if (result.success) {
          setReviews(result.data || []);
        } else {
            console.error("API returned success: false", result);
           // Don't throw here if simply no data, just existing state
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="w-full px-6 py-12">
     

      {/* Marquee skeleton */}
      <div className="mb-12">
        <div className="flex gap-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-80 h-64 bg-white rounded-xl shadow-md border border-gray-200 p-6 animate-pulse"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
              </div>
              <div className="h-3 w-24 bg-gray-200 rounded mt-4 ml-auto"></div>
            </div>
          ))}
        </div>
      </div>

     
    </div>
  );

  // Error State Component
  if (error) {
    return (
      <div className="w-full px-6 py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-2xl mx-auto text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Reviews
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State Component
  if (!loading && reviews.length === 0) {
    return (
      <div className="w-full px-6 py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Patient Reviews</h2>
          <p className="text-gray-600">See what our patients say about us</p>
        </div>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ThumbsUp className="w-12 h-12 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Be the first to share your experience with us!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 py-12">
      {/* Header with Stats */}
     

      {/* Loading State */}
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Marquee Section */}
          {reviews.length > 0 && (
            <div className="mb-12">
              <div className="mb-4 px-2">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Featured Reviews
                </h3>
              </div>
              <Marquee
                pauseOnHover
                speed={40}
                gradient={true}
                gradientColor="rgb(249 250 251)"
                gradientWidth={100}
                className="py-4"
              >
                {reviews.slice(0, 8).map((review) => (
                  <div
                    key={review.id}
                    className="w-72 h-64 mx-3 bg-white rounded-xl shadow-lg border border-gray-100 p-5 flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {getInitials(review.patientname)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {review.patientname}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          {review.service}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      {renderStars(review.rating)}
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 flex-1 mb-4">
                      "{review.comment}"
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={12} />
                        {formatDate(review.created_at)}
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                        Verified
                      </span>
                    </div>
                  </div>
                ))}
              </Marquee>
            </div>
          )}

          {/* Grid Section */}
         
        </>
      )}
    </div>
  );
};

export default ReviewsComponent;