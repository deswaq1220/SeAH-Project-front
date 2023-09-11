import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import axios from "axios";
import Pagination from "../../components/Pagination";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format, addMonths, subMonths, getMonth, getYear } from "date-fns";
import { async } from "q";
// 부서 드롭다운
const department = [
  { id: null, name: "부서" },
  { id: 1, name: "소형압연팀" },
  { id: 2, name: "압출팀" },
  { id: 3, name: "주조팀" },
];

function EduAttenStatics() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [attenList, setAttenList] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [searchDepartment, setSearchDepartment] = useState("부서");
  const [searchName, setSearchName] = useState("");

  const [monthlyEduTime, setMonthlyEduTime] = useState({
    total: 0,
    CREW: 0,
    MANAGE: 0,
    DM: 0,
    ETC: 0,
  });

  //테일윈드에서 가져옴 
  const stats = [
    { name: '전체 시간', value: `${monthlyEduTime.total} 분`, category: null },
    { name: '크루미팅', value: `${monthlyEduTime.CREW} 분`, category: 'CREW' },
    { name: 'DM미팅', value: `${monthlyEduTime.DM} 분`, category: 'DM' },
    { name: '관리감독', value: `${monthlyEduTime.MANAGE} 분`, category: 'MANAGE' },
    { name: '기타', value: `${monthlyEduTime.ETC} 분`, category: 'ETC' },
  ];


  useEffect(() => {
    const getLogsForCurrentMonth = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/admin/edustatistics/atten`, {
          params: {
            year: getYear(currentDate),
            eduCategory: selectedCategory,
            month: getMonth(currentDate) + 1,
            department: searchDepartment,
            name: searchName,
          },
        }
        );

        const data = response.data;
        if (selectedCategory === "") {
          const { attenNameSumEduTimeList } = data;
          setMonthlyEduTime({
            total: attenNameSumEduTimeList[0],
            CREW: attenNameSumEduTimeList[1],
            DM: attenNameSumEduTimeList[2],
            MANAGE: attenNameSumEduTimeList[3],
            ETC: attenNameSumEduTimeList[4],
          });
        }

        setAttenList(data.eduStatisticsDTO);
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      }
    };

    getLogsForCurrentMonth();
  }, [selectedCategory, currentDate]);


  //검색
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/edustatistics/atten`, {
        params: {
          year: getYear(currentDate),
          eduCategory: selectedCategory,
          month: getMonth(currentDate) + 1,
          department: searchDepartment,
          name: searchName,
        },
      }
      );

      const data = response.data;
      setAttenList(data.eduStatisticsDTO);
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
    }
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/edustatistics/atten`, {
        params: {
          year: getYear(currentDate),
          eduCategory: null,
          month: getMonth(currentDate) + 1,
          department: searchDepartment,
          name: searchName,
        },
      }
      );

      const data = response.data;
      setAttenList(data.eduStatisticsDTO);
      const { attenNameSumEduTimeList } = data;
      setMonthlyEduTime({
        total: attenNameSumEduTimeList[0],
        CREW: attenNameSumEduTimeList[1],
        DM: attenNameSumEduTimeList[2],
        MANAGE: attenNameSumEduTimeList[3],
        ETC: attenNameSumEduTimeList[4],
      });
      return attenNameSumEduTimeList;
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
    }
  };


  // 엑셀!!!!!!!!!!!
  const createExcelData = (attenList, attenNameSumEduTimeList) => {
    const categoryHeaders = {
      전체_수강시간: attenNameSumEduTimeList[0]+"분",
      크루미팅: attenNameSumEduTimeList[1]+"분",
      DM미팅: attenNameSumEduTimeList[2]+"분",
      관리감독: attenNameSumEduTimeList[3]+"분",
      기타: attenNameSumEduTimeList[4]+"분",
    };
  
    // 교육 정보를 바탕으로 엑셀 데이터를 생성하는 로직 작성
    const data = [
      categoryHeaders, // 카테고리 별 합계 시간 행
      ...attenList.map((item) => ({
        제목: `${item.eduTitle}`,
        교육일정: `${item.eduStartTime}`,
        교육시간: `${item.eduSumTime} 분`,
        부서: item.attenDepartment,
        사원번호: `${item.attenEmployeeNumber}`,
        이름: item.attenName,
      })),
    ];
  
    return data;
  };

  const handleExport = async () => {
    if (!attenList || attenList.length === 0) {
      console.log("데이터가 없습니다.");
      return;
    }

    const attenNameSumEduTimeList = await handleSearch();

    // 엑셀 데이터 생성
    const data = createExcelData(attenList, attenNameSumEduTimeList);

    // 엑셀 시트 생성
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 엑셀 워크북 생성
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // 엑셀 파일 저장
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelFile = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(excelFile, `안전교육_출석_통계.xlsx`);
  };



  //달력 넣기
  const goToPreviousMonth = () => {
    const previousMonthDate = subMonths(currentDate, 1);
    setSelectedCategory("");
    setCurrentDate(previousMonthDate);
  };

  const goToNextMonth = () => {
    setSelectedCategory("");
    const nextMonthDate = addMonths(currentDate, 1);
    setCurrentDate(nextMonthDate);
  }

  const getFormattedDate = () => {
    const year = currentDate.getFullYear();
    const month = format(currentDate, "M월");

    return `${year}. ${month}`;
  };

  //여기까지 달력 넣음

  if (attenList === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

      {/* 드롭다운 메뉴 */}
      <div className="flex justify-center mt-4">
        <div className="mx-2">
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
        <div className=" flex">
          <label className="block text-sm font-medium text-gray-700 mr-2">이름</label>
          <input
            type="text"
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                handleSearch();
              }
            }}
            value={searchName}
            placeholder="이름"
            className="block w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
          />
        </div>
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-seahColor hover:bg-seahDeep focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-seahColor"
        >
          검색
        </button>
      </div>

      {/* 카테고리 선택 */}
      <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-1 lg:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8 hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedCategory(stat.category)}
          >
            <dt className="text-sm font-medium leading-6 text-gray-500">{stat.name}</dt>
            <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
              {stat.value}
            </dd>

          </div>
        ))}
      </dl>


      <div className="flex justify-center mt-8">
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl w-full">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
            </div>
            <button
              type="button"
              className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
              onClick={handleExport}
            >
              엑셀 저장
            </button>
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
                    {attenList.map((item, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          {item.eduTitle}
                        </td>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          {format(new Date(item.eduStartTime), "yyyy-MM-dd HH시 mm분")}
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
          {attenList ? (
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={attenList.length}
              setCurrentPage={setCurrentPage}
            />
          ) : (
            <p className="flex justify-center">해당 월에는 교육이 예정되어 있지 않습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EduAttenStatics;
