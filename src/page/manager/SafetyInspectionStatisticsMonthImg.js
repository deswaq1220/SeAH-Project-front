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
function SafetyInspectionStatisticsMonthImg() {

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

  const [selected, setSelected] = useState([]);

  // 이벤트4: 드롭다운 선택에 따른 piechart 전체데이터/sort된 데이터 불러오는 기능
  const handleSelectedChange = (selected) => {
    setSelected(selected);
    if(selected !== "전체"){
      // axios 요청
      axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/regular/statistics/checkvaluecountsort`, {
            params: {
              yearmonth: selectedYear,
              regularinsname: selected,
            },
          })
          .then((response) => {
            setCheckCount(response.data);
          })
          .catch((error) => {
            console.log("드롭박스메소드에서 선택 값을 보내지 못합니다")
          });
    }else{
      axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/regular/statistics/checkvaluecount`, {
            params: {yearmonth: selectedYear},
          })
          .then((response) => {
            setCheckCount(response.data);
          });
    }
  };




  // 이벤트: 정기점검 분석 결과 엑셀로 내보내기
  const regularHandleExport = () => {
    const data = [
      {
        sheetName: "정기점검 총 건수",
        data: [{ "이번달 정기점검 총 건수": regularCount }],
      },
      {
        sheetName: "점검영역 분석",
        data: regularCntByPartForExcel.map((item) => ({
          점검영역: item[0],
          건수: item[1],
        })),
      },
      {
        sheetName: "위험성평가 분석",
        data: regularCntByNameForExcel.map((item) => ({
          구분: item.key,
          위험성평가: item.evaluationValue,
          건수: item.count,
        })),
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

    saveAs(excelFile, "정기점검_월간분석.xlsx");
  };


  // 이벤트2: 수시점검 분석 결과 엑셀로 내보내기
  const handleExport = () => {
    const data = [
      {
        sheetName: "수시점검 총 건수",
        data: [{ "이번달 정기점검 총 건수": spcCount }],
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
        data: causeCount.map((item) => ({ 위험원인: item[0], 건수: item[1] })),
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
    //수시점검
    const [spcCount, setSpcCount] = useState([]); //수시점검횟수
    const [partCount, setPartCount] = useState([]);
    const [partCountForExcel, setPartCountForExcel] = useState([]);
    const [dangerCount, setDangerCount] = useState([]);
    const [causeCount, setCauseCount] = useState([]);

    //정기점검
    const [regularCount, setRegularCount] = useState([]); //월간 총 정기점검횟수
    const [regularNameList, setRegularNameList] = useState([]);
    const [regularCountByPart, setRegularCountByPart] = useState([]); //월간 영역별 정기점검횟수
    const [regularCntByPartForExcel, setRegularCntByPartForExcel] = useState([]); //월간 영역별 정기점검횟수 엑셀용
    const [checkCount, setCheckCount] = useState([]); //백엔드 값
    const [regularCntByNameForExcel, setRegularCntByNameForExcel] = useState([]); //월간 영역별 정기점검횟수 엑셀용


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

      //정기점검
      //점검건수 값
      await axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/regular/statistics/monthcount`, {
            params: {yearmonth: selectedYear},
          }) //세아
          .then((response) => {
            setRegularCount(response.data); // 백엔드에서 받아온 데이터를 상태에 설정
          });

      //(엑셀) 영역별 점검건수
      await axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/regular/statistics/partandmonthforexcel`, {
            params: {yearmonth: selectedYear},
          }) //세아
          .then((response) => {
            setRegularCntByPartForExcel(response.data);
          });

      //(radarChart) 영역별 점검건수
      await axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/regular/statistics/partandmonth`, {
            params: {yearmonth: selectedYear},
          })
          .then((response) => {
            setRegularCountByPart(response.data);
          });

      //(pieChart) 위험성결과 분석
      //드롭다운 미선택 시,  전체 위험성 결과 출력
      await axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/regular/statistics/checkvaluecount`, {
            params: {yearmonth: selectedYear},
          })
          .then((response) => {
            setCheckCount(response.data);
          });


      //(pieChart) 위험성결과 드롭다운 기능
        //백데이터 들고오기
        const response = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/regular/statistics/namedropdown`);

        // 문자열 배열을 객체로 변환하여 새로운 배열 생성
        const optionsArray = response.data.regularNameList.map((name, index) => ({
          id: index + 1,
          name: name,
        }));

        setRegularNameList(optionsArray);
        setSelected(optionsArray[0])
      console.log("위험성결과드롭다운 값", optionsArray);

      //(pieChart, 엑셀) 위험성결과 데이터 출력
      await axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/admin/regular/statistics/nameandmonthforexcel`, {
            params: {yearmonth: selectedYear}
          })
          .then((response) => {
            let transformedData = response.data.map((item) => {
              let key = Object.keys(item)[0];
              let innerData = item[key];

              let evaluationValue = Object.keys(innerData)[0]; //평가값
              let count = innerData[evaluationValue]; //숫자

              if (evaluationValue.includes("BAD")) {
                evaluationValue = "불량";
              } else if (evaluationValue.includes("GOOD")) {
                evaluationValue = "양호";
              }

              return {
                key,
                evaluationValue,
                count,
              };
            });

            // 데이터 변환 const로 업데이트
            setRegularCntByNameForExcel(transformedData);
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
                              href={`${process.env.REACT_APP_API_CERENT_URL}/inspection/statistics/yearimg`}
                              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                          >
                            연간분석
                          </a>
                          <div className="absolute left-3 hidden group-hover:block mt-2 bg-white border border-gray-300 rounded-lg shadow-lg top-4">
                            <a
                                href="URL_TO_SUSICHECK1"
                                className="block px-0 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                              수시/정기점검
                            </a>
                            <a
                                href="URL_TO_SUSICHECK1"
                                className="block px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                              수시점검
                            </a>
                            <a
                                href="URL_TO_REGULARCHECK1"
                                className="block px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                              정기점검
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="hidden lg:ml-6 lg:flex lg:space-x-8 relative group">
                        <div className="relative">
                          <a
                              href={`${process.env.REACT_APP_API_CERENT_URL}/inspection/statistics/monthimg`}
                              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                          >
                            월간분석
                          </a>
                          <div className="absolute left-3 hidden group-hover:block mt-2 bg-white border border-gray-300 rounded-lg shadow-lg top-4">
                            <a
                                href="URL_TO_SUSICHECK1"
                                className="block px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                              수시점검
                            </a>
                            <a
                                href="URL_TO_REGULARCHECK1"
                                className="block px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
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


                {/* 위쪽 영역 */}
                <h1 className="text-3xl font-semibold leading-2 text-gray-900 flex items-center justify-between">
                  <span>정기점검</span>
                  <button
                      className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
                      onClick={regularHandleExport}
                  >
                    정기점검 엑셀 저장
                  </button>
                </h1>
                <div className="grid grid-cols-1 gap-6 bg-gray-100 bg-opacity-50">
                  {/*위쪽 영역 1번 - 점검 건수*/}
                  <div>
                    <div className="flex justify-between items-baseline">
                      <h5 className="text-xl font-semibold leading-2 text-gray-900">1. 정기점검 건수</h5>
                    </div>
                    <dl className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-1">
                      <div className="overflow-hidden rounded-lg bg-amber-100 bg-opacity-50 px-3 py-1 shadow sm:p-3 max-w-screen-xl flex items-center justify-center">
                        <dd className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">{regularCount}건</dd>
                      </div>
                    </dl>
                  </div>
                  {/*위쪽 영역 2번 - 영역별*/}
                  <div>
                    <h3 className="text-xl font-semibold leading-2 text-gray-900">2. 점검영역 분석(건)</h3>
                    {/*<dl className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-3">
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
                          data={regularCountByPart}
                          keys={['정기점검']}
                          indexBy="sort"
                          margin={{ top: 43, right: 60, bottom: 40, left: 60 }}
                          borderWidth={0.5}
                          borderColor={{ from: 'color' }}
                          gridLabelOffset={36}
                          dotSize={10}
                          dotColor={'#f4f4f6'}
                          dotBorderWidth={2}
                          enableDotLabel={true}
                          dotLabelYOffset={-8}
                          colors={'rgba(11,107,8,0.54)'}
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
                  {/*위쪽 영역 3번 - 위험성평가분석*/}
                  <div>
                    <h3 className="text-xl font-semibold leading-2 text-gray-900">3. 위험성평가 분석(건)</h3>
                    <div className="flex flex-col ml-2 z-10">
                     <Listbox value={selected} onChange={(newValue) => handleSelectedChange(newValue)}>
                        {({ open }) => (
                            <>
                              <div className="relative mt-2">
                                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-28 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6" style={{ minHeight: '2.5rem' }}>
                                  <span className="block truncate">
                                    {selected ? `[${typeof selected === 'object' ? selected.name : selected}]` : "전체"}
                                  </span>
                                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                  </span>
                                </Listbox.Button>

                                {/*드롭다운 목록이 나타날 때와 사라질 때의 애니메이션 효과*/}
                                <Transition
                                    show={open}
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                  {/*실제 선택지 목록을 포함하는 컨테이너*/}
                                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {regularNameList.map((option) => (
                                        <Listbox.Option
                                            key={option.name}
                                            className={({ active }) =>
                                                classNames(
                                                    active
                                                        ? "bg-seahColor text-white"
                                                        : "text-gray-900",
                                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                                )
                                            }
                                            value={option.name}
                                        >
                                          {({ selected, active }) => (
                                              <>
                                  <span
                                      className={classNames(
                                          selected ? "font-semibold" : "font-normal",
                                          "block truncate"
                                      )}
                                  >
                                    [{option.name}]
                                  </span>
                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active ? "text-white" : "text-seahColor",
                                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                                        )}
                                                    >
                                                      <CheckIcon
                                                          className="h-5 w-5"
                                                          aria-hidden="true"
                                                      />
                                                    </span>
                                                ) : null}
                                              </>
                                          )}
                                        </Listbox.Option>
                                        ))}
                                  </Listbox.Options>
                                </Transition>
                              </div>
                            </>
                        )}
                      </Listbox>
                    </div>

                      {checkCount.length === 0 ? (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <p>점검 내용이 없습니다.</p>
                          </div>
                      ) : (
                      <ResponsivePie
                          data={checkCount}
                          height={310}
                          margin={{ top: 20, right: 0, bottom: 54, left: 0 }}
                          innerRadius={0.5}
                          padAngle={1}
                          activeOuterRadiusOffset={8}
                          colors={({ id }) => {
                            if (id === '양호') return 'hsl(207, 46%, 80%)';
                            if (id === '불량') return 'hsl(5, 92%, 85%)';
                            if (id === 'NA') return '#e7e7e7';
                            return '#ccc'; // 기본 값
                          }}
                          borderWidth={1}
                          borderColor={{
                            from: 'color',
                            modifiers: [
                              [
                                'darker',
                                0.2
                              ]
                            ]
                          }}
                          arcLinkLabelsTextOffset={5}
                          arcLinkLabelsTextColor="#333333"
                          arcLinkLabelsOffset={1}
                          arcLinkLabelsDiagonalLength={7}
                          arcLinkLabelsStraightLength={12}
                          arcLinkLabelsThickness={2}
                          arcLinkLabelsColor={{ from: 'color' }}
                          arcLabelsSkipAngle={10}
                          arcLabelsTextColor={{
                            from: 'color',
                            modifiers: [
                              [
                                'darker',
                                2
                              ]
                            ]
                          }}
/*                          fill={coloredData.map(item => item.color)}*/
                          legends={[
                            {
                              anchor: 'bottom',
                              direction: 'row',
                              justify: false,
                              translateX: 0,
                              translateY: 50,
                              itemsSpacing: 0,
                              itemWidth: 65,
                              itemHeight: 19,
                              itemTextColor: '#131313',
                              itemDirection: 'left-to-right',
                              itemOpacity: 1,
                              symbolSize: 17,
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
                      )}

                  </div>
                </div>


                {/*중간선*/}
                <hr className="border-t  my-6" style={{ borderColor: 'InactiveBorder' }}/>


                {/* 아래쪽 영역 */}
                {/* 제목 */}
                <h1 className="text-3xl font-semibold leading-2 text-gray-900 flex items-center justify-between">
                  <span>수시점검</span>
                  <button
                      className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
                      onClick={handleExport}
                  >
                    수시점검 엑셀 저장
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
                          margin={{ top: 43, right: 60, bottom: 40, left: 60 }}
                          borderWidth={0.5}
                          borderColor={{ from: 'color' }}
                          gridLabelOffset={36}
                          dotSize={10}
                          dotColor={'#f4f4f6'}
                          dotBorderWidth={2}
                          enableDotLabel={true}
                          dotLabelYOffset={-8}
                          colors={'rgba(11,107,8,0.54)'}
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

export default SafetyInspectionStatisticsMonthImg;
