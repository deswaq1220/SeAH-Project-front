import Header from "../../components/Header";
import {Disclosure, Listbox, Transition} from "@headlessui/react";

//네비게이션
import { Fragment, useEffect, useState } from "react";
//import { Disclosure, Menu, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  CheckCircleIcon,
  XMarkIcon,
  PresentationChartBarIcon
} from "@heroicons/react/24/outline";
import {CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import axios from "axios";

//그래프
import { ResponsiveRadar } from "@nivo/radar";
import { ResponsivePie } from '@nivo/pie'

//엑셀
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function SafetySpecialInspectionStatisticsMonth() {

  //공통: 년도입력, 기본값은 당해로 지정되어 있음
  const options = {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
  };
  const currentDate = new Date();
  const seoulTime = new Intl.DateTimeFormat("en-US", options).format(
      currentDate
  );
  const [month, year] = seoulTime.split("/"); // "08/2023" -> ["08", "2023"]
  const currentYearMonth = `${year}-${month}`;
  const [selectedYear, setSelectedYear] = useState(currentYearMonth);


  //이벤트1: 연도 검색이벤트
  const handleYearChange = (event) => {
    const inputValue = event.target.value;
    const collectFormat = /^\d{4}-\d{2}$/.test(inputValue);

    if (inputValue.length >= 7) {
      if (collectFormat) {
        setSelectedYear(inputValue);
      } else {
        alert("올바른 검색 형식으로 입력해주세요. ex: 2023-08");
      }
    }
  };




  // 이벤트2: 수시점검 분석 결과 엑셀로 내보내기
  const handleExport = () => {
    const data = [
      {
        sheetName: "수시점검 총 건수",
        data: [{ "이번달 수시점검 총 건수": spcCount }],
      },
      {
        sheetName: "점검영역 분석",
        data: partCountForExcel.map((item) => ({
          점검영역: item.sort,
          건수: item.수시점검,
        })),
      },
      {
        sheetName: "위험분류 분석",
        data: dangerCount.map((item) => ({ 위험분류: item[0], 건수: item[1] })),
      },
      {
        sheetName: "위험원인 분석",
        data: [
          ...causeCountForExcel1
              .filter((item) => !(item[0] === '기타(직접입력)' && item[1] === 0)) // 직접입력이면서 값이 0인 경우 제거
              .map((item) => ({ 위험원인: item[0], 건수: item[1] })),

          ...(causeCountForExcel2.length === 0
              ? causeCountForExcel1
                  .filter((item) => item[0] == '기타(직접입력)' && item[1] === 0)
                  .map((item) => ({ 위험원인: item[0], 건수: item[1] }))
              : [
                ...causeCountForExcel2.map((item) => ({ 위험원인: item[0], 건수: item[1] }))
              ])
        ]
      },
    ];

    const workbook = XLSX.utils.book_new();

    data.forEach(({ sheetName, data }) => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const excelFile = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(excelFile, "수시점검_월간분석.xlsx");
  };


  //그 외 변수
    const [spcCount, setSpcCount] = useState([]); //수시점검횟수
    const [partCount, setPartCount] = useState([]);
    const [partCountForExcel, setPartCountForExcel] = useState([]);
    const [dangerCount, setDangerCount] = useState([]);
    const [causeCount, setCauseCount] = useState([]);
    const [causeCountForExcel1, setCauseCountForExcel1] = useState([]);
    const [causeCountForExcel2, setCauseCountForExcel2] = useState([]);




  useEffect(() => {
    if (selectedYear) {
      fetchData();
    }
  }, [selectedYear]);


  const fetchData = async () => {
    try {
      //수시점검
      //점검건수 값
      await axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/admin/special/statistics/count`, {
            params: { yearmonth: selectedYear },
          }) //세아
          .then((response) => {
            setSpcCount(response.data); // 백엔드에서 받아온 데이터를 상태에 설정
          });

      //영역값(엑셀용)
      await axios
          .get(
              `${process.env.REACT_APP_API_BASE_URL}/admin/special/statistics/partandmonth`,
              { params: { yearmonth: selectedYear } }
          )
          .then((response) => {
            setPartCountForExcel(response.data); // 백엔드에서 받아온 데이터를 상태에 설정
          });

      //영역값
      await axios
          .get(
              `${process.env.REACT_APP_API_BASE_URL}/admin/special/statistics/partandmonth`,
              { params: { yearmonth: selectedYear } }
          )
          .then((response) => {
            setPartCount(response.data); // 백엔드에서 받아온 데이터를 상태에 설정
          });

      //위험분류값
      await axios
          .get(
              `${process.env.REACT_APP_API_BASE_URL}/admin/special/statistics/dangerandmonth`,
              { params: { yearmonth: selectedYear } }
          )
          .then((response) => {
            setDangerCount(response.data); // 백엔드에서 받아온 데이터를 상태에 설정
          });

      //위험원인값
      await axios
          .get(
              `${process.env.REACT_APP_API_BASE_URL}/admin/special/statistics/causeandmonth`,
              { params: { yearmonth: selectedYear } }
          )
          .then((response) => {
            setCauseCount(response.data); // 백엔드에서 받아온 데이터를 상태에 설정
          });
      await axios
          .get(
              `${process.env.REACT_APP_API_BASE_URL}/admin/special/statistics/causeandmonthforexcel1`,
              { params: { yearmonth: selectedYear } }
          )
          .then((response) => {
            setCauseCountForExcel1(response.data); // 백엔드에서 받아온 데이터를 상태에 설정
          });
      await axios
          .get(
              `${process.env.REACT_APP_API_BASE_URL}/admin/special/statistics/causeandmonthforexcel2`,
              { params: { yearmonth: selectedYear } }
          )
          .then((response) => {
            setCauseCountForExcel2(response.data); // 백엔드에서 받아온 데이터를 상태에 설정
          });

    } catch (error) {
      console.error("불러온 데이터에 에러가 발생했습니다:", error);
    }
  };
  return (

      <div>
        <Header />

        {/*네비게이션*/}
        <Disclosure as="nav" className="bg-white shadow">
          {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                  <div className="flex h-16 justify-between relative ">
                    <div className="flex items-center px-2 lg:px-0 relative z-10">
                      <PresentationChartBarIcon className="h-8 w-auto text-seahColor mr-2" />
                      <div className="hidden lg:ml-6 lg:flex lg:space-x-8 relative group">
                        <div className="relative">
                          <a
                              href={`${process.env.REACT_APP_API_CERENT_URL}/inspection/statistics/year`}
                              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                          >
                            연간분석
                          </a>
                        </div>
                      </div>
                      <div className="hidden lg:ml-6 lg:flex lg:space-x-8 relative group">
                        <div className="relative">
                          <a
                              href={`${process.env.REACT_APP_API_CERENT_URL}/inspection/statistics/month/special`}
                              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                          >
                            월간분석
                          </a>
                          <div className="absolute left-3 hidden group-hover:block mt-2 bg-white border border-gray-300 rounded-lg shadow-lg top-4">
                            <a
                                href={`${process.env.REACT_APP_API_CERENT_URL}/inspection/statistics/month/special`}
                                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                              수시점검
                            </a>
                            <a
                                href={`${process.env.REACT_APP_API_CERENT_URL}/inspection/statistics/month/regular`}
                                className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                              정기점검
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
                      <div className="w-full max-w-lg lg:max-w-xs">
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                          </div>
                          <input
                              id="yearInput"
                              name="search"
                              className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6"
                              placeholder="날짜 선택"
                              type="month" // 변경된 부분: type을 "date"로 설정
                              onChange={handleYearChange}
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </>
          )}
        </Disclosure>

        {/*내용*/}
        <div className="flex justify-center bg-gray-100 bg-opacity-50">
          <div
              id="safeEdureg"
              className="max-w-screen-lg w-full px-2 flex flex-col items-center mt-4  ring-1 ring-inset rounded-md ring-red-600/10"
          >


            <div className="mt-2 mx-2 w-full ">
              <div className="grid grid-rows-7 gap-6">

                {/* 제목 */}
                <h1 className="text-3xl font-semibold leading-2 text-gray-900 flex items-center justify-between">
                  <span>수시점검</span>
                  <button
                      className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
                      onClick={handleExport}
                  >
                    엑셀저장
                  </button>
                </h1>

                <div className="grid grid-cols-1 gap-6 bg-gray-100 bg-opacity-50">
                  {/*아래쪽 영역 1번*/}
                  <div>
                    <div className="flex justify-between items-baseline">
                      <h5 className="text-xl font-semibold leading-2 text-gray-900">1. 점검 건수</h5>
                    </div>
                    <dl className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-1">
                      <div className="overflow-hidden rounded-lg bg-amber-100 bg-opacity-50 px-3 py-1 shadow sm:p-3 max-w-screen-xl flex items-center justify-center">
                        <dd className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">{spcCount}건</dd>
                      </div>
                    </dl>
                  </div>
                  {/*아래쪽 영역 2번 - 영역별(완료)*/}
                  <div>
                    <h3 className="text-xl font-semibold leading-2 text-gray-900">2. 점검영역 분석(건)</h3>

                    {/*영역별 건수 숫자로 보여주는 메소드*/}
                    {/*                          <dl className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-3">
                                                              {partCount
                                                                  .sort((a, b) => b[1] - a[1]) // 배열을 내림차순으로 정렬
                                                                  .map((item, index) => (
                                                                      <div key={index} className="overflow-hidden rounded-lg bg-white px-4 py-10 shadow sm:max-w-screen-xl">
                                                                          <dt className="truncate text-sm font-medium text-gray-900">{item[0]}파트</dt>
                                                                          <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">{item[1]}건</dd>
                                                                      </div>
                                                                  ))}
                                                          </dl>*/}

                    <div style={{ height: '360px' }}>
                      <ResponsiveRadar
                          data={partCount}
                          keys={['수시점검']}
                          indexBy="sort"
                          margin={{ top: 43, right: 60, bottom: 42, left: 60 }}
                          borderWidth={0.5}
                          borderColor={{ from: 'color' }}
                          gridLabelOffset={36}
                          dotSize={10}
                          dotColor={'#f4f4f6'}
                          dotBorderWidth={2}
                          enableDotLabel={true}
                          dotLabelYOffset={-8}
                          colors={'rgba(111,74,241,0.73)'}
                          blendMode="multiply"
                          motionConfig="wobbly"
                          legends={[
                            {
                              anchor: 'top-left',
                              direction: 'column',
                              translateX: -50,
                              translateY: -40,
                              itemWidth: 80,
                              itemHeight: 20,
                              itemTextColor: '#999',
                              symbolSize: 12,
                              symbolShape: 'circle',
                              effects: [
                                {
                                  on: 'hover',
                                  style: {
                                    itemTextColor: '#000'
                                  }
                                }
                              ]
                            }
                          ]}
                      />
                    </div>

                  </div>
                  {/*아래쪽 영역 3번 - 위험분류별(완료)*/}
                  <div>
                    <h3 className="text-xl font-semibold leading-2 text-gray-900">3. 위험분류 분석(건)</h3>
                    <dl className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-5">
                      {dangerCount
                          .sort((a, b) => b[1] - a[1]) // 배열을 내림차순으로 정렬
                          .map((item, index) => (
                              <div key={index} className="overflow-hidden rounded-lg bg-indigo-100 bg-opacity-90 px-4 py-6 shadow sm:p-10" style={{ padding: 'calc(6% - 0.5rem)' }} >
                                <dt className=" text-lg font-medium text-gray-900">{item[0]}</dt>
                                <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">{item[1] !== 0 ? item[1] : '-'}</dd>
                              </div>
                          ))}
                    </dl>
                  </div>
                  {/*아래쪽 영역 4번 - 위험원인별(완료)*/}
                  <div>
                    <h3 className="text-xl font-semibold leading-2 text-gray-900">4. 위험원인 분석(건)</h3>
                    <dl className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-4">
                      {causeCount
                          .sort((a, b) => b[1] - a[1]) // 배열을 내림차순으로 정렬
                          .map((item, index) => (
                              <div key={index} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:max-w-screen-xl">
                                <dt className="truncate text-lg font-medium text-gray-900">{item[0]}</dt>
                                <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">{item[1] !== 0 ? item[1] : '-'}</dd>
                              </div>
                          ))}
                    </dl>
                  </div>
                </div>
              </div>
            </div> {/*그리드 끝*/}
          </div>
        </div>
      </div>
  );
}

export default SafetySpecialInspectionStatisticsMonth;
