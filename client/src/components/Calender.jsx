import React, { useState } from "react";
import { useCalendar } from "./CalenderContext";
import { useNavigate } from "react-router-dom";

const Calendar = ({ onClose }) => {
  const {
    selectedDate,
    setSelectedDate,
    events,
    setEvents,
    currentMonth,
    setCurrentMonth,
    deadlineDates,
    selectedDateDrives,
    showDriveModal,
    setShowDriveModal,
    handleDateClick,
    getDrivesForDate
  } = useCalendar();

  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEventDate, setSelectedEventDate] = useState(null);
  const navigate = useNavigate();

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const prevMonth = () => {
    setCurrentMonth((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCurrentMonth((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const isSelectedDate = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const hasEvents = (date) => {
    return (
      events[date.toDateString()] && events[date.toDateString()].length > 0
    );
  };

  const hasDeadlines = (date) => {
    return deadlineDates.has(date.toDateString());
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  const addEvent = (date) => {
    setSelectedEventDate(date);
    setShowEventModal(true);
  };

  const handleAddEvent = (event) => {
    event.preventDefault();
    const title = event.target.title.value;
    const link = event.target.link.value;
    const dateString = selectedEventDate.toDateString();
    setEvents((prevEvents) => ({
      ...prevEvents,
      [dateString]: [...(prevEvents[dateString] || []), { title, link }]
    }));
    setShowEventModal(false);
  };

  const handleDriveClick = (driveId) => {
    setShowDriveModal(false);
    // Navigate to the appropriate drive page based on user role
    const userRole = window.location.pathname.includes("/coordinator")
      ? "coordinator"
      : "student";
    if (userRole === "coordinator") {
      navigate(`/coordinator/drive/${driveId}`);
    } else {
      navigate(`/drive/${driveId}`);
    }
  };

  const formatDeadline = (deadline) => {
    return new Date(deadline).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const EventModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg">
        <form onSubmit={handleAddEvent}>
          <input
            name="title"
            type="text"
            placeholder="Event Title"
            required
            className="block w-full mb-2 p-2 border rounded"
          />
          <input
            name="link"
            type="url"
            placeholder="Event Link (optional)"
            className="block w-full mb-2 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-red-400 text-white px-4 py-2 rounded"
          >
            Add Event
          </button>
          <button
            type="button"
            onClick={() => setShowEventModal(false)}
            className="ml-2 px-4 py-2 rounded border"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );

  const DriveModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-500">
            Application Deadlines - {selectedDate.toLocaleDateString()}
          </h2>
          <button
            onClick={() => setShowDriveModal(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {selectedDateDrives.map((drive) => (
            <div
              key={drive._id}
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleDriveClick(drive._id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {drive.company_logo && (
                      <img
                        src={drive.company_logo}
                        alt={drive.company_name}
                        className="w-8 h-8 object-contain bg-gray-50 border border-gray-200 rounded p-1"
                        onError={(e) => {
                          e.target.src = "/default-logo.png";
                        }}
                      />
                    )}
                    <h3 className="font-semibold text-lg">
                      {drive.company_name}
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-1">{drive.drive_name}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    Role: {drive.type_of_role || "Not specified"}
                  </p>
                  <p className="text-sm text-red-600 font-medium">
                    Deadline: {formatDeadline(drive.deadline)}
                  </p>
                  {drive.location && (
                    <p className="text-sm text-gray-600">
                      Location:{" "}
                      {Array.isArray(drive.location)
                        ? drive.location.join(", ")
                        : drive.location}
                    </p>
                  )}
                  {drive.ctc && (
                    <p className="text-sm text-gray-600">CTC: {drive.ctc}</p>
                  )}
                </div>
                <div className="ml-4 text-sm text-gray-500">
                  Click to view details
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowDriveModal(false)}
            className="bg-red-400 text-white px-6 py-2 rounded hover:bg-red-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const EventList = ({ events }) => (
    <div
      className="absolute z-10 bg-white border rounded shadow-lg p-2"
      onClick={(e) => e.stopPropagation()}
    >
      {events.map((event, index) => (
        <div key={index} className="mb-1">
          {event.link ? (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {event.title}
            </a>
          ) : (
            <span>{event.title}</span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-80">
      <div className="bg-red-400 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center mb-2">
          <button onClick={prevMonth} className="text-2xl">
            &lt;
          </button>
          <span className="font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button onClick={nextMonth} className="text-2xl">
            &gt;
          </button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-2xl font-bold">
            {selectedDate.getDate()}
            <span className="text-2xl font-bold">
              {" "}
              {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </span>
          </div>
          <button
            onClick={goToToday}
            className="bg-white text-red-400 hover:bg-red-100 font-bold py-1 px-3 rounded text-sm transition duration-300"
          >
            Today
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2 text-center">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div key={day} className="text-xs font-semibold">
            {day}
          </div>
        ))}
        {[...Array(firstDayOfMonth)].map((_, i) => (
          <div key={`empty-${i}`} className="p-2"></div>
        ))}
        {[...Array(daysInMonth)].map((_, i) => {
          const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            i + 1
          );
          const dateString = date.toDateString();
          const dateEvents = events[dateString] || [];
          const hasDeadline = hasDeadlines(date);

          return (
            <div
              key={i}
              className={`p-2 cursor-pointer relative group ${
                isSelectedDate(date) ? "bg-red-400 text-white rounded-full" : ""
              } ${
                hasEvents(date) && !isSelectedDate(date)
                  ? "bg-violet-900 text-white rounded-full"
                  : ""
              }`}
              onClick={() => handleDateClick(date)}
              onDoubleClick={() => addEvent(date)}
            >
              {i + 1}

              {/* Red dot for deadlines */}
              {hasDeadline && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              )}

              {/* Blue dot for regular events */}
              {dateEvents.length > 0 && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
              )}

              {/* Event list on hover */}
              {dateEvents.length > 0 && (
                <div className="hidden group-hover:block">
                  <EventList events={dateEvents} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 text-xs text-gray-600 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Application Deadline</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Personal Event</span>
        </div>
      </div>

      {showEventModal && <EventModal />}
      {showDriveModal && <DriveModal />}

      {onClose && (
        <button
          onClick={onClose}
          className="mt-4 bg-red-400 text-white px-4 py-2 rounded w-full"
        >
          Close Calendar
        </button>
      )}
    </div>
  );
};

export default Calendar;
