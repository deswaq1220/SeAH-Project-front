import { useState } from "react";
import Header from "../components/Header";
import { format, addMonths, subMonths } from "date-fns";
import { useNavigate } from 'react-router-dom';

function SafetyEducationMain() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPreviousMonth = () => {
    const previousMonthDate = subMonths(currentDate, 1);
    setCurrentDate(previousMonthDate);
  };

  const goToNextMonth = () => {
    const nextMonthDate = addMonths(currentDate, 1);
    setCurrentDate(nextMonthDate);
  };

  const getFormattedDate = () => {
    const year = currentDate.getFullYear();
    const month = format(currentDate, "M월");

    return `${year}. ${month}`;
  };

  const navigate = useNavigate();

  const handleClick = () => {
    // 원하는 경로로 이동
    navigate('/edureg');
  };

  return (
    <div>
      <Header />
      <div className="flex justify-center items-center text-3xl">
        <button onClick={goToPreviousMonth} className="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <a>{getFormattedDate()}</a>
        <button onClick={goToNextMonth} className="ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
        안전교육페이지다
        <button
          type="submit"
          className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
          onClick={handleClick}
        >
          등록하기
        </button>
      </div>
    </div>
  );
}

export default SafetyEducationMain;
