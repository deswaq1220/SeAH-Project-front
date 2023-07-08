import { useState } from "react";
import Header from "../components/Header";
import { format, getWeekOfMonth, addWeeks, subWeeks } from "date-fns";

function SafetyEducationMain() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPreviousWeek = () => {
    const previousWeekDate = subWeeks(currentDate, 1);
    setCurrentDate(previousWeekDate);
  };

  const goToNextWeek = () => {
    const nextWeekDate = addWeeks(currentDate, 1);
    setCurrentDate(nextWeekDate);
  };

  const getFormattedDate = () => {
    const year = currentDate.getFullYear();
    const month = format(currentDate, 'M월');
    const weekOfMonth = getWeekOfMonth(currentDate);
    const prevWeekDate = subWeeks(currentDate, 1);
    const prevWeekMonth = format(prevWeekDate, 'M월');

    let weekText = '';
    if (weekOfMonth === 1) {
      weekText = '첫째주';
    } else if (weekOfMonth === 2) {
      weekText = '둘째주';
    } else if (weekOfMonth === 3) {
      weekText = '셋째주';
    } else if (weekOfMonth === 4) {
      weekText = '넷째주';
    } else if (weekOfMonth === 5) {
      weekText = '다섯째주';
    } else if (weekOfMonth === 6) {
      weekText = '여섯째주';
    } else {
      weekText = `${weekOfMonth}째주`;
    }

    const formattedPrevWeekDate = `${format(prevWeekDate, 'yyyy. M월')} ${weekText}, ${prevWeekMonth}`;

    return `${year}. ${month} ${weekText}`;
  };

  return (
    <div>
      <Header />
      <div>
        <button onClick={goToPreviousWeek} className="mr-2">&lt;</button>
        <a>{getFormattedDate()}</a>
        <button onClick={goToNextWeek} className="ml-2">&gt;</button>
      </div>
    </div>
  );
}

export default SafetyEducationMain;
