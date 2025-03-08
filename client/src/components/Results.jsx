import { useState } from "react";

const Results = () => {
  const [rowData, setRowData] = useState([
    { name: "John Doe", rollNo: "1001", selected: false },
    { name: "Jane Doe", rollNo: "1002", selected: false },
    { name: "Mark Smith", rollNo: "1003", selected: false }
  ]);
  const [searchText, setSearchText] = useState("");

  const updateSelection = (selectedRollNo) => {
    setRowData((prev) =>
      prev.map((row) => {
        // If this is the row we clicked on, toggle its selected state
        if (row.rollNo === selectedRollNo) {
          return { ...row, selected: !row.selected };
        }
        // Otherwise leave it unchanged
        return row;
      })
    );
  };

  const toggleSelection = (selectAll) => {
    setRowData((prev) => prev.map((row) => ({ ...row, selected: selectAll })));
  };

  const filteredData = rowData.filter((row) =>
    row.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="font-ubuntu max-w-3xl mx-auto py-6">
      <h2 className="text-xl font-semibold mb-4">Student Results</h2>

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        {/* Search and Selection Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="p-2 pl-8 w-full sm:w-56 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
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

          <div className="flex gap-4 text-sm">
            {[
              { label: "Select All", value: true },
              { label: "Deselect All", value: false }
            ].map((option) => (
              <div key={option.label} className="flex items-center">
                <button
                  onClick={() => toggleSelection(option.value)}
                  className="flex items-center text-sm text-gray-700 hover:text-gray-900"
                >
                  <span className="mr-2 inline-block h-3 w-3 border border-gray-400 rounded-sm bg-white"></span>
                  {option.label}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border-t border-l border-gray-200 p-2 pl-3 rounded-tl-md font-medium">
                  Name
                </th>
                <th className="border-t border-gray-200 p-2 font-medium">
                  Roll No.
                </th>
                <th className="border-t border-r border-gray-200 p-2 text-center rounded-tr-md font-medium w-24">
                  Selected
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr
                    key={row.rollNo}
                    className={`hover:bg-gray-50 ${
                      row.selected ? "bg-gray-50" : ""
                    } ${
                      index === filteredData.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <td className="border-l border-gray-200 p-2 pl-3">
                      {row.name}
                    </td>
                    <td className="p-2">{row.rollNo}</td>
                    <td className="border-r border-gray-200 p-2 text-center">
                      <input
                        type="checkbox"
                        checked={row.selected}
                        onChange={() => updateSelection(row.rollNo)}
                        name={`selectStudent-${row.rollNo}`}
                        className="h-3 w-3 accent-gray-700"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="border border-gray-200 p-3 text-center text-gray-500 text-sm"
                  >
                    No matching results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Results Summary */}
        <div className="mt-3 text-xs text-gray-500 flex justify-between items-center">
          <span>
            Showing {filteredData.length} of {rowData.length} results
          </span>
          {rowData.filter((row) => row.selected).length > 0 && (
            <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
              {rowData.filter((row) => row.selected).length} selected
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
