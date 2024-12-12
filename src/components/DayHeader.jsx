const DayHeader = () => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayInitials = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="day-header grid grid-cols-7 text-center font-semibold mt-10 mb-3">
      {daysOfWeek.map((day, index) => (
        <div key={index} className="day-header-item py-2">
          <span className="hidden md:block">{day}</span>
          <span className="block md:hidden">{dayInitials[index]}</span>
        </div>
      ))}
    </div>
  );
};

export default DayHeader;
