import React, { useState, useContext } from "react";
import ExperienceCard from "./ExperienceCard";
import { toastService } from "./Toast";
import api from "../API/index.js";
import { StudentCredContext } from "../contexts/StudentCredContext";
import { useStudentDetails } from "../contexts/StudentDetailsContext";

export default function ExperienceSection({
  driveId,
  experiences = [],
  setExperiences,
  hasApplied = false,
  isActive = true
}) {
  const [textAreaInput, setTextAreaInput] = useState("");
  const [addExperienceClicked, setAddExperienceClicked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get student context
  const { studentData } = useStudentDetails();
  const { authState, getUserRole } = useContext(StudentCredContext);
  const userType = getUserRole() || "student";

  // Ensure experiences is always an array
  const experiencesArray = Array.isArray(experiences) ? experiences : [];

  // Handle text area changes
  const handleTextAreaChange = (e) => {
    setTextAreaInput(e.target.value);
  };

  // Submit a new experience
  const handleSubmitExperience = async () => {
    if (!textAreaInput.trim()) {
      toastService.error("Please enter your experience");
      return;
    }

    try {
      setIsSubmitting(true);

      let apiEndpoint = `student/drive/add-experience/${driveId}`;

      // Use the appropriate API endpoint based on user type
      if (userType === "coordinator") {
        apiEndpoint = `coordinator/drive/add-experience/${driveId}`;
      }

      const response = await api.post(apiEndpoint, {
        comment: textAreaInput
      });

      if (response.status === 201) {
        // Add new experience to the list
        setExperiences([...experiencesArray, response.data.experience]);
        toastService.success("Experience shared successfully");
        setTextAreaInput("");
        setAddExperienceClicked(false);
      }
    } catch (error) {
      console.error("Error sharing experience:", error);

      let errorMessage = "Failed to share your experience";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        errorMessage = error.response.data;
      }

      toastService.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like an experience
  const handleLikeExperience = async (experienceId) => {
    try {
      const response = await api.post(
        `student/drive/like-experience/${driveId}/${experienceId}`
      );

      if (response.status === 200) {
        // Update experience likes in the UI
        const updatedExperiences = experiencesArray.map((exp) =>
          exp._id === experienceId
            ? { ...exp, likes: response.data.likes }
            : exp
        );

        setExperiences(updatedExperiences);
      }
    } catch (error) {
      console.error("Error liking experience:", error);
      toastService.error("Failed to like the experience");
    }
  };

  // Delete an experience (coordinator only)
  const handleDeleteExperience = async (experienceId) => {
    if (userType !== "coordinator") {
      toastService.error("Only coordinators can delete experiences");
      return;
    }

    try {
      const response = await api.delete(
        `coordinator/drive/experience/${driveId}/${experienceId}`
      );

      if (response.status === 200) {
        // Remove experience from the UI
        const filteredExperiences = experiencesArray.filter(
          (exp) => exp._id !== experienceId
        );
        setExperiences(filteredExperiences);
        toastService.success("Experience deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
      toastService.error("Failed to delete the experience");
    }
  };

  return (
    <div className="w-full font-ubuntu mt-8 mb-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mx-4 sm:mx-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          Student Experiences
        </h2>

        {userType === "student" && (
          <>
            {!addExperienceClicked ? (
              <button
                className="inline-block mb-6 text-coral-red hover:text-red-700 font-medium"
                onClick={() => setAddExperienceClicked(true)}
              >
                + Share Your Experience
              </button>
            ) : (
              <div className="mb-6">
                <textarea
                  placeholder="Share your experience with this drive..."
                  value={textAreaInput}
                  onChange={handleTextAreaChange}
                  className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-coral-red focus:border-coral-red"
                  rows={4}
                />
                <div className="flex gap-3 mt-2">
                  <button
                    className="px-4 py-2 bg-coral-red text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                    onClick={handleSubmitExperience}
                    disabled={isSubmitting || !textAreaInput.trim()}
                  >
                    {isSubmitting ? "Posting..." : "Post Experience"}
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    onClick={() => {
                      setAddExperienceClicked(false);
                      setTextAreaInput("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {userType === "coordinator" && (
          <>
            {!addExperienceClicked ? (
              <button
                className="inline-block mb-6 text-coral-red hover:text-red-700 font-medium"
                onClick={() => setAddExperienceClicked(true)}
              >
                + Add Experience (as Coordinator)
              </button>
            ) : (
              <div className="mb-6">
                <textarea
                  placeholder="Share an experience or insight about this drive..."
                  value={textAreaInput}
                  onChange={handleTextAreaChange}
                  className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-coral-red focus:border-coral-red"
                  rows={4}
                />
                <div className="flex gap-3 mt-2">
                  <button
                    className="px-4 py-2 bg-coral-red text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                    onClick={handleSubmitExperience}
                    disabled={isSubmitting || !textAreaInput.trim()}
                  >
                    {isSubmitting ? "Posting..." : "Post Experience"}
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    onClick={() => {
                      setAddExperienceClicked(false);
                      setTextAreaInput("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {experiencesArray.length > 0 ? (
          <div className="space-y-4">
            {experiencesArray.map((experience) => (
              <ExperienceCard
                key={experience._id}
                experience={experience}
                userType={userType}
                onLike={() => handleLikeExperience(experience._id)}
                onDelete={() => handleDeleteExperience(experience._id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>
              No experiences shared yet. Be the first to share your experience!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
