import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import axios from "axios";
import { format, addMonths, subMonths, getMonth, getYear } from "date-fns";
import Pagination from "../../components/Pagination";
import { useNavigate } from 'react-router-dom';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function EduStatics() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eduList, setEduList] = useState([]); // 교육 목록을 담을 상태 변수
  const [selectedMonth, setSelectedMonth] = useState(getMonth(currentDate) + 1); // 선택된 월을 담을 상태 변수

  const itemsPerPage = 10; // 한 페이지당 보여줄 항목 개수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [data, setData] = useState([]); // 안전교육 데이터를 담을 상태 변수
  const [monthlyEduTime, setMonthlyEduTime] = useState({
    total: 0,
    CREW: 0,
    MANAGE: 0,
    DM: 0,
    ETC: 0,
  });

  const navigate = useNavigate();

  const handleStatClick = async (category) => {
    try {
      const currentMonth = getMonth(currentDate) + 1;
      const currentYear = getYear(currentDate);
      // 월&카테고리 별 교육시간 총 합계
      const response = await  axios.get(
        //`http://172.20.20.252:8081/edustatistics/getmonthlyedulist`, {   // 세아
         `http://localhost:8081/edustatistics/getmonthlyedulist`, {
        // `http://192.168.202.1:8081/edustatistics/getmonthlyedulist`, {
        params: {
          year: currentYear,
          month: currentMonth,
          eduCategory: category
        },
      });
      const data = response.data;
      console.log(data);
      setEduList(data); // eduList 업데이트
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
    }
  
    console.log(`Clicked on category: ${category}`);
  };


  // 현재 페이지에 해당하는 항목들을 추출하는 함수
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    console.log("검색 리스트2?"  + eduList);
    
    return eduList.slice(startIndex, endIndex);
  };


  const getDisplayedId = (eduId) => {
    const index = data.findIndex((edu) => edu.eduId === eduId);
    return index !== -1 ? index + 1 : ""; // 인덱스를 1부터 시작하도록 +1 해줍니다.
  };



  useEffect(() => {
    const getLogsForCurrentMonth = async () => {
      try {
        const currentMonth = getMonth(currentDate) + 1; // 월은 0부터 시작하므로 1을 더해줌
        const currentYear = getYear(currentDate);
        
        // 월&카테고리 별 교육시간 총 합계
        const response = await axios.get(
          //`http://172.20.20.252:8081/edustatistics/getmonthlyruntime`, {   // 세아
           `http://localhost:8081/edustatistics/getmonthlyruntime`, {
          // `http://192.168.202.1:8081/edustatistics/getmonthlyruntime`, {
          params: {
            year: currentYear,
            month: currentMonth
          },
        });
        const data = response.data;
        setMonthlyEduTime({
          total: data[0],
          CREW: data[1],
          MANAGE: data[2],
          DM: data[3],
          ETC: data[4],
        });
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      }
    };

    // 현재 월의 로그를 가져오는 함수 호출
    getLogsForCurrentMonth();
  }, [currentDate]);

  useEffect(() => {
    const  getStartPage =async  () => {
      try {
        const currentMonth = getMonth(currentDate) + 1; // 월은 0부터 시작하므로 1을 더해줌
        const currentYear = getYear(currentDate);
        // 월&카테고리 별 교육시간 총 합계
        const response = await axios.get(
            //`http://172.20.20.252:8081/edustatistics/getmonthlyedulist`, {   // 세아
          `http://localhost:8081/edustatistics/getmonthlyedulist`, {
          params: {
            year: currentYear,
            month: currentMonth,
            eduCategory: null
          },
        });
        const data = response.data;
    
        setEduList(data);
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
        setEduList([]);
      }
    };
    getStartPage();
  }, [currentDate]);

    // 엑셀!!!!!!!!!!!
    const createExcelData = (eduList) => {

      // 교육 정보를 바탕으로 엑셀 데이터를 생성하는 로직 작성
      const data = eduList.map((item) => ({
        제목: `${item[0]}`,
        교육일정: `${item[1]}`,
        교육시간: `${item[2]} 분`,
      }));
        
      return data;
    };
    
    const handleExport = () => {
      
      if (!eduList || eduList.length === 0) {
        console.log("데이터가 없습니다.");
        return;
      }
      // 엑셀 데이터 생성
      const data = createExcelData(eduList);
      
      console.log("저장");
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
      saveAs(excelFile, `안전교육시간.xlsx`);
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

  //테일윈드에서 가져옴
  const stats = [
    { name: '전체 시간', value: `${monthlyEduTime.total} 분`, category: null },
    { name: '크루미팅', value: `${monthlyEduTime.CREW} 분`, category: 'CREW' },
    { name: 'DM미팅', value: `${monthlyEduTime.DM} 분`, category: 'DM' },
    { name: '관리감독', value: `${monthlyEduTime.MANAGE} 분`, category: 'MANAGE' },
    { name: '기타', value: `${monthlyEduTime.ETC} 분`, category: 'ETC' },
  ];


  return (
    <div>
      <Header />

      {/* 달력  */}
      <div className="flex flex-col justify-center items-center text-3xl mt-28">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          월별 교육 합계 시간
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

      {/* 여기까지가 달력 */}

      <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
            onClick={() => handleStatClick(stat.category)}
          >
            <dt className="text-sm font-medium leading-6 text-gray-500">{stat.name}</dt>
            <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
              {stat.value}
            </dd>

          </div>
        ))}
      </dl>

      {/* 해당 카테고리 교육 목록 출력 */}
      <div className="flex justify-center">
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl w-full">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="mt-2 text-sm text-gray-700">
                {getFormattedDate()} 안전교육 목록입니다
              </h1>
              <button
              type="button"
              className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
              onClick={handleExport}
            >
              엑셀 저장
            </button>
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
                        교육일
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        교육 시간
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {getCurrentPageItems().map((edu, index) => (

                      <tr key={index}>
                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                          <div className="flex items-center">
                            <div className="mt-1 text-gray-500">
                              {index + 1}
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          {edu[1]}
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          {edu[2]}
                        </td>
                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                          {edu[3]} 분
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
          ) : (
            <p className="flex justify-center">해당 월의 교육은 없습니다.</p>)}
        </div>
      </div>


    </div>
  );
}

export default EduStatics;
