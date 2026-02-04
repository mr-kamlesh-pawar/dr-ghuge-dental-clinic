import axios from "axios";
import React from "react";
import Marquee from "react-fast-marquee";

const ReviewsComponent = async () => {
  const { data: reviews } = await axios.get(
    "http://localhost:3000/api/dental-reviews",
  );

  const renderStars = (rating) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="w-full px-6 py-12 overflow-hidden">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Patient Reviews</h2>
        <p className="text-gray-600">See what our patients say about us</p>
      </div>

      <Marquee pauseOnHover speed={50} gradient={false}>
        {reviews.map((review) => (
          <div
            key={review.id}
            className="w-80 h-60 mx-4 bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {review.patientname}
              </h3>

              <p className="text-sm text-gray-500 line-clamp-1">
                {review.service}
              </p>
            </div>

            {renderStars(review.rating)}

            <p className="text-gray-700 text-sm leading-relaxed line-clamp-6">
              {review.comment}
            </p>

            <p className="text-xs text-gray-400 text-right">
              {formatDate(review.created_at)}
            </p>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default ReviewsComponent;
