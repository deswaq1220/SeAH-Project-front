import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import axios from "axios";
import Pagination from "../../components/Pagination";
import { format, addMonths, subMonths } from "date-fns";

function SafetyEduStatics() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [attendeesList, setAttendeesList] = useState([]);
  const categories = ["CREW", "MANAGE", "DM", "ETC"];
  // 선택된 카테고리를 상태로 관리
  const [selectedCategory, setSelectedCategory] = useState("");
  

  useEffect(() => {
    if (selectedCategory !== "") {
      axios
        .get("http://localhost:8081/edustatistics/getmonth", {
          params: {
            eduCategory: selectedCategory,
            month: selectedMonth,
          },
        })
        .then((response) => {
          setAttendeesList(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [selectedCategory, selectedMonth]);

  //달력 넣기
  
  const goToPreviousMonth = () => {
    const previousMonthDate = subMonths(currentDate, 1);
    setCurrentDate(previousMonthDate);
    // 월 변경 시 해당 월에 맞게 필터링되도록 호출
    setSelectedMonth(previousMonthDate.getMonth() + 1);
  };

  const goToNextMonth = () => {
    const nextMonthDate = addMonths(currentDate, 1);
    setCurrentDate(nextMonthDate);
    // 월 변경 시 해당 월에 맞게 필터링되도록 호출
    setSelectedMonth(nextMonthDate.getMonth() + 1);
  };

  const getFormattedDate = () => {
    const year = currentDate.getFullYear();
    const month = format(currentDate, "M월");

    return `${year}. ${month}`;
  };

  //여기까지 달력 넣음

  if (attendeesList === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />

      {/* 달력 넣고 여기서 필터링하고싶다 격하게 */}
      <div className="flex flex-col justify-center items-center text-3xl mt-28">
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
        {/* 여기까지가 달력 넣은 부분인데 어케함 ? ㅜ */}

        {/* 여기부터는 카테고리를 메뉴로 만든거 */}
         <div className="flex justify-center mt-4">
        <div className="px-4">
          <nav className="flex space-x-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                  selectedCategory === category
                    ? "text-white bg-seahColor hover:bg-seahDeep focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-seahColor"
                    : "text-seahColor hover:text-seahDeep"
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>
      </div>
      {/* 카테고리 메뉴 */}

      <div className="flex justify-center mt-8">
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl w-full">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                월별 교육 참가자 명단
              </h1>
              <div className="flex justify-between">
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    월
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    value={selectedMonth}
                    className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-seahColor focus:border-seahColor sm:text-sm rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                    <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        교육분류
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        제목
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        교육 시작 시간
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        교육 시간
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        참가자 이름
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        참가자 사번
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        참가자 부서
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {attendeesList.map((item, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          {item.eduCategory}
                        </td>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          {item.eduTitle}
                        </td>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          {item.eduStartTime}
                        </td>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          {item.eduSumTime} 분
                        </td>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          {item.attenName}
                        </td>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          {item.attenEmployeeNumber}
                        </td>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          {item.attenDepartment}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl w-full">
          {attendeesList.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={attendeesList.length}
              setCurrentPage={setCurrentPage}
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SafetyEduStatics;
