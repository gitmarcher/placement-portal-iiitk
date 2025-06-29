import React, { useState, useEffect } from "react";
import { toastService } from "./Toast";
import api from "../API/index";

export default function StudentDriveForm({
  details,
  drive,
  editMode = false,
  onBack
}) {
  const [formData, setFormData] = useState({
    fullName: details?.name || "",
    email: details?.email_id || "",
    phone: details?.phone_no?.[0] || "",
    cgpa: details?.academics?.cgpa || "",
    resumeLink: details?.resume_link || "",
    result10th: details?.academics?.tenth_percentage || "",
    result12th: details?.academics?.twelfth_percentage || "",
    course: details?.stream || ""
  });

  // State for custom field responses
  const [customFieldResponses, setCustomFieldResponses] = useState({});
  const [customQuestionResponses, setCustomQuestionResponses] = useState({});

  const [submitting, setSubmitting] = useState(false);
  const isReadOnly =
    (drive && drive.hasApplied && !editMode) || (drive && !drive.isActive);
  const [validationErrors, setValidationErrors] = useState([]);

  // Update form data when details change
  useEffect(() => {
    if (details) {
      setFormData({
        fullName: details.name || "",
        email: details.email_id || "",
        phone: details.phone_no?.[0] || "",
        cgpa: details.academics?.cgpa || "",
        resumeLink: details.resume_link || "",
        result10th: details.academics?.tenth_percentage || "",
        result12th: details.academics?.twelfth_percentage || "",
        course: details.stream || ""
      });
    }
  }, [details]);

  // Load existing custom field responses if in edit mode
  useEffect(() => {
    const loadExistingResponses = async () => {
      if (editMode && drive?.hasApplied) {
        try {
          const response = await api.get(
            `/student/drive/application-details/${drive._id}`
          );
          if (response.data.application) {
            const { custom_field_responses, custom_question_responses } =
              response.data.application;

            // Convert arrays to objects for easier management
            if (custom_field_responses) {
              const fieldResponsesObj = {};
              custom_field_responses.forEach((response) => {
                fieldResponsesObj[response.field_id] = response.field_value;
              });
              setCustomFieldResponses(fieldResponsesObj);
            }

            if (custom_question_responses) {
              const questionResponsesObj = {};
              custom_question_responses.forEach((response) => {
                questionResponsesObj[response.question_id] = response.answer;
              });
              setCustomQuestionResponses(questionResponsesObj);
            }
          }
        } catch (error) {
          console.error("Error loading existing responses:", error);
        }
      }
    };

    loadExistingResponses();
  }, [editMode, drive?._id, drive?.hasApplied]);

  const handleChange = (e) => {
    if (isReadOnly) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCustomFieldChange = (fieldId, value) => {
    if (isReadOnly) return;
    setCustomFieldResponses((prev) => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleCustomQuestionChange = (questionId, value) => {
    if (isReadOnly) return;
    setCustomQuestionResponses((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const renderCustomField = (field) => {
    const value = customFieldResponses[field.field_id] || "";

    switch (field.field_type) {
      case "text":
      case "url":
        return (
          <input
            type={field.field_type}
            value={value}
            onChange={(e) =>
              handleCustomFieldChange(field.field_id, e.target.value)
            }
            placeholder={field.placeholder}
            maxLength={field.max_length}
            readOnly={isReadOnly}
            className={`mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:bg-transparent ${
              isReadOnly ? "text-gray-500 bg-gray-50" : ""
            }`}
          />
        );

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) =>
              handleCustomFieldChange(field.field_id, e.target.value)
            }
            placeholder={field.placeholder}
            maxLength={field.max_length}
            rows="3"
            readOnly={isReadOnly}
            className={`mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:bg-transparent ${
              isReadOnly ? "text-gray-500 bg-gray-50" : ""
            }`}
          />
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) =>
              handleCustomFieldChange(field.field_id, e.target.value)
            }
            disabled={isReadOnly}
            className={`mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:bg-transparent ${
              isReadOnly ? "text-gray-500 bg-gray-50" : ""
            }`}
          >
            <option value="">Select an option</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) =>
              handleCustomFieldChange(field.field_id, e.target.value)
            }
            placeholder={field.placeholder}
            readOnly={isReadOnly}
            className={`mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:bg-transparent ${
              isReadOnly ? "text-gray-500 bg-gray-50" : ""
            }`}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) =>
              handleCustomFieldChange(field.field_id, e.target.value)
            }
            readOnly={isReadOnly}
            className={`mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:bg-transparent ${
              isReadOnly ? "text-gray-500 bg-gray-50" : ""
            }`}
          />
        );

      case "file":
        return (
          <input
            type="url"
            value={value}
            onChange={(e) =>
              handleCustomFieldChange(field.field_id, e.target.value)
            }
            placeholder="Enter file URL (e.g., Google Drive link)"
            readOnly={isReadOnly}
            className={`mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:bg-transparent ${
              isReadOnly ? "text-gray-500 bg-gray-50" : ""
            }`}
          />
        );

      default:
        return null;
    }
  };

  const renderCustomQuestion = (question) => {
    const value = customQuestionResponses[question.question_id] || "";

    switch (question.question_type) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) =>
              handleCustomQuestionChange(question.question_id, e.target.value)
            }
            placeholder={question.placeholder}
            maxLength={question.max_length}
            readOnly={isReadOnly}
            className={`mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:bg-transparent ${
              isReadOnly ? "text-gray-500 bg-gray-50" : ""
            }`}
          />
        );

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) =>
              handleCustomQuestionChange(question.question_id, e.target.value)
            }
            placeholder={question.placeholder}
            maxLength={question.max_length}
            rows="4"
            readOnly={isReadOnly}
            className={`mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:bg-transparent ${
              isReadOnly ? "text-gray-500 bg-gray-50" : ""
            }`}
          />
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) =>
              handleCustomQuestionChange(question.question_id, e.target.value)
            }
            disabled={isReadOnly}
            className={`mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:bg-transparent ${
              isReadOnly ? "text-gray-500 bg-gray-50" : ""
            }`}
          >
            <option value="">Select an option</option>
            {question.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="mt-2 space-y-2">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={question.question_id}
                  value={option}
                  checked={value === option}
                  onChange={(e) =>
                    handleCustomQuestionChange(
                      question.question_id,
                      e.target.value
                    )
                  }
                  disabled={isReadOnly}
                  className="mr-2"
                />
                <span className={isReadOnly ? "text-gray-500" : ""}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        const checkedValues = Array.isArray(value) ? value : [];
        return (
          <div className="mt-2 space-y-2">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  value={option}
                  checked={checkedValues.includes(option)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...checkedValues, option]
                      : checkedValues.filter((v) => v !== option);
                    handleCustomQuestionChange(question.question_id, newValues);
                  }}
                  disabled={isReadOnly}
                  className="mr-2"
                />
                <span className={isReadOnly ? "text-gray-500" : ""}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) =>
              handleCustomQuestionChange(question.question_id, e.target.value)
            }
            placeholder={question.placeholder}
            readOnly={isReadOnly}
            className={`mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:bg-transparent ${
              isReadOnly ? "text-gray-500 bg-gray-50" : ""
            }`}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) =>
              handleCustomQuestionChange(question.question_id, e.target.value)
            }
            readOnly={isReadOnly}
            className={`mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:bg-transparent ${
              isReadOnly ? "text-gray-500 bg-gray-50" : ""
            }`}
          />
        );

      case "file":
        return (
          <input
            type="url"
            value={value}
            onChange={(e) =>
              handleCustomQuestionChange(question.question_id, e.target.value)
            }
            placeholder="Enter file URL (e.g., Google Drive link)"
            readOnly={isReadOnly}
            className={`mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:bg-transparent ${
              isReadOnly ? "text-gray-500 bg-gray-50" : ""
            }`}
          />
        );

      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors([]);

    if (isReadOnly && !editMode) {
      toastService.info("You are in view-only mode");
      return;
    }

    if (!drive?.isActive) {
      toastService.warning("This drive is no longer accepting applications");
      return;
    }

    // Client-side validation
    const errors = [];
    if (!formData.resumeLink.trim()) {
      errors.push("Resume link is required");
    }
    if (!formData.phone.trim()) {
      errors.push("Phone number is required");
    }

    // Validate custom required details
    if (drive.custom_required_details) {
      drive.custom_required_details.forEach((field) => {
        if (field.is_required) {
          const value = customFieldResponses[field.field_id];
          if (!value || (typeof value === "string" && !value.trim())) {
            errors.push(`${field.field_label} is required`);
          }
        }
      });
    }

    // Validate custom questions
    if (drive.custom_questions) {
      drive.custom_questions.forEach((question) => {
        if (question.is_required) {
          const value = customQuestionResponses[question.question_id];
          if (
            !value ||
            (typeof value === "string" && !value.trim()) ||
            (Array.isArray(value) && value.length === 0)
          ) {
            errors.push(`${question.question_text} is required`);
          }
        }
      });
    }

    // Basic URL validation for resume link
    const urlRegex =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (
      formData.resumeLink.trim() &&
      !urlRegex.test(formData.resumeLink.trim())
    ) {
      errors.push("Please enter a valid resume link");
    }

    // Basic phone validation
    const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,15}$/;
    if (formData.phone.trim() && !phoneRegex.test(formData.phone.trim())) {
      errors.push("Please enter a valid phone number");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      toastService.error("Please fix the validation errors");
      return;
    }

    try {
      setSubmitting(true);

      // Prepare custom field responses for submission
      const customFieldResponsesArray = Object.entries(
        customFieldResponses
      ).map(([fieldId, fieldValue]) => ({
        field_id: fieldId,
        field_value: fieldValue
      }));

      const customQuestionResponsesArray = Object.entries(
        customQuestionResponses
      ).map(([questionId, answer]) => ({
        question_id: questionId,
        answer: answer
      }));

      // If in edit mode, use the edit endpoint
      if (editMode) {
        const response = await api.put(
          `/student/drive/edit-application/${drive._id}`,
          {
            resumeLink: formData.resumeLink,
            phone: formData.phone,
            custom_field_responses: customFieldResponsesArray,
            custom_question_responses: customQuestionResponsesArray
          }
        );

        if (response.status === 200) {
          toastService.success("Application updated successfully");
        }
      } else {
        // Use the new submit-application endpoint
        const response = await api.post(
          `/student/drive/submit-application/${drive._id}`,
          {
            resumeLink: formData.resumeLink.trim(),
            phone: formData.phone.trim(),
            custom_field_responses: customFieldResponsesArray,
            custom_question_responses: customQuestionResponsesArray
          }
        );

        if (response.status === 200) {
          toastService.success("Application submitted successfully");
          // Reload the page to update the application status
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error submitting application:", error);

      if (error.response?.data?.errors) {
        // Server validation errors
        setValidationErrors(error.response.data.errors);
        toastService.error(
          "Application cannot be submitted. Please check the requirements"
        );
      } else {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data ||
          "Failed to submit application";
        toastService.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="right-0 border-gray-100 border-2 border-solid p-4 rounded-xl mb-2 sm:mx-12">
      <div className="flex gap-3 w-full rounded-xl mt-2 mb-2">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-xl shadow-sm w-full border border-gray-200"
        >
          <div className="mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {editMode
                ? "Edit Application"
                : drive && drive.hasApplied
                ? "View Application"
                : "Apply for this Drive"}
            </h2>
            <p className="text-gray-500 mt-1">
              {isReadOnly && drive && !drive.isActive
                ? "This drive is no longer accepting applications"
                : drive && drive.hasApplied
                ? "Your application details for this drive"
                : "Fill in your details and submit your application"}
            </p>

            {/* Validation Errors Display */}
            {validationErrors.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-red-800 font-semibold mb-2">
                  Please address the following issues:
                </h3>
                <ul className="text-red-700 text-sm space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {/* Full Name */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-600">
                Full name:
              </label>
              <input
                readOnly={true} // Always read-only
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:bg-transparent"
              />
            </div>

            {/* College E-mail */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-600">
                College E-mail:
              </label>
              <input
                type="email"
                name="email"
                readOnly={true} // Always read-only
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:bg-transparent "
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-600">
                Phone:
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                readOnly={isReadOnly}
                className={`mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:bg-transparent ${
                  isReadOnly ? "text-gray-500 bg-gray-50" : ""
                }`}
              />
            </div>

            {/* CGPA */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-600">
                CGPA:
              </label>
              <input
                type="text"
                name="cgpa"
                readOnly={true} // Always read-only
                value={formData.cgpa}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:bg-transparent"
              />
            </div>

            {/* Resume Link */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-600">
                Resume link:
              </label>
              <input
                type="url"
                name="resumeLink"
                value={formData.resumeLink}
                onChange={handleChange}
                readOnly={isReadOnly}
                className={`mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:bg-transparent ${
                  isReadOnly ? "text-gray-500 bg-gray-50" : ""
                }`}
              />
            </div>

            {/* 10th Result */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-600">
                10th result:
              </label>
              <input
                type="text"
                name="result10th"
                readOnly={true} // Always read-only
                value={`${formData.result10th}%`}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:bg-transparent"
              />
            </div>

            {/* 12th Result */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-600">
                12th result:
              </label>
              <input
                type="text"
                name="result12th"
                readOnly={true} // Always read-only
                value={`${formData.result12th}%`}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:bg-transparent"
              />
            </div>

            {/* Course */}
            <div className="flex flex-col">
              <label className="font-semibold text-sm text-gray-600">
                Course:
              </label>
              <input
                type="text"
                name="course"
                readOnly={true} // Always read-only
                value={formData.course}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:bg-transparent"
              />
            </div>

            {/* Custom Required Details */}
            {drive?.custom_required_details &&
              drive.custom_required_details.length > 0 && (
                <>
                  <hr className="my-6 border-gray-200" />
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Additional Required Information
                    </h3>
                    {drive.custom_required_details.map((field) => (
                      <div key={field.field_id} className="flex flex-col">
                        <label className="font-semibold text-sm text-gray-600">
                          {field.field_label}
                          {field.is_required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                        {field.help_text && (
                          <p className="text-xs text-gray-500 mt-1 mb-2">
                            {field.help_text}
                          </p>
                        )}
                        {renderCustomField(field)}
                      </div>
                    ))}
                  </div>
                </>
              )}

            {/* Custom Questions */}
            {drive?.custom_questions && drive.custom_questions.length > 0 && (
              <>
                <hr className="my-6 border-gray-200" />
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Additional Questions
                  </h3>
                  {/* Group questions by section */}
                  {(() => {
                    const groupedQuestions = drive.custom_questions.reduce(
                      (groups, question) => {
                        const section =
                          question.section_title || "General Questions";
                        if (!groups[section]) {
                          groups[section] = [];
                        }
                        groups[section].push(question);
                        return groups;
                      },
                      {}
                    );

                    return Object.entries(groupedQuestions).map(
                      ([section, questions]) => (
                        <div key={section} className="space-y-4">
                          {Object.keys(groupedQuestions).length > 1 && (
                            <h4 className="text-md font-medium text-gray-700 border-l-4 border-blue-500 pl-3">
                              {section}
                            </h4>
                          )}
                          {questions.map((question) => (
                            <div
                              key={question.question_id}
                              className="flex flex-col"
                            >
                              <label className="font-semibold text-sm text-gray-600">
                                {question.question_text}
                                {question.is_required && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </label>
                              {question.help_text && (
                                <p className="text-xs text-gray-500 mt-1 mb-2">
                                  {question.help_text}
                                </p>
                              )}
                              {renderCustomQuestion(question)}
                            </div>
                          ))}
                        </div>
                      )
                    );
                  })()}
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="text-center mt-6">
              {!drive.hasApplied && !isReadOnly && !editMode ? (
                <div className="flex justify-center gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`bg-coral-red hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors ${
                      submitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {submitting
                      ? "Submitting Application..."
                      : "Send Application"}
                  </button>
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-8 py-3 rounded-lg transition-colors"
                    >
                      Back to Details
                    </button>
                  )}
                </div>
              ) : editMode ? (
                <div className="flex justify-center gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`bg-coral-red hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors ${
                      submitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {submitting ? "Updating..." : "Update Application"}
                  </button>
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-8 py-3 rounded-lg transition-colors"
                    >
                      Back to Details
                    </button>
                  )}
                </div>
              ) : (
                // View mode - show back button if available
                onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-8 py-3 rounded-lg transition-colors"
                  >
                    Back to Details
                  </button>
                )
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
