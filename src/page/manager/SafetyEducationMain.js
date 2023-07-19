import { useState } from "react";
import Header from "../../components/Header";
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

  const people = [
    {
      name: "[크루미팅] 안전교육수강확인서",
      email: "하절기 작업안전",
      role: "2023-07-20",
      lastSeen: "파일첨부",
      lastSeenDateTime: "2023-01-23T13:23Z",
    },
    {
      name: "[크루미팅] 안전교육수강확인서",
      email: "온열질환의 위험성",
      role: "2023-07-10",
      lastSeen: "파일첨부",
      lastSeenDateTime: "2023-01-23T13:23Z",
    },
    {
      name: "[크루미팅] 안전교육수강확인서",
      email: "올바른 보호구 착용",
      role: "2023-07-08",
      lastSeen: "파일첨부",
      lastSeenDateTime: "2023-01-23T13:23Z",
    },
    {
      name: "[DM미팅] 안전교육수강확인서",
      email: "크레인 작업 위험성",
      role: "2023-07-05",
      lastSeen: "파일첨부",
      lastSeenDateTime: "2023-01-23T13:23Z",
    },
    {
      name: "[DM미팅] 안전교육수강확인서",
      email: "위험반경 접근 금지",
      role: "2023-07-02",
      lastSeen: "파일첨부",
      lastSeenDateTime: "2023-01-23T13:23Z",
    },
    {
      name: "[크루미팅] 안전교육수강확인서",
      email: "일상점검 확인 사항",
      role: "2023-07-01",
      lastSeen: "파일첨부",
      lastSeenDateTime: "2023-01-23T13:23Z",
    },
  ];

  return (
    <div>
      <Header />
      <div className="flex flex-col justify-center items-center text-3xl w-1200 ">
        <div>
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

        <ul
        role="list"
        className=" divide-gray-100 flex justify-center items-center flex-col "
      >
        {people.map((person) => (
          <li key={person.email} className="flex justify-between gap-x-28 py-5">
            <div className="flex gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {person.name}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                  {person.email}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">{person.role}</p>
              {person.lastSeen ? (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {" "}
                  <time dateTime={person.lastSeenDateTime}>
                    {person.lastSeen}
                  </time>
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">Online</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
        
        
        
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
  );
}

export default SafetyEducationMain;
