import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";

const Header = ({ currentMonth, onPrev, onNext }) => {
  return (
    <div className="header flex justify-between items-center p-4 bg-gray-800 text-white">
      <Button
        variant="default"
        size="sm"
        className="bg-black text-white hover:bg-black/90"
        onClick={onPrev}
      >
        <ChevronLeft />
      </Button>
      <h2 className="text-xl font-bold mx-auto">
        {currentMonth.toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </h2>
      <Button
        variant="default"
        size="sm"
        className="bg-black text-white hover:bg-black/90"
        onClick={onNext}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

Header.propTypes = {
  currentMonth: PropTypes.instanceOf(Date).isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default Header;
