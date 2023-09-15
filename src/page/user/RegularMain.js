import React, { useState, useEffect } from "react";
import UserHeader from "../../components/UserHeader";
import { format, addMonths, subMonths, getMonth, getYear } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../../components/Pagination";
import { Link } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

function RegularMain() {
  const [currentDate, setCurrentDate] = useState(new Date()); // 년,월
  const [regularList, setRegularList] = useState([]); // 안전교육 데이터를 담을 상태 변수

  const itemsPerPage = 10; // 한 페이지당 보여줄 항목 개수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const [selectedMonth, setSelectedMonth] = useState("");

  // 현재 페이지에 해당하는 항목들을 추출하는 함수
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return regularList.slice(startIndex, endIndex);
  };

  const getDisplayedId = (regularId) => {
    const index = regularList.findIndex((regular) => regular.regularId === regularId);
    return index !== -1 ? index + 1 : ""; // 인덱스를 1부터 시작하도록 +1 해줍니다.
  };


  useEffect(() => {
    const getLogsForCurrentMonth = async () => {
      try {
        const currentMonth = getMonth(currentDate) + 1; // 월은 0부터 시작하므로 1을 더해줌
        const currentYear = getYear(currentDate);
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/regularlist`, {   // 세아
          params: {
            year: currentYear,
            month: currentMonth,
          },
        });
        const sortRegularList = response.data.sort((a, b) => {
          return new Date(a.regTime) - new Date(b.regTime);
        });
        setRegularList(sortRegularList);
        setSelectedMonth(currentMonth);
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      }
    };

    // 현재 월의 로그를 가져오는 함수 호출
    getLogsForCurrentMonth();
  }, [currentDate]);

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
    navigate("/regularreg");
  };

  if (regularList === undefined) {
    return <div> 등록된 정기점검이 없습니다.</div>;
  }

  return (
    <div>
      <UserHeader />
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
      <div className="flex justify-center">
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl w-full">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                {getFormattedDate()} 정기점검 목록
              </h1>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
                  onClick={handleClick}
                >
                  등록하기
                </button>
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
                        번호
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        분류
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        영역
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        점검 일자
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        점검자
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        완료여부
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {getCurrentPageItems().map((regular, index) => (
                      <tr key={regular.regularId}>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          <div className="flex items-center">
                            <div className="mt-1 text-gray-500">
                              {getDisplayedId(regular.regularId)}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          <div className="flex items-center">
                            <Link
                              to={`/regulardetails/${regular.regularId}`}
                              className="font-medium text-seahColor hover:text-seahDeep "
                            >
                              {regular.regularInsName}
                            </Link>
                          </div>
                        </td>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          <div className="flex items-center">
                            <Link
                              to={`/regulardetails/${regular.regularId}`}
                              className="font-medium text-seahColor hover:text-seahDeep "
                            >
                              {regular.regularPart}
                            </Link>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          {format(new Date(regular.regTime), "yyyy-MM-dd HH시 mm분")}
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          {regular.regularPerson}
                        </td>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          <div className="h-11 w-11 flex-shrink-0">
                            {regular.regularComplete === 'OK' ? (
                              <CheckCircleIcon className="text-green-600" />
                            ) : (
                              <XCircleIcon className="text-red-600" />
                            )}
                          </div>
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
          {regularList.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={regularList.length}
              setCurrentPage={setCurrentPage}
            />
          ) : (<p className="flex justify-center">해당 월의 정기점검이 없습니다.</p>)}
        </div>
      </div>
    </div>
  );
}

export default RegularMain;
