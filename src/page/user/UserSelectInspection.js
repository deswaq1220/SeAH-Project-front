import UserHeader from "../../components/UserHeader";

import {
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";



function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UserSelectInspection() {
  const { masterdataPart } = useParams(); // url 영역 파라미터
  const { masterdataFacility } = useParams(); // url 설비 파라미터


  // function 위에 있던거 function으로 옮겼음
  const actions = [
    {
      title: "정기점검",
      sub: "공정별 어쩌구,, 뭐시기를 정기점검 데모텍스트",
      href: "#",
      icon: ClipboardDocumentListIcon,
      iconForeground: "text-teal-700",
      iconBackground: "bg-teal-50",
    },
    {
      title: "수시점검",
      sub: "공정별 어쩌구,, 뭐시기를 수시점검 데모텍스트",
      href: `/special/list/${masterdataPart}/${masterdataFacility}`,
      icon: ClipboardDocumentCheckIcon,
      iconForeground: "text-purple-700",
      iconBackground: "bg-purple-50",
    },
  ];

  const regular = [
    // { name: '정기점검', href: '#', icon: UsersIcon, current: false },
    {
      name: "점검완료",
      href: "#",
      icon: ShieldCheckIcon,
      count: "5",
      current: true,
      iconForeground: "text-green-600",
    },
    {
      name: "미점검",
      href: "#",
      icon: XCircleIcon,
      count: "12",
      current: false,
      iconForeground: "text-yellow-600",
    },
    {
      name: "조치필요",
      href: "#",
      icon: ShieldExclamationIcon,
      count: "20+",
      current: false,
      iconForeground: "text-red-600",
    },
  ];



  const [monthlyAll, setMonthlyAll] = useState(0);                // 월별 수시점검 실시 정보
  const [monthlyComplete, setMonthlyComplete] = useState(0);      // 월별 수시점검 완료 정보
  const [monthlyNoComplete, setMonthlyNoComplete] = useState(0);  // 이번달 deadline 중 조치필요 정보

  useEffect(() => {
    // Json값 가져와서 세팅
    function fetchDataWithAxios(masterdataPart, masterdataFacility) {
      axios
          .get(`http://172.20.20.252:8081/special/${masterdataPart}/${masterdataFacility}`)   // 세아
          // .get(`http://localhost:8081/special/${masterdataPart}/${masterdataFacility}`)
          // .get(`http://192.168.202.1:8081/special/${masterdataPart}/${masterdataFacility}`)
          .then((response) => {
            const data = response.data;
            // 가져온 데이터로 상태 변수 업데이트
            setMonthlyAll(data.monthlyAll);
            setMonthlyComplete(data.monthlyComplete);
            setMonthlyNoComplete(data.monthlyNoComplete);
            console.log(data); // JSON 데이터가 출력됩니다.
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            console.error("에러가?:", error);
          });
    }

    fetchDataWithAxios(masterdataPart, masterdataFacility);
  }, [masterdataPart, masterdataFacility]);


  const frequent = [
    {
      name: "점검실시",
      href: "#",
      icon: ShieldCheckIcon,
      count: monthlyAll.toString(),
      current: true,
      iconForeground: "text-green-600",
    },
    {
      name: "조치완료",
      href: "#",
      icon: ShieldExclamationIcon,
      count: monthlyComplete.toString(),
      current: false,
      iconForeground: "text-blue-600",
    },
    {
      name: "조치필요",
      href: "#",
      icon: ShieldExclamationIcon,
      count: monthlyNoComplete.toString(),
      current: false,
      iconForeground: "text-red-600",
    },
    // { name: 'Calendar', href: '#', icon: CalendarIcon, count: '20+', current: false },
    // { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
    // { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
  ];





  return (
    <div className="container mx-auto sm:px-6 lg:px-8 px-4">
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
              "group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
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
            <DocumentCheckIcon className="w-6 h-6 mr-1" />
            {/*------------------------  수정 필요  -------------------------*/}
            7월 점검현황
            {/*------------------------  수정 필요  -------------------------*/}
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
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  )}
                >
                  <span
                    className={classNames(
                      item.iconForeground,
                      "inline-flex"
                    )}
                    style={{ backgroundColor: item.iconBackground }}
                  >
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className={item.current ? "text-green-600" : "text-gray-700"}>
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
          <p className="text-lg font-semibold" >수시점검</p>
          <ul role="list" className="-mx-2 space-y-1">
            {frequent.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-50 text-green-600"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                  )}
                >
                  <span
                    className={classNames(
                      item.iconForeground,
                      "inline-flex"
                    )}
                    style={{ backgroundColor: item.iconBackground }}
                  >
                    <item.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className={item.current ? "text-green-600" : "text-gray-700"}>
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
        </nav>
      </div>
    </div>
  );
}