// CalendarContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { fetchDrives } from "../API/getDrives";
import getDrivesC from "../API/getDrivesC";

const CalendarContext = createContext();

export const CalendarProvider = ({ children, userRole = "student" }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [drives, setDrives] = useState([]);
  const [deadlineDates, setDeadlineDates] = useState(new Set());
  const [selectedDateDrives, setSelectedDateDrives] = useState([]);
  const [showDriveModal, setShowDriveModal] = useState(false);

  // Fetch drives based on user role
  const fetchDrivesData = async () => {
    try {
      let data;
      if (userRole === "coordinator") {
        data = await getDrivesC(1, 100); // Fetch all coordinator drives
      } else {
        data = await fetchDrives(1, 100); // Fetch all student drives
      }

      const allDrives = data.drives || [];
      setDrives(allDrives);

      // Extract future deadline dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const deadlines = new Set();
      allDrives.forEach((drive) => {
        if (drive.deadline) {
          const deadlineDate = new Date(drive.deadline);
          deadlineDate.setHours(0, 0, 0, 0);

          // Only include future deadlines
          if (deadlineDate >= today) {
            deadlines.add(deadlineDate.toDateString());
          }
        }
      });

      setDeadlineDates(deadlines);
    } catch (error) {
      console.error("Error fetching drives for calendar:", error);
    }
  };

  // Get drives for a specific date
  const getDrivesForDate = (date) => {
    const dateString = date.toDateString();
    return drives.filter((drive) => {
      if (!drive.deadline) return false;
      const deadlineDate = new Date(drive.deadline);
      deadlineDate.setHours(0, 0, 0, 0);
      return deadlineDate.toDateString() === dateString;
    });
  };

  // Handle date click - show drives if there are deadlines
  const handleDateClick = (date) => {
    setSelectedDate(date);
    const drivesForDate = getDrivesForDate(date);
    if (drivesForDate.length > 0) {
      setSelectedDateDrives(drivesForDate);
      setShowDriveModal(true);
    }
  };

  // Fetch drives when component mounts
  useEffect(() => {
    fetchDrivesData();
  }, [userRole]);

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        events,
        setEvents,
        currentMonth,
        setCurrentMonth,
        drives,
        deadlineDates,
        selectedDateDrives,
        showDriveModal,
        setShowDriveModal,
        handleDateClick,
        getDrivesForDate,
        fetchDrivesData
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => useContext(CalendarContext);
