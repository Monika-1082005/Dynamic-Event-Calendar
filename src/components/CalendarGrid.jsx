import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import EventModal from "./EventModal";

const CalendarGrid = ({
  currentMonth,
  eventsByDate,
  selectedDay,
  onSelectDay,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
}) => {
  const [eventsForSelectedDay, setEventsForSelectedDay] = useState([]);

  const today = new Date();
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

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getDateString = (day) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date.toDateString();
  };

  const handleDayClick = (day) => {
    const newSelectedDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    onSelectDay(newSelectedDay);
  };

  useEffect(() => {
    if (selectedDay) {
      const dateString = getDateString(selectedDay.getDate());
      setEventsForSelectedDay(eventsByDate[dateString] || []);
    }
  }, [selectedDay, eventsByDate]);

  const categoryColors = {
    work: "bg-blue-500",
    personal: "bg-green-500",
    others: "bg-yellow-500",
    //We can add more categories in future
  };

  const renderCalendar = () => {
    let days = [];
    let emptyCells = firstDayOfMonth;

    for (let i = 0; i < emptyCells; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 bg-gray-100"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        i
      );
      const dateString = getDateString(i);
      const eventsForDay = eventsByDate[dateString] || [];

      const isToday = isSameDay(currentDate, today);
      const isSelected = selectedDay && isSameDay(currentDate, selectedDay);

      const eventCategories = [
        ...new Set(eventsForDay.map((event) => event.category.toLowerCase())),
      ];

      days.push(
        <div
          key={i}
          className={`h-16 flex flex-col items-center justify-center border rounded-lg cursor-pointer 
            ${isSelected ? "ring-2 ring-blue-500" : ""} 
            ${isToday ? "bg-green-300" : "bg-white"}`}
          onClick={() => handleDayClick(i)}
        >
          <div>{i}</div>

          <div className="flex space-x-1 mt-1">
            {eventCategories.map((category) => (
              <div
                key={category}
                className={`w-2 h-2 rounded-full ${
                  categoryColors[category] || "bg-gray-500"
                }`}
              ></div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <>
      <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>

      {selectedDay && (
        <EventModal
          day={selectedDay}
          events={eventsForSelectedDay}
          onAddEvent={onAddEvent}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
          onClose={() => onSelectDay(null)}
        />
      )}
    </>
  );
};

CalendarGrid.propTypes = {
  currentMonth: PropTypes.instanceOf(Date).isRequired,
  eventsByDate: PropTypes.object.isRequired,
  selectedDay: PropTypes.instanceOf(Date),
  onSelectDay: PropTypes.func.isRequired,
  onAddEvent: PropTypes.func.isRequired,
  onEditEvent: PropTypes.func.isRequired,
  onDeleteEvent: PropTypes.func.isRequired,
};

export default CalendarGrid;
