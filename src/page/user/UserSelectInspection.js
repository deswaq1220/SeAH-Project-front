import UserHeader from "../../components/UserHeader";
import {
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  DocumentCheckIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  XCircleIcon, ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
import { format, addMonths, subMonths } from "date-fns";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UserSelectInspection() {
  const { masterdataPart } = useParams(); // url 영역 파라미터
  const { masterdataId } = useParams(); // url 설비코드 파라미터
  const [currentDate, setCurrentDate] = useState(new Date()); // 년,월
  const navigate = useNavigate();

  // 수시점검
  const [monthlyAll, setMonthlyAll] = useState(0); // 월별 수시점검 실시 정보
  const [monthlyComplete, setMonthlyComplete] = useState(0); // 월별 수시점검 완료 정보
  const [monthlyNoComplete, setMonthlyNoComplete] = useState(0); // 이번달 deadline 중 조치필요 정보
  // 정기점검
  const [monthlyAllReg, setMonthlyAllReg] = useState(0); // 월별 정기점검 실시 정보
  const [monthlyCompleteReg, setMonthlyCompleteReg] = useState(0); // 월별 정기점검 완료 정보
  const [monthlyBad, setMonthlyBadReg] = useState(0); // 월별 불량건수 정보

  useEffect(() => {

    // 모바일에서 스와이프 뒤로가기 감지해서 get 요청 다시
    window.onpageshow = function(event) {
      if ( event.persisted ) {
        fetchDataWithAxios(masterdataPart, masterdataId);
      }
    }
    fetchDataWithAxios(masterdataPart, masterdataId);
  });


  // Json값 가져와서 세팅
  function fetchDataWithAxios(masterdataPart, masterdataId) {
    const apiUrls = [
      `${process.env.REACT_APP_API_BASE_URL}/user/special/${masterdataPart}/${masterdataId}`,
      `${process.env.REACT_APP_API_BASE_URL}/user/regular/${masterdataPart}/${masterdataId}`,
    ];

    // 여러 개의 API를 호출하는 프로미스 배열 생성
    const apiRequests = apiUrls.map((url) => axios.get(url));

    // 모든 API 호출을 기다리고 결과를 처리
    Promise.all(apiRequests)
        .then((responses) => {
          // 모든 API 호출이 성공하면 여기로 진입
          const responseData = responses.map((response) => response.data);

          // 가져온 데이터로 상태 변수 업데이트
          // 수시점검
          setMonthlyAll(responseData[0].monthlyAll);
          setMonthlyComplete(responseData[0].monthlyComplete);
          setMonthlyNoComplete(responseData[0].monthlyNoComplete);
          // 정기점검
          setMonthlyAllReg(responseData[1].monthlyAll);
          setMonthlyCompleteReg(responseData[1].monthlyComplete);
          setMonthlyBadReg(responseData[1].monthlyBad);

        })
        .catch((errors) => {
          // 하나 이상의 API 호출이 실패한 경우 에러 처리
          console.error("Error fetching data:", errors);
        });
  }


  // function 위에 있던거 function으로 옮겼음
  const actions = [
    {
      title: "정기점검",
      sub: "점검항목에 따른 정기점검을 할 수 있습니다.",
      href: "/regular",
      icon: ClipboardDocumentListIcon,
      iconForeground: "text-teal-700",
      iconBackground: "bg-teal-50",
    },
    {
      title: "수시점검",
      sub: "영역 및 설비에 따른 수시점검을 할 수 있습니다.",
      href: `/special/list/${masterdataPart}/${masterdataId}`,
      icon: ClipboardDocumentCheckIcon,
      iconForeground: "text-purple-700",
      iconBackground: "bg-purple-50",
    },
  ];

  const regular = [
    {
      name: "점검실시",
      icon: WrenchScrewdriverIcon,
      count: monthlyAllReg.toString(),
      current: true,
      iconForeground: "text-blue-600",
    },
    {
      name: "조치완료",
      icon: ShieldCheckIcon,
      count: monthlyCompleteReg.toString(),
      current: false,
      iconForeground: "text-green-600",
    },
    {
      name: "불량건수",
      icon: ExclamationCircleIcon,
      count: monthlyBad.toString(),
      current: false,
      iconForeground: "text-red-600",
    },
  ];

  const frequent = [
    {
      name: "점검실시",
      icon: WrenchScrewdriverIcon,
      count: monthlyAll.toString(),
      current: true,
      iconForeground: "text-blue-600",
    },
    {
      name: "조치완료",
      icon: ShieldCheckIcon,
      count: monthlyComplete.toString(),
      current: false,
      iconForeground: "text-green-600",
    },
    {
      name: "조치필요",
      icon: ShieldExclamationIcon,
      count: monthlyNoComplete.toString(),
      current: false,
      iconForeground: "text-red-600",
    },
  ];

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

    return `${year}년 ${month}`;
  };

  return (
    <div className="container mx-auto sm:px-6 lg:px-8 px-4 mb-6">
      <UserHeader />
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
        {actions.map((action, actionIdx) => (
          <div
            key={action.title}
            className={classNames(
              actionIdx === 0
                ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none"
                : "",
              actionIdx === 1 ? "sm:rounded-tr-lg" : "",
              actionIdx === actions.length - 2 ? "sm:rounded-bl-lg" : "",
              actionIdx === actions.length - 1
                ? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none"
                : "",
              "group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-seahColor"
            )}
          >
            <div>
              <span
                className={classNames(
                  action.iconBackground,
                  action.iconForeground,
                  "inline-flex rounded-lg p-3 ring-4 ring-white"
                )}
              >
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                <a href={action.href} className="focus:outline-none">
                  {/* Extend touch target to entire panel */}
                  <span className="absolute inset-0" aria-hidden="true" />
                  {action.title}
                </a>
              </h3>
              <p className="mt-2 text-sm text-gray-500">{action.sub}</p>
            </div>
            <span
              className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
              aria-hidden="true"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <nav className="flex flex-1 flex-col" aria-label="Sidebar">
          <p className="flex justify-center font-semibold text-lg mb-2">
            <CalendarDaysIcon className="w-6 h-6 mr-1" />
            {getFormattedDate()} 점검현황
          </p>
          <p className=" text-lg font-semibold">정기점검</p>
          <ul role="list" className="-mx-2 space-y-1 mb-3">
            {regular.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-50 text-green-600"
                      : "text-gray-700 hover:text-indigo-600",
                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  )}
                >
                  <span
                    className={classNames(item.iconForeground, "inline-flex")}
                    style={{ backgroundColor: item.iconBackground }}
                  >
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span
                    className={
                      item.current ? "text-blue-600" : "text-gray-700"
                    }
                  >
                    {item.name}
                  </span>
                  {item.count ? (
                    <span
                      className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-600 ring-1 ring-inset ring-gray-200"
                      aria-hidden="true"
                    >
                      {item.count} 건
                    </span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="rounded-md bg-seahColor px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor my-4"
            onClick={() => navigate("/regularinsstatus")}
          >
            정기점검 현황
          </button>
          <p className="text-lg font-semibold">수시점검</p>
          <ul role="list" className="-mx-2 space-y-1">
            {frequent.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-50 text-blue-600"
                      : "text-gray-700 hover:text-indigo-600 ",
                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  )}
                >
                  <span
                    className={classNames(item.iconForeground, "inline-flex")}
                    style={{ backgroundColor: item.iconBackground }}
                  >
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span
                    className={item.current ? "text-blue-600" : "text-gray-700"}
                  >
                    {item.name}
                  </span>
                  {item.count ? (
                    <span
                      className="ml-auto w-9 min-w-max whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-600 ring-1 ring-inset ring-gray-200"
                      aria-hidden="true"
                    >
                      {item.count} 건
                    </span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => navigate("/frequentinspection")}
            className="rounded-md bg-seahColor px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor mt-4"
          >
            수시점검 현황
          </button>
        </nav>
      </div>
    </div>
  );
}
