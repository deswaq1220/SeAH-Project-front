import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import axios from "axios";
import Pagination from "../../components/Pagination";
import { format, addMonths, subMonths, getMonth, getYear } from "date-fns";
// 부서 드롭다운
const department = [
  { id: null, name: "부서" },
  { id: 1, name: "소형연압팀" },
  { id: 2, name: "압출팀" },
  { id: 3, name: "주조팀" },
];

function EduAttenStatics() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [attendeesList, setAttendeesList] = useState([]);
  const categories = ["CREW", "MANAGE", "DM", "ETC"];
  // 선택된 카테고리를 상태로 관리
  const [selectedCategory, setSelectedCategory] = useState("");


  // 드롭다운 메뉴와 입력 필드를 통해 부서와 이름을 검색하도록 상태를 추가
  const [searchDepartment, setSearchDepartment] = useState("부서");
  const [searchName, setSearchName] = useState("");

  const filteredAttendeesList = attendeesList.filter((item) => {
    const isDepartmentMatched =
      searchDepartment === "부서" || item.attenDepartment === searchDepartment;
    const isNameMatched =
      searchName === "이름" ||
      item.attenName.toLowerCase().includes(searchName.toLowerCase());

    return isDepartmentMatched && isNameMatched;
  });


  useEffect(() => {
    // 현재 월의 로그를 가져오는 함수
    const getLogsForCurrentMonth = async () => {
      try {
        const currentMonth = getMonth(currentDate) + 1; // 월은 0부터 시작하므로 1을 더해줌
        const currentYear = getYear(currentDate);
        const response = await axios.get("http://localhost:8081/edustatistics/getmonth", {
          params: {
            eduCategory: selectedCategory,
            month: currentMonth,
          },
        });
        const sortedAttendeesList = response.data.sort((a, b) => {
          // eduStartTime을 기준으로 오름차순 정렬
          return new Date(a.eduStartTime) - new Date(b.eduStartTime);
        });
        setAttendeesList(sortedAttendeesList);
        setSelectedMonth(currentMonth);
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      }
    };

    // 현재 월의 로그를 가져오는 함수 호출
    getLogsForCurrentMonth();
  }, [selectedCategory, currentDate]);

  //이름 검색
  const handleSearch = () => {
    axios
      .get("http://localhost:8081/edustatistics/getmonth", {
        params: {
          eduCategory: selectedCategory,
          month: selectedMonth,
          department : searchDepartment,
          name: searchName, // 이름으로 검색하기 위해 searchName을 전달
        },
      })
      .then((response) => {
        setAttendeesList(response.data);
      })
      .catch((error) => {
        console.error("Error 난리 났다 난리났어", error);
      });
  };


  //카테고리 라벨
  const getCategoryLabel = (category) => {
    switch (category) {
      case "CREW":
        return "크루미팅";
      case "DM":
        return "DM미팅";
      case "MANAGE":
        return "관리감독";
      case "ETC":
        return "기타";
      default:
        return category;
    }
  };

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

  //여기까지 달력 넣음

  if (attendeesList === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />

      {/* 달력  */}
      <div className="flex flex-col justify-center items-center text-3xl mt-28">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          월별 교육 참가자 명단</h1>
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
      {/* 여기까지가 달력 */}

      {/*카테고리 메뉴*/}
      <div className="flex justify-center mt-4">
        <div className="px-4">
          <nav className="flex space-x-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${selectedCategory === category
                  ? "text-white bg-seahColor hover:bg-seahDeep focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-seahColor"
                  : "text-seahColor hover:text-seahDeep"
                  }`}
              >
                {getCategoryLabel(category)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 드롭다운 메뉴 */}
      <div className="flex justify-center mt-4">
        <div className="px-4">
          <label className="block text-sm font-medium text-gray-700"></label>
          <select
            onChange={(e) => setSearchDepartment(e.target.value)}
            value={searchDepartment}
            className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-seahColor focus:border-seahColor sm:text-sm rounded-md"
          >
            {department.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="px-4">
          <label className="block text-sm font-medium text-gray-700">이름</label>
          <input
            type="text"
            onChange={(e) => setSearchName(e.target.value)}
            value={searchName}
            className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-seahColor focus:border-seahColor sm:text-sm rounded-md"
          />
        </div>
        <button
          onClick={handleSearch}
          className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-seahColor hover:bg-seahDeep focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-seahColor"
        >
          검색
        </button>
      </div>
      {/* 드롭다운 메뉴와 입력 필드 */}

      <div className="flex justify-center mt-8">
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl w-full">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
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
                        제목
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        교육 일정
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
                        부서
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        사원번호
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                      >
                        참석자 이름
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {attendeesList.map((item, index) => (
                      <tr key={index}>
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
                          {item.attenDepartment}
                        </td>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          {item.attenEmployeeNumber}
                        </td>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          {item.attenName}
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
            <p className="flex justify-center">해당 월의 교육은 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EduAttenStatics;
