import React, { useState } from 'react';
import Header from '../../components/Header';
import { format, addMonths, subMonths, getMonth, getYear } from "date-fns";
import Pagination from "../../components/Pagination";


function SafetyInspection() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("");

  //달력 넣기
  const goToPreviousMonth = () => {
    const previousMonthDate = subMonths(currentDate, 1);
    setCurrentDate(previousMonthDate);
  };

  const goToNextMonth = () => {
    const nextMonthDate = addMonths(currentDate, 1);
    setCurrentDate(nextMonthDate);
  }

  const getFormattedDate = () => {
    const year = currentDate.getFullYear();
    const month = format(currentDate, "M월");

    return `${year}. ${month}`;
  };

  return (
    <div>
      <Header />
      {/* 달력  */}
      <div className="flex flex-col justify-center items-center text-3xl mt-28">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          수시점검 조회
        </h1>
        <div className="flex items-center">
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
        </div>
      </div>

      {/* 드롭다운 메뉴 */}
      <div className="flex justify-center mt-4">
        <div className="px-4">
          <label className="block text-sm font-medium text-gray-700">사원번호</label>
          <input
            type="text"
            // value={searchName}
            className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-seahColor focus:border-seahColor sm:text-sm rounded-md"
          />
        </div>
        <div className="px-4">
          <label className="block text-sm font-medium text-gray-700">이름</label>
          <input
            type="text"
            // value={searchName}
            className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-seahColor focus:border-seahColor sm:text-sm rounded-md"
          />
        </div>
        <button
          // onClick={handleSearch}
          className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-seahColor hover:bg-seahDeep focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-seahColor"
        >
          검색
        </button>
      </div>
      {/* 드롭다운 메뉴와 입력 필드 */}


    </div>
  );
}

export default SafetyInspection;
