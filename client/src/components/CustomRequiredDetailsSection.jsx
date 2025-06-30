import React, { useState } from "react";
import { IoAdd, IoTrash, IoHelpCircle } from "react-icons/io5";

const CustomRequiredDetailsSection = ({ formData, onCustomFieldsChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newField, setNewField] = useState({
    field_name: "",
    field_label: "",
    field_type: "text",
    is_required: true,
    options: [],
    placeholder: "",
    help_text: "",
    max_length: "",
    validation_regex: ""
  });

  const fieldTypes = [
    { value: "text", label: "Text Input" },
    { value: "url", label: "URL/Link" },
    { value: "textarea", label: "Long Text (Textarea)" },
    { value: "select", label: "Dropdown Selection" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "file", label: "File Upload" }
  ];

  const generateFieldId = () => {
    return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddField = () => {
    if (!newField.field_name || !newField.field_label) {
      alert("Please fill in Field Name and Field Label");
      return;
    }

    const fieldToAdd = {
      ...newField,
      field_id: generateFieldId(),
      max_length: newField.max_length
        ? parseInt(newField.max_length)
        : undefined,
      options: newField.field_type === "select" ? newField.options : []
    };

    const updatedFields = [
      ...(formData.custom_required_details || []),
      fieldToAdd
    ];
    onCustomFieldsChange(updatedFields);

    // Reset form
    setNewField({
      field_name: "",
      field_label: "",
      field_type: "text",
      is_required: true,
      options: [],
      placeholder: "",
      help_text: "",
      max_length: "",
      validation_regex: ""
    });
    setShowAddForm(false);
  };

  const handleRemoveField = (fieldId) => {
    const updatedFields = (formData.custom_required_details || []).filter(
      (field) => field.field_id !== fieldId
    );
    onCustomFieldsChange(updatedFields);
  };

  const handleOptionsChange = (optionsText) => {
    const options = optionsText.split("\n").filter((option) => option.trim());
    setNewField((prev) => ({ ...prev, options }));
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          Custom Required Details
        </h3>
        <IoHelpCircle
          className="text-gray-400 w-5 h-5 cursor-help"
          title="Add custom fields that students must fill when applying (e.g., Video Resume Link, Portfolio URL, etc.)"
        />
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Add custom fields beyond the standard required details. These will be
        mandatory for students to fill when applying.
      </p>

      {/* Display existing custom fields */}
      {formData.custom_required_details &&
        formData.custom_required_details.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-800 mb-3">
              Added Custom Fields:
            </h4>
            <div className="space-y-3">
              {formData.custom_required_details.map((field) => (
                <div
                  key={field.field_id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {field.field_label}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {
                          fieldTypes.find((t) => t.value === field.field_type)
                            ?.label
                        }
                      </span>
                      {!field.is_required && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          Optional
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Field Name: {field.field_name}
                      {field.help_text && (
                        <span className="ml-2">• Help: {field.help_text}</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveField(field.field_id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <IoTrash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Add new field button or form */}
      {!showAddForm ? (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <IoAdd className="w-4 h-4" />
          Add Custom Required Detail
        </button>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <h4 className="text-lg font-medium text-gray-800 mb-4">
            Add New Custom Field
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Name *
              </label>
              <input
                type="text"
                value={newField.field_name}
                onChange={(e) =>
                  setNewField((prev) => ({
                    ...prev,
                    field_name: e.target.value
                  }))
                }
                placeholder="e.g., video_resume_link"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Internal identifier (no spaces, use underscores)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Label *
              </label>
              <input
                type="text"
                value={newField.field_label}
                onChange={(e) =>
                  setNewField((prev) => ({
                    ...prev,
                    field_label: e.target.value
                  }))
                }
                placeholder="e.g., Video Resume Link"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                What students will see
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Type *
              </label>
              <select
                value={newField.field_type}
                onChange={(e) =>
                  setNewField((prev) => ({
                    ...prev,
                    field_type: e.target.value
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {fieldTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required
              </label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={newField.is_required}
                    onChange={() =>
                      setNewField((prev) => ({ ...prev, is_required: true }))
                    }
                    className="mr-2"
                  />
                  Required
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!newField.is_required}
                    onChange={() =>
                      setNewField((prev) => ({ ...prev, is_required: false }))
                    }
                    className="mr-2"
                  />
                  Optional
                </label>
              </div>
            </div>
          </div>

          {/* Additional options based on field type */}
          {newField.field_type === "select" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options (one per line)
              </label>
              <textarea
                value={newField.options.join("\n")}
                onChange={(e) => handleOptionsChange(e.target.value)}
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                value={newField.placeholder}
                onChange={(e) =>
                  setNewField((prev) => ({
                    ...prev,
                    placeholder: e.target.value
                  }))
                }
                placeholder="e.g., Enter your video resume URL"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {(newField.field_type === "text" ||
              newField.field_type === "textarea") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Length
                </label>
                <input
                  type="number"
                  value={newField.max_length}
                  onChange={(e) =>
                    setNewField((prev) => ({
                      ...prev,
                      max_length: e.target.value
                    }))
                  }
                  placeholder="e.g., 500"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              value={newField.help_text}
              onChange={(e) =>
                setNewField((prev) => ({ ...prev, help_text: e.target.value }))
              }
              placeholder="Additional guidance for students"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddField}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Field
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

export default CustomRequiredDetailsSection;
