import Header from "../../components/Header";
import {Disclosure} from "@headlessui/react";
import {ChartPieIcon} from "@heroicons/react/24/solid"; //아이콘

//네비게이션
import {Fragment, useEffect, useState} from 'react'
//import { Disclosure, Menu, Transition } from '@headlessui/react'
import {Bars3Icon, BellIcon, CheckCircleIcon, XMarkIcon} from '@heroicons/react/24/outline'
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import axios from "axios";

//엑셀
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';
function SafetyInspectionStatisticsMonthImg() {

    //공통: 년도입력, 기본값은 당해로 지정되어 있음
    const options = {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit'
    };
    const currentDate = new Date();
    const seoulTime = new Intl.DateTimeFormat('en-US', options).format(currentDate);
    const [month, year] = seoulTime.split('/'); // "08/2023" -> ["08", "2023"]
    const currentYearMonth = `${year}-${month}`;

    const [selectedYear, setSelectedYear] = useState(currentYearMonth);
    //console.log(currentYearMonth);

    //이벤트1: 연도 검색이벤트
    const handleYearChange = (event) => {
        const inputValue = event.target.value;
        const collectFormat = /^\d{4}-\d{2}$/.test(inputValue);

        if (inputValue.length >= 7) {
            if (collectFormat) {
                setSelectedYear(inputValue);
            } else {
                alert('올바른 검색 형식으로 입력해주세요. ex: 2023-08');
            }
        }
    };

    // 이벤트2: 월간 분석 결과 엑셀로 내보내기
    const handleExport = () => {
        const data = [
            { sheetName: '이번달 수시점검 건수', data: [{ "수시점검 건수": spcCount }] },
            { sheetName: '점검영역 분석', data: partCount.map(item => ({ "점검영역": item[0], "건수": item[1] })) },
            { sheetName: '위험분류 분석', data: dangerCount.map(item => ({ "위험분류": item[0], "건수": item[1] })) },
            { sheetName: '위험원인 분석', data: causeCount.map(item => ({ "위험원인": item[0], "건수": item[1] })) },
        ];

        const workbook = XLSX.utils.book_new();

        data.forEach(({ sheetName, data }) => {
            const worksheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        });

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });

        const excelFile = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        saveAs(excelFile, '분석_결과.xlsx');
    };




    const [spcCount, setSpcCount] = useState([]);
    const [partCount, setPartCount] = useState([]);
    const [dangerCount, setDangerCount] = useState([]);
    const [causeCount, setCauseCount] = useState([]);

    useEffect(() => {

        if (selectedYear) {
            fetchData();
        }
    }, [selectedYear]);


    const fetchData = async () => {
        try {

            //점검건수 값
            //await axios.get(`http://172.20.20.252:8081/special/statistics/count`, { params: { yearmonth: selectedYear } })  //세아
            await axios.get(`http://localhost:8081/special/statistics/count`, { params: { yearmonth: selectedYear } })
                .then(response => {
                    setSpcCount(response.data); // 백엔드에서 받아온 데이터를 상태에 설정
                    console.log(response.data);
                })

            //영역값
            // await axios.get(`http://172.20.20.252:8081/special/statistics/partandmonth`, { params: { yearmonth: selectedYear } })  //세아
            await axios.get(`http://localhost:8081/special/statistics/partandmonth`, { params: { yearmonth: selectedYear } })
                .then(response => {
                    setPartCount(response.data); // 백엔드에서 받아온 데이터를 상태에 설정
                    console.log(response.data);
                })

            //위험분류값
            //await axios.get(`http://172.20.20.252:8081/special/statistics/dangerandmonth`, { params: { yearmonth: selectedYear } })  //세아
            await axios.get(`http://localhost:8081/special/statistics/dangerandmonth`, { params: { yearmonth: selectedYear } })
                .then(response => {
                    setDangerCount(response.data); // 백엔드에서 받아온 데이터를 상태에 설정
                    console.log(response.data);
                })

            //위험원인값
                // await axios.get(`http://172.20.20.252:8081/special/statistics/causeandmonth`, { params: { yearmonth: selectedYear } })  //세아
            await axios.get(`http://localhost:8081/special/statistics/causeandmonth`, { params: { yearmonth: selectedYear } })
                .then(response => {
                    setCauseCount(response.data); // 백엔드에서 받아온 데이터를 상태에 설정
                    console.log(response.data);
                })


        }
        catch (error) {
                console.error("불러온 데이터에 에러가 발생했습니다:", error);
            }
        };



  return (
      <div>
          <Header />

      {/*네비게이션*/}
          <Disclosure as="nav" className="bg-gray-800">
              {({ open }) => (
                  <>
                      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                          <div className="relative flex h-16 items-center justify-between">
                              <div className="flex items-center px-2 lg:px-0">
                                  <div className="flex-shrink-0">
                                      <ChartPieIcon className="h-8 w-8 text-cyan-500" aria-hidden="true" />
                                  </div>
                                  <div className="hidden lg:ml-6 lg:block">
                                      <div className="flex space-x-4">
                                          <a href="http://172.20.20.252:3000/inspection/statistics/yearimg" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">
                                              연간 분석
                                          </a>
                                          <a
                                              href="http://172.20.20.252:3000/inspection/statistics/monthimg"

                                              className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                          >
                                              월간 분석
                                          </a>
                                      </div>
                                  </div>
                              </div>
                              <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                                  <div className="w-full max-w-lg lg:max-w-xs">
                                      <label htmlFor="search" className="sr-only">
                                          Search
                                      </label>
                                      <div className="relative">
                                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                          </div>
                                          <input
                                              id="yearInput"
                                              name="search"
                                              className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                                              placeholder="검색형태: 2023-08"
                                              type="text"
                                              onChange={handleYearChange}
                                          />
                                      </div>
                                  </div>
                              </div>
                              <div className="flex lg:hidden">
                                  {/* Mobile menu button */}
                                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                      <span className="absolute -inset-0.5" />
                                      <span className="sr-only">Open main menu</span>
                                      {open ? (
                                          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                      ) : (
                                          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                      )}
                                  </Disclosure.Button>
                              </div>
                              <div className="hidden lg:ml-4 lg:block">
                                  <div className="flex items-center">
                                      <button
                                          type="button"
                                          className="relative flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                      >
                                          <span className="absolute -inset-1.5" />
                                          <span className="sr-only">View notifications</span>
                                          <BellIcon className="h-6 w-6" aria-hidden="true" />
                                      </button>

                                  </div>
                              </div>
                          </div>
                      </div>

                  </>
              )}
          </Disclosure>



      {/*수시점검 통계*/}

          {/*점검 총계*/}
      <div className="mt-4 mx-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
              <div className="flex justify-between items-baseline">
                  <h5 className="text-xl font-semibold leading-2 text-gray-900">이번달 수시점검 건수</h5>
                  <button
                      className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
                      onClick={handleExport}
                  >
                      월간분석 엑셀 저장
                  </button>
              </div>
              <dl className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-1">
                  <div className="overflow-hidden rounded-lg bg-amber-100 px-3 py-5 shadow sm:p-40 max-w-screen-xl flex items-center justify-center">
                      <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{spcCount}건</dd>
                  </div>
              </dl>
          </div>

          {/*영역별(완료)*/}
          <div>
              <h3 className="text-xl font-semibold leading-2 text-gray-900">점검영역 분석</h3>
              <dl className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-4">
                  {partCount.map((item, index) => (
                      <div key={index} className="overflow-hidden rounded-lg bg-white px-4 py-10 shadow sm:max-w-screen-xl">
                          <dt className="truncate text-sm font-medium text-gray-900">{item[0]}파트</dt>
                          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item[1]}건</dd>
                      </div>
                  ))}
              </dl>
          </div>

          {/*위험분류별(완료)*/}
          <div>
              <h3 className="text-xl font-semibold leading-2 text-gray-900">위험분류 분석</h3>
              <dl className="mt-1 grid grid-cols-2 gap-5 sm:grid-cols-5">
                  {dangerCount.map((item, index) => (
                      <div key={index} className="overflow-hidden rounded-lg bg-indigo-100 px-4 py-5 shadow sm:p-6">
                          <dt className="truncate text-sm font-medium text-gray-900">분류: {item[0]}</dt>
                          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item[1]}건</dd>
                      </div>
                  ))}
              </dl>
          </div>

         {/*위험원인별(완료)*/}
          <div>
              <h3 className="text-xl font-semibold leading-2 text-gray-900">위험원인 분석</h3>
              <dl className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-4">
                  {causeCount.map((item, index) => (
                      <div key={index} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:max-w-screen-xl">
                          <dt className="truncate text-sm font-medium text-gray-900">원인: {item[0]}</dt>
                          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item[1]}건</dd>
                      </div>
                  ))}
              </dl>
          </div>
      </div>
{/*
          위험성 평가별
          <div>
              <h3 className="text-base font-semibold leading-2 text-gray-900">위험정도 분석</h3>
              <dl className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-10">
                  {count.map((item, index) => (
                      <div key={index} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                          <dt className="truncate text-sm font-medium text-gray-500">{item[0]}</dt>
                          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item[1]}</dd>
                      </div>
                  ))}
              </dl>
          </div>*/}
      </div>

  );
}

export default SafetyInspectionStatisticsMonthImg;
