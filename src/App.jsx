import { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import CalendarGrid from "./components/CalendarGrid";
import DayHeader from "./components/DayHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons"; // Importing faSearch
import "./App.css";

const App = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Added search term state
  const [filteredEvents, setFilteredEvents] = useState([]); // State to hold filtered events

  // Load data from localStorage
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    const storedSelectedDay = localStorage.getItem("selectedDay");

    setEvents(storedEvents);
    if (storedSelectedDay) {
      setSelectedDay(new Date(storedSelectedDay));
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  // Save selected day to localStorage whenever it changes
  useEffect(() => {
    if (selectedDay) {
      localStorage.setItem("selectedDay", selectedDay.toISOString());
    }
  }, [selectedDay]);

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
    );
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
    );
  };

  const eventsByDate = useMemo(() => {
    const eventsMap = {};
    events.forEach((event) => {
      const eventDate = new Date(event.date).toDateString();
      if (!eventsMap[eventDate]) {
        eventsMap[eventDate] = [];
      }
      eventsMap[eventDate].push(event);
    });
    return eventsMap;
  }, [events]);

  const handleAddEvent = (dateString, newEvent) => {
    const updatedEvents = [...events, { ...newEvent, date: dateString }];
    setEvents(updatedEvents);
  };

  const handleEditEvent = (dateString, index, updatedEvent) => {
    const updatedEvents = [...events];
    updatedEvents[index] = updatedEvent;
    setEvents(updatedEvents);
  };

  const handleDeleteEvent = (dateString, index) => {
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
  };

  // Export to JSON function (filtered by selected month)
  const exportToJSON = () => {
    const selectedYear = currentMonth.getFullYear();
    const selectedMonth = currentMonth.getMonth();
    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getFullYear() === selectedYear &&
        eventDate.getMonth() === selectedMonth
      );
    });

    const dataStr = JSON.stringify(filteredEvents, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `events-${selectedMonth + 1}-${selectedYear}.json`; // Format: MM-YYYY.json
    link.click();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter events based on the search term
  const filterEvents = () => {
    const term = searchTerm.toLowerCase();
    if (!term) {
      return []; // Return empty array if no search term is entered
    }

    const filtered = events.filter((event) => {
      const name = event.name?.toLowerCase() || "";
      const description = event.description?.toLowerCase() || "";
      const category = event.category?.toLowerCase() || "";

      // Check if the search term is in the title, description, or category
      return (
        name.includes(term) ||
        description.includes(term) ||
        category.includes(term)
      );
    });

    return filtered;
  };

  // Trigger search whenever the search term changes
  useEffect(() => {
    if (searchTerm) {
      setFilteredEvents(filterEvents()); // Set filtered events when search term changes
    } else {
      setFilteredEvents([]); // Clear filtered events when search term is empty
    }
  }, [searchTerm]);

  // Format date without time
  const formatDate = (date) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <Header
          currentMonth={currentMonth}
          onPrev={handlePrevMonth}
          onNext={handleNextMonth}
        />
      </div>

      {/* Search Bar with Search Icon attached */}
      <div className="flex justify-center items-center mt-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search events..."
          className="px-4 py-2 border rounded w-1/2"
        />
        <FontAwesomeIcon
          icon={faDownload}
          className="text-blue-500 text-3xl cursor-pointer hover:text-blue-700 ml-10"
          onClick={exportToJSON}
          title="Export Monthly Events to JSON"
        />
      </div>

      {/* Show search term if no events are found */}
      <div className="mt-4 max-w-7xl flex flex-col justify-center overflow-hidden mx-auto ">
        {searchTerm && filteredEvents.length === 0 && (
          <div className="alert alert-info">
            <strong>
              No events found matching your search term:{" "}
              <span className="font-semibold">{searchTerm}</span>
            </strong>
          </div>
        )}

        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div key={index} className="border p-4 mb-4 rounded">
              <h3 className="text-xl font-bold ">{event.name}</h3>
              <p className="text-gray-500">{formatDate(event.date)}</p>
              <p>{event.description}</p>
            </div>
          ))
        ) : searchTerm ? (
          <p>No events found matching your search criteria.</p>
        ) : (
          <p>Start typing to search for events.</p> // Prompt to start typing
        )}
      </div>

      <div className="max-w-7xl mx-auto mt-4">
        <DayHeader />
        <CalendarGrid
          currentMonth={currentMonth}
          eventsByDate={eventsByDate}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>
    </div>
  );
};

export default App;
