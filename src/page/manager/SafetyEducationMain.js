import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
// import { format, addMonths, subMonths } from "date-fns";
import { format, addMonths, subMonths, getMonth, getYear } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../../components/Pagination";
import { Link } from "react-router-dom";


function SafetyEducationMain() {
  const [currentDate, setCurrentDate] = useState(new Date()); // 년,월
  const [eduList, setEduList] = useState([]); // 안전교육 데이터를 담을 상태 변수

  const itemsPerPage = 10; // 한 페이지당 보여줄 항목 개수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // 현재 페이지에 해당하는 항목들을 추출하는 함수
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return eduList.slice(startIndex, endIndex);
  };

  const getDisplayedId = (eduId) => {
    const index = eduList.findIndex((edu) => edu.eduId === eduId);
    return index !== -1 ? index + 1 : ""; // 인덱스를 1부터 시작하도록 +1 해줍니다.
  };


  useEffect(() => {
    const getLogsForCurrentMonth = async () => {
      try {
        const currentMonth = getMonth(currentDate) + 1; // 월은 0부터 시작하므로 1을 더해줌
        const currentYear = getYear(currentDate);
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/edumain`, {
          // 세아
          // const response = await axios.get(`http://localhost:8081/edumain, {
          params: {
            year: currentYear,
            month: currentMonth,
          },
          headers: {
            'Content-Type': 'application/json',
          },


        });
        const sortedEduList = response.data;
        setEduList(sortedEduList);
        setSelectedMonth(currentMonth);
        console.log(response.data);
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      }
    };

    // 현재 월의 로그를 가져오는 함수 호출
    getLogsForCurrentMonth();
  }, [selectedCategory, currentDate]);

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
    navigate("/edureg");
  };

  // eduList가 undefined일 때 처리
  if (eduList === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
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
                안전교육 조회목록
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                {getFormattedDate()} 안전교육 목록입니다
              </p>
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
                        제목
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        내용
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        교육일
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        교육시간
                      </th>                
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        강사
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        작성자
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        첨부파일
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {getCurrentPageItems().map((edu, index) => (
                      <tr key={edu.eduId}>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          <div className="flex items-center">
                            <div className="mt-1 text-gray-500">
                              {getDisplayedId(edu.eduId)}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          <div className="flex items-center">
                            <Link
                              to={`/edudetails/${edu.eduId}`} // 해당 아이디 디테일 페이지로 이동하는 경로 설정
                              className="font-medium text-seahColor hover:text-seahDeep "
                            >
                              {edu.eduTitle}
                            </Link>
                          </div>
                        </td>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          <div className="flex items-center">
                            <Link
                              to={`/edudetails/${edu.eduId}`} // 해당 아이디 디테일 페이지로 이동하는 경로 설정
                              className="font-medium text-seahColor hover:text-seahDeep truncate"
                              style={{ width: "150px" }} // 예시로 150px 너비를 지정
                            >
                              {edu.eduContent}
                            </Link>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          {format(new Date(edu.eduStartTime), "yyyy-MM-dd HH시 mm분")}
                        </td>

                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          {edu.eduSumTime} 분
                        </td>

                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          {edu.eduInstructor}
                        </td>

                        
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          {edu.eduWriter}
                        </td>

                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">

                          {edu.eduFileList.length > 0 ? (
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              첨부
                            </span>
                          )
                            : null}
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
          {eduList.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={eduList.length}
              setCurrentPage={setCurrentPage}
            />
          ) : (<p className="flex justify-center">해당 월의 교육은 없습니다.</p>)}
        </div>
      </div>
    </div>
  );
}

export default SafetyEducationMain;
