import React, { useState } from "react";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";

const ExperienceCard = ({ experience, userType, onLike, onDelete }) => {
  const [isLiked, setIsLiked] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleLikeClick = () => {
    setIsLiked((prev) => !prev);
    if (onLike) onLike();
  };

  const handleDeleteClick = () => {
    if (onDelete) onDelete();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="text-gray-400 mt-1">
          <HiOutlineUserCircle size={40} />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-800">
                {experience.studentName || "Anonymous"}
              </h3>
              <p className="text-gray-500 text-sm">
                {formatDate(experience.timestamp)}
              </p>
            </div>

            {userType === "coordinator" && (
              <button
                onClick={handleDeleteClick}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Delete experience"
              >
                <FaTrash size={16} />
              </button>
            )}
          </div>

          <div className="mt-3">
            <p className="text-gray-700">{experience.comment}</p>
          </div>

          <div className="mt-4 flex items-center">
            <button
              onClick={handleLikeClick}
              className="flex items-center gap-1 text-gray-500 hover:text-coral-red transition-colors"
            >
              {isLiked ? (
                <AiFillHeart size={18} className="text-coral-red" />
              ) : (
                <AiOutlineHeart size={18} />
              )}
              <span className="text-sm font-medium">
                {experience.likes || 0}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
