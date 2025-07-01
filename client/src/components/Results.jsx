import React, { useState, useEffect } from "react";
import API from "../API";
import { toastService } from "./Toast";

const Results = ({ driveId, driveData }) => {
  const [resultsData, setResultsData] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [studentResults, setStudentResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [isOfferAcceptanceRound, setIsOfferAcceptanceRound] = useState(false);

  // Fetch results data
  const fetchResultsData = async () => {
    try {
      const response = await API.get(`/coordinator/drive/results/${driveId}`);
      setResultsData(response.data);
      setCurrentRound(response.data.current_result_round);

      if (response.data.results_started) {
        fetchEligibleStudents(response.data.current_result_round);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      toastService.error("Failed to fetch results data");
    }
  };

  // Fetch eligible students for current round
  const fetchEligibleStudents = async (roundNumber) => {
    try {
      const response = await API.get(
        `/coordinator/drive/round-eligible/${driveId}/${roundNumber}`
      );
      setEligibleStudents(response.data.eligible_students);
      setIsOfferAcceptanceRound(response.data.is_offer_acceptance || false);

      // Initialize student results state - default to no selection or load existing results
      const initialResults = {};
      const roundResult = resultsData?.round_results?.find(
        (r) => r.round_number === roundNumber
      );

      response.data.eligible_students.forEach((student) => {
        // If results are published, load existing selections
        if (roundResult?.is_published) {
          if (response.data.is_offer_acceptance) {
            // For offer acceptance round
            if (
              roundResult.offer_accepted_students?.includes(student.student_id)
            ) {
              initialResults[student.student_id] = "accepted";
            } else if (
              roundResult.offer_rejected_students?.includes(student.student_id)
            ) {
              initialResults[student.student_id] = "rejected";
            } else {
              initialResults[student.student_id] = "";
            }
          } else {
            // For regular rounds
            if (roundResult.selected_students?.includes(student.student_id)) {
              initialResults[student.student_id] = "shortlisted";
            } else if (
              roundResult.rejected_students?.includes(student.student_id)
            ) {
              initialResults[student.student_id] = "rejected";
            } else if (
              roundResult.waitlisted_students?.includes(student.student_id)
            ) {
              initialResults[student.student_id] = "waitlisted";
            } else {
              initialResults[student.student_id] = "";
            }
          }
        } else {
          initialResults[student.student_id] = ""; // No default selection for unpublished results
        }
      });
      setStudentResults(initialResults);
    } catch (error) {
      console.error("Error fetching eligible students:", error);
      toastService.error("Failed to fetch eligible students");
    }
  };

  useEffect(() => {
    fetchResultsData();
  }, [driveId]);

  // Start results process
  const handleStartResults = async () => {
    if (driveData?.acceptingApplications !== false) {
      toastService.error("Please end applications before starting results");
      return;
    }

    try {
      setLoading(true);
      await API.post(`/coordinator/drive/start-results/${driveId}`);
      toastService.success("Results process started successfully!");
      fetchResultsData();
    } catch (error) {
      console.error("Error starting results:", error);
      toastService.error(
        error.response?.data?.message || "Failed to start results"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle student result change
  const handleStudentResultChange = (studentId, status) => {
    setStudentResults((prev) => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Publish results for current round
  const handlePublishResults = async () => {
    // Check if all students have a status selected
    const unselectedStudents = Object.entries(studentResults).filter(
      ([_, status]) => !status
    );
    if (unselectedStudents.length > 0) {
      toastService.error(
        "Please select a status for all students before publishing results"
      );
      return;
    }

    try {
      setLoading(true);
      const response = await API.post(
        `/coordinator/drive/publish-results/${driveId}/${currentRound}`,
        {
          student_results: studentResults
        }
      );

      const isUpdate = editMode;
      toastService.success(
        isUpdate
          ? `Round ${currentRound} results updated successfully!`
          : response.data.message
      );

      setEditMode(false);

      // Store the current working round before fetching data
      const workingRound = currentRound;

      try {
        // Fetch updated results data first
        const response = await API.get(`/coordinator/drive/results/${driveId}`);
        setResultsData(response.data);

        // Stay on the same round the user was working on
        setCurrentRound(workingRound);

        // Now fetch eligible students with the updated results data
        const studentsResponse = await API.get(
          `/coordinator/drive/round-eligible/${driveId}/${workingRound}`
        );
        setEligibleStudents(studentsResponse.data.eligible_students);
        setIsOfferAcceptanceRound(
          studentsResponse.data.is_offer_acceptance || false
        );

        // Load the newly published results for display
        const initialResults = {};
        const roundResult = response.data.round_results?.find(
          (r) => r.round_number === workingRound
        );

        studentsResponse.data.eligible_students.forEach((student) => {
          if (roundResult?.is_published) {
            if (studentsResponse.data.is_offer_acceptance) {
              // For offer acceptance round
              if (
                roundResult.offer_accepted_students?.includes(
                  student.student_id
                )
              ) {
                initialResults[student.student_id] = "accepted";
              } else if (
                roundResult.offer_rejected_students?.includes(
                  student.student_id
                )
              ) {
                initialResults[student.student_id] = "rejected";
              } else {
                initialResults[student.student_id] = "";
              }
            } else {
              // For regular rounds
              if (roundResult.selected_students?.includes(student.student_id)) {
                initialResults[student.student_id] = "shortlisted";
              } else if (
                roundResult.rejected_students?.includes(student.student_id)
              ) {
                initialResults[student.student_id] = "rejected";
              } else if (
                roundResult.waitlisted_students?.includes(student.student_id)
              ) {
                initialResults[student.student_id] = "waitlisted";
              } else {
                initialResults[student.student_id] = "";
              }
            }
          } else {
            initialResults[student.student_id] = "";
          }
        });
        setStudentResults(initialResults);
      } catch (refreshError) {
        console.error("Error refreshing data after publish:", refreshError);
        toastService.error("Results published but failed to refresh display");
      }
    } catch (error) {
      console.error("Error publishing results:", error);
      toastService.error(
        error.response?.data?.message || "Failed to publish results"
      );
    } finally {
      setLoading(false);
    }
  };

  // Navigate to specific round
  const handleRoundChange = (roundNumber) => {
    setCurrentRound(roundNumber);
    setEditMode(false); // Exit edit mode when changing rounds
    fetchEligibleStudents(roundNumber);
    setSearchText(""); // Clear search when changing rounds
  };

  // Enable edit mode for published results
  const handleEditResults = () => {
    setEditMode(true);
    toastService.info("Edit mode enabled. You can now modify the results.");
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditMode(false);
    // Reload original results
    fetchEligibleStudents(currentRound);
    toastService.info("Edit cancelled. Original results restored.");
  };

  // Reset entire results process
  const handleResetResults = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all results? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await API.post(`/coordinator/drive/reset-results/${driveId}`);
      toastService.success("Results reset successfully!");
      setEditMode(false);
      fetchResultsData();
      setStudentResults({});
    } catch (error) {
      console.error("Error resetting results:", error);
      toastService.error("Failed to reset results");
    } finally {
      setLoading(false);
    }
  };

  if (!resultsData) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const isRoundPublished = resultsData.round_results?.find(
    (r) => r.round_number === currentRound
  )?.is_published;
  const canPublishCurrentRound =
    (currentRound <= resultsData.current_result_round ||
      isOfferAcceptanceRound) &&
    !isRoundPublished;
  const canEditResults = isRoundPublished && !editMode;
  const isInEditMode = isRoundPublished && editMode;

  // Filter eligible students based on search text
  const filteredStudents = eligibleStudents.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      student.student_id?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Get counts for current round results based on filtered students
  const getResultCounts = () => {
    if (isOfferAcceptanceRound) {
      const accepted = Object.entries(studentResults).filter(
        ([studentId, status]) =>
          status === "accepted" &&
          filteredStudents.some((student) => student.student_id === studentId)
      ).length;
      const rejected = Object.entries(studentResults).filter(
        ([studentId, status]) =>
          status === "rejected" &&
          filteredStudents.some((student) => student.student_id === studentId)
      ).length;
      return { accepted, rejected, waitlisted: 0 };
    } else {
      const shortlisted = Object.entries(studentResults).filter(
        ([studentId, status]) =>
          status === "shortlisted" &&
          filteredStudents.some((student) => student.student_id === studentId)
      ).length;
      const rejected = Object.entries(studentResults).filter(
        ([studentId, status]) =>
          status === "rejected" &&
          filteredStudents.some((student) => student.student_id === studentId)
      ).length;
      const waitlisted = Object.entries(studentResults).filter(
        ([studentId, status]) =>
          status === "waitlisted" &&
          filteredStudents.some((student) => student.student_id === studentId)
      ).length;
      return { shortlisted, rejected, waitlisted };
    }
  };

  const resultCounts = getResultCounts();
  const { shortlisted, rejected, waitlisted, accepted } = resultCounts;

  return (
    <div className="font-ubuntu max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Results Management
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Total Applicants: {resultsData.total_applicants} | Total Rounds:{" "}
              {resultsData.total_rounds}
            </p>
          </div>

          {!resultsData.results_started ? (
            <button
              onClick={handleStartResults}
              disabled={loading || driveData?.acceptingApplications !== false}
              className="px-4 py-2 bg-coral-red text-white rounded-lg hover:bg-coral-red/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {loading ? "Starting..." : "Start Results Process"}
            </button>
          ) : (
            <button
              onClick={handleResetResults}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
            >
              Reset Results
            </button>
          )}
        </div>

        {driveData?.acceptingApplications && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ Applications are still being accepted. Please end applications
              before starting the results process.
            </p>
          </div>
        )}
      </div>

      {/* Round Navigation */}
      {resultsData.results_started && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Round Navigation</h3>
          <div className="flex flex-wrap gap-2">
            {resultsData.rounds.map((round) => {
              const roundResult = resultsData.round_results?.find(
                (r) => r.round_number === round.round_number
              );
              const isPublished = roundResult?.is_published;
              const isCurrent = round.round_number === currentRound;
              const isAccessible =
                round.round_number <= resultsData.current_result_round;

              return (
                <button
                  key={round.round_number}
                  onClick={() => handleRoundChange(round.round_number)}
                  disabled={!isAccessible}
                  className={`px-3 py-2 rounded-lg border transition-colors text-sm ${
                    isCurrent
                      ? "bg-coral-red text-white border-coral-red"
                      : isPublished
                      ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                      : isAccessible
                      ? "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  <div className="font-medium">Round {round.round_number}</div>
                  <div className="text-xs">{round.round_name}</div>
                  {isPublished && <div className="text-xs">✓ Published</div>}
                </button>
              );
            })}

            {/* Offer Acceptance Round */}
            {resultsData.rounds.length > 0 &&
              resultsData.round_results?.find(
                (r) => r.round_number === resultsData.rounds.length
              )?.is_published && (
                <button
                  onClick={() =>
                    handleRoundChange(resultsData.rounds.length + 1)
                  }
                  className={`px-3 py-2 rounded-lg border transition-colors text-sm ${
                    currentRound === resultsData.rounds.length + 1
                      ? "bg-coral-red text-white border-coral-red"
                      : resultsData.round_results?.find(
                          (r) =>
                            r.round_number === resultsData.rounds.length + 1
                        )?.is_published
                      ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                      : "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                  }`}
                >
                  <div className="font-medium">Offer Acceptance</div>
                  <div className="text-xs">Final Round</div>
                  {resultsData.round_results?.find(
                    (r) => r.round_number === resultsData.rounds.length + 1
                  )?.is_published && <div className="text-xs">✓ Published</div>}
                </button>
              )}
          </div>
        </div>
      )}

      {/* Current Round Results */}
      {resultsData.results_started && eligibleStudents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-4 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold">
                {isOfferAcceptanceRound ? (
                  "Offer Acceptance: Final Round"
                ) : (
                  <>
                    Round {currentRound}:{" "}
                    {
                      resultsData.rounds.find(
                        (r) => r.round_number === currentRound
                      )?.round_name
                    }
                  </>
                )}
              </h3>
              <p className="text-gray-600 text-sm">
                Eligible Students: {eligibleStudents.length}
                {isInEditMode && (
                  <span className="ml-2 text-orange-600 font-medium">
                    (Edit Mode)
                  </span>
                )}
              </p>
            </div>

            <div className="flex gap-2">
              {canPublishCurrentRound && (
                <button
                  onClick={handlePublishResults}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
                >
                  {loading ? "Publishing..." : "Publish Results"}
                </button>
              )}

              {canEditResults && (
                <button
                  onClick={handleEditResults}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                >
                  Edit Results
                </button>
              )}

              {isInEditMode && (
                <>
                  <button
                    onClick={handlePublishResults}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
                  >
                    {loading ? "Updating..." : "Update Results"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Edit Mode Notice */}
          {isInEditMode && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-orange-600 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-orange-800 font-medium">
                    Editing Published Results
                  </p>
                  <p className="text-orange-700 text-sm">
                    You can modify the selections below. Click "Update Results"
                    to save changes or "Cancel" to discard them.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Search Controls */}
          {eligibleStudents.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search by name, email, or student ID..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="p-2 pl-8 w-full sm:w-64 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-coral-red"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400 absolute left-2 top-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>
                  Total Students: <strong>{eligibleStudents.length}</strong>
                </span>
                <span>
                  Showing: <strong>{filteredStudents.length}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div
            className={`grid gap-4 mb-6 ${
              isOfferAcceptanceRound ? "grid-cols-2" : "grid-cols-3"
            }`}
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-800">
                {isOfferAcceptanceRound ? accepted : shortlisted}
              </div>
              <div className="text-xs text-green-600">
                {isOfferAcceptanceRound ? "Accepted" : "Shortlisted"}
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-red-800">{rejected}</div>
              <div className="text-xs text-red-600">Rejected</div>
            </div>
            {!isOfferAcceptanceRound && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-yellow-800">
                  {waitlisted}
                </div>
                <div className="text-xs text-yellow-600">Waitlisted</div>
              </div>
            )}
          </div>

          {/* Student List with Column Headers */}
          {(!isRoundPublished || isInEditMode) &&
            filteredStudents.length > 0 && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">
                          Student
                        </th>
                        <th className="text-center py-3 px-4 font-medium text-green-700">
                          {isOfferAcceptanceRound ? "Accepted" : "Shortlisted"}
                        </th>
                        <th className="text-center py-3 px-4 font-medium text-red-700">
                          Rejected
                        </th>
                        {!isOfferAcceptanceRound && (
                          <th className="text-center py-3 px-4 font-medium text-yellow-700">
                            Waitlisted
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, index) => (
                        <tr
                          key={student.student_id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-500">
                                #{index + 1}
                              </span>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {student.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {student.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <input
                              type="radio"
                              name={`student-${student.student_id}`}
                              value={
                                isOfferAcceptanceRound
                                  ? "accepted"
                                  : "shortlisted"
                              }
                              checked={
                                studentResults[student.student_id] ===
                                (isOfferAcceptanceRound
                                  ? "accepted"
                                  : "shortlisted")
                              }
                              onChange={(e) =>
                                handleStudentResultChange(
                                  student.student_id,
                                  e.target.value
                                )
                              }
                              className="text-green-600 focus:ring-green-500"
                            />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <input
                              type="radio"
                              name={`student-${student.student_id}`}
                              value="rejected"
                              checked={
                                studentResults[student.student_id] ===
                                "rejected"
                              }
                              onChange={(e) =>
                                handleStudentResultChange(
                                  student.student_id,
                                  e.target.value
                                )
                              }
                              className="text-red-600 focus:ring-red-500"
                            />
                          </td>
                          {!isOfferAcceptanceRound && (
                            <td className="py-3 px-4 text-center">
                              <input
                                type="radio"
                                name={`student-${student.student_id}`}
                                value="waitlisted"
                                checked={
                                  studentResults[student.student_id] ===
                                  "waitlisted"
                                }
                                onChange={(e) =>
                                  handleStudentResultChange(
                                    student.student_id,
                                    e.target.value
                                  )
                                }
                                className="text-yellow-600 focus:ring-yellow-500"
                              />
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          {/* No search results */}
          {(!isRoundPublished || isInEditMode) &&
            filteredStudents.length === 0 &&
            searchText && (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-700">
                  No students found
                </h3>
                <p className="text-gray-500 mt-2">
                  No students match your search criteria "{searchText}"
                </p>
                <button
                  onClick={() => setSearchText("")}
                  className="mt-4 px-4 py-2 text-sm bg-coral-red text-white rounded-lg hover:bg-coral-red/90 transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}

          {/* Published Results View */}
          {isRoundPublished && !isInEditMode && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Published Results:</h4>
              {filteredStudents.map((student, index) => {
                const roundResult = resultsData.round_results?.find(
                  (r) => r.round_number === currentRound
                );
                let status = "No Status";
                let statusClass = "bg-gray-100 text-gray-600";

                if (isOfferAcceptanceRound) {
                  if (
                    roundResult?.offer_accepted_students?.includes(
                      student.student_id
                    )
                  ) {
                    status = "Offer Accepted";
                    statusClass = "bg-green-100 text-green-800";
                  } else if (
                    roundResult?.offer_rejected_students?.includes(
                      student.student_id
                    )
                  ) {
                    status = "Offer Rejected";
                    statusClass = "bg-red-100 text-red-800";
                  }
                } else {
                  if (
                    roundResult?.selected_students?.includes(student.student_id)
                  ) {
                    status = "Shortlisted";
                    statusClass = "bg-green-100 text-green-800";
                  } else if (
                    roundResult?.rejected_students?.includes(student.student_id)
                  ) {
                    status = "Rejected";
                    statusClass = "bg-red-100 text-red-800";
                  } else if (
                    roundResult?.waitlisted_students?.includes(
                      student.student_id
                    )
                  ) {
                    status = "Waitlisted";
                    statusClass = "bg-yellow-100 text-yellow-800";
                  }
                }

                return (
                  <div
                    key={student.student_id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">
                        #{index + 1}
                      </span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {student.email}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${statusClass}`}
                    >
                      {status}
                    </span>
                  </div>
                );
              })}

              {/* No search results for published results */}
              {filteredStudents.length === 0 && searchText && (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-700">
                    No students found
                  </h3>
                  <p className="text-gray-500 mt-2">
                    No students match your search criteria "{searchText}"
                  </p>
                  <button
                    onClick={() => setSearchText("")}
                    className="mt-4 px-4 py-2 text-sm bg-coral-red text-white rounded-lg hover:bg-coral-red/90 transition-colors"
                  >
                    Clear search
                  </button>
                </div>
              )}

              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium text-sm">
                  ✓ Results for Round {currentRound} have been published
                  {resultsData.round_results?.find(
                    (r) => r.round_number === currentRound
                  )?.published_at && (
                    <span className="ml-2 text-green-600 font-normal">
                      on{" "}
                      {new Date(
                        resultsData.round_results.find(
                          (r) => r.round_number === currentRound
                        ).published_at
                      ).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {resultsData.results_started && eligibleStudents.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-4 text-center">
          <p className="text-gray-600">
            No eligible students for Round {currentRound}
          </p>
        </div>
      )}
    </div>
  );
};

export default Results;
