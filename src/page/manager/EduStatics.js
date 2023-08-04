import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import axios from "axios";
import { format, addMonths, subMonths, getMonth, getYear } from "date-fns";

function EduStatics() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthlyEduTime, setMonthlyEduTime] = useState({
    total: 0,
    CREW: 0,
    MANAGE: 0,
    DM: 0,
    ETC: 0,
  });

  const fetchMonthlyEduTime = async (month) => {
    try {
      const response = await axios.get(
        `http://172.20.20.252:8081/edustatistics/getmonthlyruntime?month=${month}`
      );

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

  // useEffect(() => {
  //   const currentMonth = new Date().getMonth() + 1;
  //   fetchMonthlyEduTime(currentMonth);
  // }, []);



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
    { name: '전체 시간', value: `${monthlyEduTime.total} 분` },
    { name: '크루미팅', value: `${monthlyEduTime.CREW} 분` },
    { name: 'DM미팅', value: `${monthlyEduTime.DM} 분` },
    { name: '관리감독', value: `${monthlyEduTime.MANAGE} 분` },
    { name: '기타', value: `${monthlyEduTime.ETC} 분` },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <div>
      <Header />
      {/* 달력  */}
      <div className="flex flex-col justify-center items-center text-3xl mt-28">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          월별 교육 참가자 명단
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

      <h2>월별 교육 시간 통계</h2>
      <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
          >
            <dt className="text-sm font-medium leading-6 text-gray-500">{stat.name}</dt>
            <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default EduStatics;
