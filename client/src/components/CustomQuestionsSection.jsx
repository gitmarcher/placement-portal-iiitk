import React, { useState } from "react";
import { IoAdd, IoTrash, IoHelpCircle } from "react-icons/io5";

const CustomQuestionsSection = ({ formData, onCustomQuestionsChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    question_type: "text",
    is_required: true,
    options: [],
    placeholder: "",
    help_text: "",
    max_length: "",
    section_title: ""
  });

  const questionTypes = [
    { value: "text", label: "Short Text" },
    { value: "textarea", label: "Long Text (Paragraph)" },
    { value: "select", label: "Dropdown" },
    { value: "radio", label: "Multiple Choice (Single Selection)" },
    { value: "checkbox", label: "Multiple Choice (Multiple Selections)" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "file", label: "File Upload" }
  ];

  const generateQuestionId = () => {
    return `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddQuestion = () => {
    if (!newQuestion.question_text) {
      alert("Please fill in the Question Text");
      return;
    }

    if (
      ["select", "radio", "checkbox"].includes(newQuestion.question_type) &&
      newQuestion.options.length === 0
    ) {
      alert("Please add at least one option for this question type");
      return;
    }

    const questionToAdd = {
      ...newQuestion,
      question_id: generateQuestionId(),
      max_length: newQuestion.max_length
        ? parseInt(newQuestion.max_length)
        : undefined,
      options: ["select", "radio", "checkbox"].includes(
        newQuestion.question_type
      )
        ? newQuestion.options
        : []
    };

    const updatedQuestions = [
      ...(formData.custom_questions || []),
      questionToAdd
    ];
    onCustomQuestionsChange(updatedQuestions);

    // Reset form
    setNewQuestion({
      question_text: "",
      question_type: "text",
      is_required: true,
      options: [],
      placeholder: "",
      help_text: "",
      max_length: "",
      section_title: ""
    });
    setShowAddForm(false);
  };

  const handleRemoveQuestion = (questionId) => {
    const updatedQuestions = (formData.custom_questions || []).filter(
      (question) => question.question_id !== questionId
    );
    onCustomQuestionsChange(updatedQuestions);
  };

  const handleOptionsChange = (optionsText) => {
    const options = optionsText.split("\n").filter((option) => option.trim());
    setNewQuestion((prev) => ({ ...prev, options }));
  };

  const groupedQuestions = (formData.custom_questions || []).reduce(
    (groups, question) => {
      const section = question.section_title || "General Questions";
      if (!groups[section]) {
        groups[section] = [];
      }
      groups[section].push(question);
      return groups;
    },
    {}
  );

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Custom Questions
        </h3>
        <IoHelpCircle
          className="text-gray-400 w-5 h-5 cursor-help"
          title="Add additional questions for students to answer during application (e.g., Why do you want to work here?, Describe your experience with...)"
        />
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Add custom questions to gather additional information from students
        during their application.
      </p>

      {/* Display existing custom questions grouped by section */}
      {Object.keys(groupedQuestions).length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 mb-3">
            Added Custom Questions:
          </h4>
          <div className="space-y-4">
            {Object.entries(groupedQuestions).map(([section, questions]) => (
              <div
                key={section}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h5 className="font-medium text-gray-800 mb-3 border-b border-gray-200 pb-2">
                  {section}
                </h5>
                <div className="space-y-3">
                  {questions.map((question) => (
                    <div
                      key={question.question_id}
                      className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <span className="font-medium text-gray-900">
                            {question.question_text}
                          </span>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                            {
                              questionTypes.find(
                                (t) => t.value === question.question_type
                              )?.label
                            }
                          </span>
                          {!question.is_required && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                              Optional
                            </span>
                          )}
                        </div>

                        {question.options && question.options.length > 0 && (
                          <div className="text-sm text-gray-600 mt-2">
                            <strong>Options:</strong>{" "}
                            {question.options.join(", ")}
                          </div>
                        )}

                        {question.help_text && (
                          <div className="text-sm text-gray-600 mt-1">
                            <strong>Help:</strong> {question.help_text}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveQuestion(question.question_id)
                        }
                        className="text-red-500 hover:text-red-700 p-1 ml-2"
                      >
                        <IoTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add new question button or form */}
      {!showAddForm ? (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
        >
          <IoAdd className="w-4 h-4" />
          Add Custom Question
        </button>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <h4 className="text-lg font-medium text-gray-800 mb-4">
            Add New Custom Question
          </h4>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Text *
            </label>
            <textarea
              value={newQuestion.question_text}
              onChange={(e) =>
                setNewQuestion((prev) => ({
                  ...prev,
                  question_text: e.target.value
                }))
              }
              placeholder="e.g., Why do you want to work for our company?"
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question Type *
              </label>
              <select
                value={newQuestion.question_type}
                onChange={(e) =>
                  setNewQuestion((prev) => ({
                    ...prev,
                    question_type: e.target.value
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {questionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section Title (Optional)
              </label>
              <input
                type="text"
                value={newQuestion.section_title}
                onChange={(e) =>
                  setNewQuestion((prev) => ({
                    ...prev,
                    section_title: e.target.value
                  }))
                }
                placeholder="e.g., Background Questions"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Group related questions together
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required
            </label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={newQuestion.is_required}
                  onChange={() =>
                    setNewQuestion((prev) => ({ ...prev, is_required: true }))
                  }
                  className="mr-2"
                />
                Required
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!newQuestion.is_required}
                  onChange={() =>
                    setNewQuestion((prev) => ({ ...prev, is_required: false }))
                  }
                  className="mr-2"
                />
                Optional
              </label>
            </div>
          </div>

          {/* Options for select, radio, checkbox types */}
          {["select", "radio", "checkbox"].includes(
            newQuestion.question_type
          ) && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options (one per line) *
              </label>
              <textarea
                value={newQuestion.options.join("\n")}
                onChange={(e) => handleOptionsChange(e.target.value)}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placeholder Text
              </label>
              <input
                type="text"
                value={newQuestion.placeholder}
                onChange={(e) =>
                  setNewQuestion((prev) => ({
                    ...prev,
                    placeholder: e.target.value
                  }))
                }
                placeholder="e.g., Please describe in detail..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {(newQuestion.question_type === "text" ||
              newQuestion.question_type === "textarea") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Length
                </label>
                <input
                  type="number"
                  value={newQuestion.max_length}
                  onChange={(e) =>
                    setNewQuestion((prev) => ({
                      ...prev,
                      max_length: e.target.value
                    }))
                  }
                  placeholder="e.g., 1000"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Help Text
            </label>
            <input
              type="text"
              value={newQuestion.help_text}
              onChange={(e) =>
                setNewQuestion((prev) => ({
                  ...prev,
                  help_text: e.target.value
                }))
              }
              placeholder="Additional guidance for answering this question"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add Question
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomQuestionsSection;
