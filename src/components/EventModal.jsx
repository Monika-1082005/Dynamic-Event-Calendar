import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const EventModal = ({
  day,
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onClose,
}) => {
  const [newEvent, setNewEvent] = useState({
    name: "",
    startTime: "",
    endTime: "",
    description: "",
    category: "Work",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevState) => ({ ...prevState, [name]: value }));
  };

  const hasOverlap = (newEvent, events) => {
    const newStart = new Date(`1970-01-01T${newEvent.startTime}:00`);
    const newEnd = new Date(`1970-01-01T${newEvent.endTime}:00`);
    return events.some((event) => {
      const existingStart = new Date(`1970-01-01T${event.startTime}:00`);
      const existingEnd = new Date(`1970-01-01T${event.endTime}:00`);
      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  };

  const handleAddEventClick = () => {
    if (!newEvent.name || !newEvent.startTime || !newEvent.endTime) {
      setError("Please fill in all required fields.");
      setShowAlert(true);
      return;
    }

    const newStart = new Date(`1970-01-01T${newEvent.startTime}:00`);
    const newEnd = new Date(`1970-01-01T${newEvent.endTime}:00`);

    if (newEnd <= newStart) {
      setError("End time cannot be before or the same as the start time.");
      setShowAlert(true);
      return;
    }

    if (hasOverlap(newEvent, events)) {
      setError("This event overlaps with an existing event.");
      setShowAlert(true);
      return;
    }

    onAddEvent(day, newEvent);
    setNewEvent({
      name: "",
      startTime: "",
      endTime: "",
      description: "",
      category: "Work",
    });
  };

  const handleEditEventClick = () => {
    if (!newEvent.name || !newEvent.startTime || !newEvent.endTime) {
      setError("Please fill in all required fields.");
      setShowAlert(true);
      return;
    }

    const newStart = new Date(`1970-01-01T${newEvent.startTime}:00`);
    const newEnd = new Date(`1970-01-01T${newEvent.endTime}:00`);

    if (newEnd <= newStart) {
      setError("End time cannot be before or the same as the start time.");
      setShowAlert(true);
      return;
    }

    const filteredEvents = events.filter((_, index) => index !== editIndex);
    if (hasOverlap(newEvent, filteredEvents)) {
      setError("This event overlaps with an existing event.");
      setShowAlert(true);
      return;
    }

    onEditEvent(day, editIndex, newEvent);
    setNewEvent({
      name: "",
      startTime: "",
      endTime: "",
      description: "",
      category: "Work",
    });
    setEditIndex(null);
  };

  const handleDeleteEventClick = (index) => {
    onDeleteEvent(day, index);
  };

  const eventDate =
    day instanceof Date ? day.toLocaleDateString() : "Invalid Date";

  return (
    <div className="event-modal relative p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-lg mx-auto mt-8">
      <div className="absolute top-2 right-2">
        <FaTimes
          className="text-gray-400 text-2xl cursor-pointer hover:text-red-600"
          onClick={onClose}
        />
      </div>

      <h2 className="text-xl mb-4 text-center">Events for {eventDate}</h2>

      {showAlert && (
        <div className="transition-opacity duration-300 ease-in-out fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-4 rounded-md shadow-lg">
          {error}
        </div>
      )}

      {events.length > 0 ? (
        <ul className="mb-6">
          {events.map((event, index) => (
            <li
              key={index}
              className={`mb-4 p-4 rounded-lg ${
                event.category === "Work"
                  ? "bg-blue-200 text-black"
                  : event.category === "Personal"
                  ? "bg-green-200 text-black"
                  : "bg-yellow-200 text-black"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <strong>{event.name}</strong> (
                  {event.startTime || "Not Specified"} -{" "}
                  {event.endTime || "Not Specified"})
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setNewEvent(event);
                      setEditIndex(index);
                    }}
                    className="bg-gray-600 text-white hover:bg-gray-500"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteEventClick(index)}
                    className="bg-red-600 text-white hover:bg-red-500"
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
              {event.description && (
                <p className="mt-2 text-sm">{event.description}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-2">No events for this day.</p>
      )}

      <input
        type="text"
        name="name"
        value={newEvent.name}
        onChange={handleInputChange}
        placeholder="Event Name"
        className="input mb-4 p-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <input
          type="time"
          name="startTime"
          value={newEvent.startTime}
          onChange={handleInputChange}
          className="input p-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="time"
          name="endTime"
          value={newEvent.endTime}
          onChange={handleInputChange}
          className="input p-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <textarea
        name="description"
        value={newEvent.description}
        onChange={handleInputChange}
        placeholder="Event Description (Optional)"
        className="input mt-4 mb-4 p-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
      ></textarea>

      <select
        name="category"
        value={newEvent.category}
        onChange={handleInputChange}
        className="input mb-4 p-2 w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
      >
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Others">Others</option>
      </select>

      <div className="flex space-x-4">
        <Button
          variant="primary"
          size="sm"
          className="mb-2 w-full bg-blue-600 text-white hover:bg-blue-500"
          onClick={handleAddEventClick}
        >
          Add Event
        </Button>
        {editIndex !== null && (
          <Button
            variant="secondary"
            size="sm"
            className="mb-2 w-full bg-yellow-600 text-white hover:bg-yellow-500"
            onClick={handleEditEventClick}
          >
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
};

EventModal.propTypes = {
  day: PropTypes.instanceOf(Date).isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired,
      description: PropTypes.string,
      category: PropTypes.string.isRequired,
    })
  ).isRequired,
  onAddEvent: PropTypes.func.isRequired,
  onEditEvent: PropTypes.func.isRequired,
  onDeleteEvent: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EventModal;
