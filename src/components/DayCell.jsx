import PropTypes from "prop-types";

const DayCell = ({ day, onDayClick }) => {
  return (
    <div
      className="day-cell p-4 cursor-pointer flex justify-center items-center"
      onClick={() => onDayClick(day)}
    >
      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-transparent text-lg font-medium text-black ">
        {day.getDate()}
      </div>
    </div>
  );
};

DayCell.propTypes = {
  day: PropTypes.instanceOf(Date).isRequired,
  onDayClick: PropTypes.func.isRequired,
};

export default DayCell;
