import React, { useState, useEffect } from "react";
import API from "../API";
import Toast from "./Toast";

const Results = ({ driveId, driveData }) => {
  const [resultsData, setResultsData] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [studentResults, setStudentResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

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
      showToast("Failed to fetch results data", "error");
    }
  };

  // Fetch eligible students for current round
  const fetchEligibleStudents = async (roundNumber) => {
    try {
      const response = await API.get(
        `/coordinator/drive/round-eligible/${driveId}/${roundNumber}`
      );
      setEligibleStudents(response.data.eligible_students);

      // Initialize student results state - default to no selection
      const initialResults = {};
      response.data.eligible_students.forEach((student) => {
        initialResults[student.student_id] = ""; // No default selection
      });
      setStudentResults(initialResults);
    } catch (error) {
      console.error("Error fetching eligible students:", error);
      showToast("Failed to fetch eligible students", "error");
    }
  };

  useEffect(() => {
    fetchResultsData();
  }, [driveId]);

  // Start results process
  const handleStartResults = async () => {
    if (driveData?.acceptingApplications !== false) {
      showToast("Please end applications before starting results", "error");
      return;
    }

    try {
      setLoading(true);
      await API.post(`/coordinator/drive/start-results/${driveId}`);
      showToast("Results process started successfully!", "success");
      fetchResultsData();
    } catch (error) {
      console.error("Error starting results:", error);
      showToast(
        error.response?.data?.message || "Failed to start results",
        "error"
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
      showToast(
        "Please select a status for all students before publishing results",
        "error"
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

      showToast(response.data.message, "success");
      fetchResultsData();

      // Reset student results for next round
      setStudentResults({});
    } catch (error) {
      console.error("Error publishing results:", error);
      showToast(
        error.response?.data?.message || "Failed to publish results",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Navigate to specific round
  const handleRoundChange = (roundNumber) => {
    setCurrentRound(roundNumber);
    fetchEligibleStudents(roundNumber);
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
      showToast("Results reset successfully!", "success");
      fetchResultsData();
      setStudentResults({});
    } catch (error) {
      console.error("Error resetting results:", error);
      showToast("Failed to reset results", "error");
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
    currentRound <= resultsData.current_result_round && !isRoundPublished;

  // Get counts for current round results
  const getResultCounts = () => {
    const shortlisted = Object.values(studentResults).filter(
      (status) => status === "shortlisted"
    ).length;
    const rejected = Object.values(studentResults).filter(
      (status) => status === "rejected"
    ).length;
    const waitlisted = Object.values(studentResults).filter(
      (status) => status === "waitlisted"
    ).length;
    return { shortlisted, rejected, waitlisted };
  };

  const { shortlisted, rejected, waitlisted } = getResultCounts();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Toast toast={toast} closeToast={closeToast} />

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Results Management
            </h2>
            <p className="text-gray-600 mt-1">
              Total Applicants: {resultsData.total_applicants} | Total Rounds:{" "}
              {resultsData.total_rounds}
            </p>
          </div>

          {!resultsData.results_started ? (
            <button
              onClick={handleStartResults}
              disabled={loading || driveData?.acceptingApplications !== false}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Starting..." : "Start Results Process"}
            </button>
          ) : (
            <button
              onClick={handleResetResults}
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
            >
              Reset Results
            </button>
          )}
        </div>

        {driveData?.acceptingApplications && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              ⚠️ Applications are still being accepted. Please end applications
              before starting the results process.
            </p>
          </div>
        )}
      </div>

      {/* Round Navigation */}
      {resultsData.results_started && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
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
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    isCurrent
                      ? "bg-blue-600 text-white border-blue-600"
                      : isPublished
                      ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                      : isAccessible
                      ? "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  <div className="text-sm font-medium">
                    Round {round.round_number}
                  </div>
                  <div className="text-xs">{round.round_name}</div>
                  {isPublished && <div className="text-xs">✓ Published</div>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Current Round Results */}
      {resultsData.results_started && eligibleStudents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold">
                Round {currentRound}:{" "}
                {
                  resultsData.rounds.find(
                    (r) => r.round_number === currentRound
                  )?.round_name
                }
              </h3>
              <p className="text-gray-600">
                Eligible Students: {eligibleStudents.length}
              </p>
            </div>

            {canPublishCurrentRound && (
              <button
                onClick={handlePublishResults}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {loading ? "Publishing..." : "Publish Results"}
              </button>
            )}
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-800">
                {shortlisted}
              </div>
              <div className="text-sm text-green-600">Shortlisted</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-800">{rejected}</div>
              <div className="text-sm text-red-600">Rejected</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-800">
                {waitlisted}
              </div>
              <div className="text-sm text-yellow-600">Waitlisted</div>
            </div>
          </div>

          {/* Student List with Radio Buttons */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 mb-4">
              Select Status for Each Student:
            </h4>
            {eligibleStudents.map((student, index) => (
              <div
                key={student.student_id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-500">
                        #{index + 1}
                      </span>
                      <div>
                        <div className="font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {student.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          Current Status: {student.current_status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {!isRoundPublished && (
                    <div className="flex space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`student-${student.student_id}`}
                          value="shortlisted"
                          checked={
                            studentResults[student.student_id] === "shortlisted"
                          }
                          onChange={(e) =>
                            handleStudentResultChange(
                              student.student_id,
                              e.target.value
                            )
                          }
                          className="text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-green-700">
                          Shortlisted
                        </span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`student-${student.student_id}`}
                          value="rejected"
                          checked={
                            studentResults[student.student_id] === "rejected"
                          }
                          onChange={(e) =>
                            handleStudentResultChange(
                              student.student_id,
                              e.target.value
                            )
                          }
                          className="text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-red-700">
                          Rejected
                        </span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`student-${student.student_id}`}
                          value="waitlisted"
                          checked={
                            studentResults[student.student_id] === "waitlisted"
                          }
                          onChange={(e) =>
                            handleStudentResultChange(
                              student.student_id,
                              e.target.value
                            )
                          }
                          className="text-yellow-600 focus:ring-yellow-500"
                        />
                        <span className="text-sm font-medium text-yellow-700">
                          Waitlisted
                        </span>
                      </label>
                    </div>
                  )}

                  {isRoundPublished && (
                    <div className="text-sm font-medium">
                      {(() => {
                        const roundResult = resultsData.round_results?.find(
                          (r) => r.round_number === currentRound
                        );
                        if (
                          roundResult?.selected_students?.includes(
                            student.student_id
                          )
                        ) {
                          return (
                            <span className="text-green-700 bg-green-100 px-2 py-1 rounded">
                              Shortlisted
                            </span>
                          );
                        } else if (
                          roundResult?.rejected_students?.includes(
                            student.student_id
                          )
                        ) {
                          return (
                            <span className="text-red-700 bg-red-100 px-2 py-1 rounded">
                              Rejected
                            </span>
                          );
                        } else if (
                          roundResult?.waitlisted_students?.includes(
                            student.student_id
                          )
                        ) {
                          return (
                            <span className="text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                              Waitlisted
                            </span>
                          );
                        }
                        return <span className="text-gray-500">No Status</span>;
                      })()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isRoundPublished && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✓ Results for Round {currentRound} have been published
              </p>
            </div>
          )}
        </div>
      )}

      {resultsData.results_started && eligibleStudents.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <p className="text-gray-600">
            No eligible students for Round {currentRound}
          </p>
        </div>
      )}
    </div>
  );
};

export default Results;
