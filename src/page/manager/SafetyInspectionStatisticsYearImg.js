import Header from "../../components/Header";
import {useEffect, useState} from "react";
import axios from 'axios';
//import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ResponsiveLine } from '@nivo/line'
import {ChartPieIcon} from "@heroicons/react/24/solid"; //아이콘

//네비게이션
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import * as XLSX from "xlsx";

//엑셀저장
import { saveAs } from "file-saver";

//검색창
import "../../style/YearPicker.css";

function SafetyInspectionStatisticsYearImg() {

    //공통: 년도입력, 기본값은 당해로 지정되어 있음
    const seoulTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
    const currentYear = new Date(seoulTime).getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const years = Array.from({ length: 20 }, (_, index) => currentYear +index);




    //이벤트1: 연도 검색이벤트
    const handleYearChange = (event) => {
        const inputValue = event.target.value;
        const collectFormat = /^\d{4}$/.test(inputValue);

        if (inputValue.length >= 4) {
            if (collectFormat) {
                setSelectedYear(parseInt(inputValue));
            } else {
                alert('올바른 검색 형식으로 입력해주세요. ex: 2023');
            }
        }
    };

    //(LineChart) 특정년도의 수시점검과 정기점검 건수(월별로 표현된거 1월: 2건, 2월: 3건..)
    const [lineChartData, setLineChartData] = useState([]);

    //(LineChart) 특정년도의 수시점검과 정기점검 건수(월
    const [inspectionCountData, setInspectionCount] = useState([]);


    //(BarChart) 특정년도의 월별 수시점검한 위험분류 건수
    const [barChartData, setBarChartData] = useState([]);
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    // 모든 dangerKind를 추출하여 하나의 배열로 모으기
    const [uniqueDangerKinds, setUniqueDangerKinds] = useState([]); //중복값 제거



        useEffect(() => {

            if (selectedYear) {
                fetchData();
            }
        }, [selectedYear]);



            const fetchData = async () => {
                try {

                    //(LineChart) 특정년도의 수시점검과 정기점검 건수
                    const lineChartResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/statistics/inspectioncount`, { params: { year: selectedYear } });   // 세아
                    // const lineChartResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}25n/statistics/inspectioncount`, { params: { year: selectedYear } });

                    const specialCountData = lineChartResponse.data;
                    console.log("첫번째"+ JSON.stringify(lineChartResponse.data, null, 2));

                    // x가 1부터 12까지 있는 배열 생성하고, 해당하는 y 값이 있으면 사용하고 없으면 0을 사용
                    const resultData = Array.from({ length: 12 }, (_, i) => {
                        const foundData = specialCountData.find(data => data.data.some(item => item.x === i + 1));
                        return { x: i + 1, y: foundData ? foundData.data.find(item => item.x === i + 1).y : 0 };
                    });

                    setLineChartData([{ data: resultData, id: "수시점검" }]);
                    console.log("세번째"+ JSON.stringify(resultData));


                    //(lineChart) 연간 수시점검 건수 표시
                    const speCountByYearResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/special/statistics/yearcount`, { params: { year: selectedYear } });   // 세아
                    // const speCountByYearResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/special/statistics/yearcount`, { params: { year: selectedYear } });
                    const speCountByYear = speCountByYearResponse.data;
                    setInspectionCount(speCountByYear);





                    //(BarChart) 특정년도의 월별 수시점검한 위험분류 건수
                    const barChartResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/special/statistics/detaildanger`, { params: {year: selectedYear} });   // 세아
                    // const barChartResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/special/statistics/detaildanger`, { params: {year: selectedYear} });

                    const specialDangerData = barChartResponse.data; //백엔드에서 받아온 데이터
                    const dataByMonth = {};
                    const allDangerKinds = specialDangerData.reduce((acc, data) => {
                        return [...acc, ...Object.keys(data).filter((key) => key !== 'month')];
                    }, []);
                    setUniqueDangerKinds([...new Set(allDangerKinds)]);


                    specialDangerData.forEach((data) => {
                        const month = data.month;
                        delete data.month;

                        Object.entries(data).forEach(([dangerKind, count]) => {
                            if (!dataByMonth.hasOwnProperty(month)) {
                                dataByMonth[month] = { month: `${month}월` };
                            }
                            dataByMonth[month][dangerKind] = count;
                        });
                    });

                    const barChartDataWithAllMonths = generateDataForAllMonths(dataByMonth, allDangerKinds);

                    setBarChartData(barChartDataWithAllMonths);
                    console.log("==================체크중" + JSON.stringify(barChartDataWithAllMonths));
                } catch (error) {
                    console.error("불러온 데이터에 에러가 발생했습니다:", error);
                }
            };


    const generateDataForAllMonths = (dataByMonth, uniqueDangerKinds) => {
        const dataForAllMonths = [];
        for (let i = 1; i <= 12; i++) {
            const month2 = i;
            if (!dataByMonth[month2]) {
                // 해당 월에 데이터가 없으면 0으로 초기화하여 추가
                dataForAllMonths.push({ month: `${month2}월`, ...Object.fromEntries(uniqueDangerKinds.map((kind) => [kind, 0])) });
            } else {
                dataForAllMonths.push(dataByMonth[month2]);
            }
        }
        return dataForAllMonths;
        
    };




    //이벤트2: 수시/정기점검 건수 엑셀저장폼
    const createInspectionCountExcelData = (lineChartData) => {

        // 차트 정보를 바탕으로 엑셀 데이터를 생성하는 로직 작성
        const data = lineChartData[0].data.map(item => ({
            구분: lineChartData[0].id, // 수시점검 or 정기점검
            연도: selectedYear,
            월: item.x,
            점검건수: item.y
        }));

        // 점검건수 총 합계 계산
        const totalInspectionCount = data.reduce((sum, item) => sum + item.점검건수, 0);

        // 점검건수 총 합계를 데이터에 추가
        data.push({
            구분: '수시점검',
            연도: selectedYear,
            월: '전체합계',
            점검건수: totalInspectionCount
        });

        return data;
    };


    //이벤트2: 수시/정기점검 건수 엑셀저장로직
    const handleExport = () => {

        // 엑셀 데이터 생성
        const data = createInspectionCountExcelData(lineChartData);

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
        saveAs(excelFile, `안전점검통계.xlsx`);
    };


    //이벤트3: 수시점검 위험분류 엑셀저장폼
      //수시점검 위험분류 분석 엑셀시트만들 때 월별 데이터 생성 메소드
        const generateDataForAllMonthsForExcel = (dataByMonth, uniqueDangerKinds) => {
            const dataForAllMonths = [];
            for (let i = 0; i <= 11; i++) {
                const month2 = i;
                if (!dataByMonth[month2]) {
                    // 해당 월에 데이터가 없으면 0으로 초기화하여 추가
                    dataForAllMonths.push({ month: `${month2}월`, ...Object.fromEntries(uniqueDangerKinds.map((kind) => [kind, 0])) });
                } else {
                    dataForAllMonths.push(dataByMonth[month2]);
                }
            }
            return dataForAllMonths;

        };
        const createDangerExcelData = (dataByMonth, uniqueDangerKinds) => {

            // 차트 정보를 바탕으로 엑셀 데이터를 생성하는 로직 작성
            const data = [];
            const generatedData = generateDataForAllMonthsForExcel(dataByMonth, uniqueDangerKinds); // 월별 데이터 생성
            console.log("지금"+generatedData);

            for(const monthData of generatedData) {
                const rowData = {
                    월: parseInt(monthData.month),
                };

                let monthlyTotal = 0; // 각 월별 합계를 저장할 변수

                for(const dangerValue of uniqueDangerKinds) {
                    rowData[dangerValue] = monthData[dangerValue] || 0; // 해당 위험분류 값이 없으면 0으로 설정
                    monthlyTotal += rowData[dangerValue]; // 해당 월의 위험분류 값 누적
                }

                rowData['월별 합계'] = monthlyTotal; // 합계 추가
                data.push(rowData);
            }
            return data;
        };


    //이벤트4: 수시점검 위험분류 엑셀저장로직
    const handleExport2 = () => {

        // 엑셀 데이터 생성
        const data = createDangerExcelData(barChartData, uniqueDangerKinds);

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
        saveAs(excelFile, `연간 수시점검 위험분류 분석.xlsx`);
    };

    const maxCount = Math.max(barChartData.map((data) => Math.max(Object.values(data).filter((val) => typeof val === 'number'))));
    const colors = ['rgba(130,205,255,0.8)', 'rgba(230,12,239,0.85)', 'rgba(130,202,157,0.89)', 'rgba(156,132,216,0.9)',
                            'rgba(255,159,180,0.94)', 'rgba(50,44,140,0.88)', '#84bbd8', 'rgba(237,138,76,0.87)',
                            '#f55e5e', 'rgba(150,77,238,0.91)', '#d7549d', 'rgba(121,183,101,0.95)',
                            'rgba(88,192,182,0.82)', 'rgba(150,52,52,0.76)', '#07796c', 'rgba(239,204,110,0.83)',
                            'rgba(7,7,4,0.83)'];





    return (

        <div>
            <Header />
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
                                            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                                            <a href="http://172.20.20.252:3000/inspection/statistics/yearimg" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">
                                                연간 분석
                                            </a>
                                            <a
                                                href="http://172.20.20.252:3000/inspection/statistics/monthimg" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
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
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 " style={{ backgroundColor: 'rgba(57, 65, 80, 1)' }}>
                                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <div className="year-picker ml-8">
                                                <select id="yearSelect" value={selectedYear} onChange={handleYearChange} className="year-picker-select">
                                                    {years.map((year) => (
                                                        <option key={year} value={year}>
                                                            {year}년
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
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
                            </div>
                        </div>

                    </>
                )}
            </Disclosure>


    <div className="flex">
        <div className="w-1/2 p-4">
            <div className="flex justify-between items-center">
                <h5 className="text-xl font-semibold leading-2 text-gray-900">연간 수시ㆍ정기점검 건수 분석</h5>
                    <button
                        type="button"
                        className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
                        onClick={handleExport}
                    >
                        엑셀 저장
                    </button>
            </div>
            <div style={{ width: 'auto', height: '950px', margin: '0 auto' }}>
                {lineChartData.length > 0 ? (
                    <ResponsiveLine
                        data={lineChartData}
                        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                        xScale={{ type: 'point' }}
                        yScale={{
                            type: 'linear',
                            min: 0,
                            max: "auto",
                            stacked: false,
                            reverse: false
                        }}
                        yFormat="-.2f"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 10,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: '월',
                            legendOffset: 36,
                            legendPosition: 'middle'
                        }}
                        axisLeft={{
                            tickSize: 10,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: '점검 건수',
                            legendOffset: -40,
                            legendPosition: 'middle',

                        }}

                        colors={{ scheme: 'category10' }}
                        pointSize={8}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        pointLabelYOffset={-12}
                        areaOpacity={0.03}
                        enableArea={true}
                        useMesh={true}

                        legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 121,
                                translateY: -13,
                                itemWidth: 100,
                                itemHeight: 25,
                                itemsSpacing: 6,
                                symbolSize: 19,
                                symbolShape: 'circle',
                                itemDirection: 'left-to-right',
                                itemTextColor: '#777',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemBackground: 'rgba(0, 0, 0, .03)',
                                            itemOpacity: 1
                                        }
                                    }
                                ]
                            }
                        ]}
                    />
                ) : null}
            </div>
            <div>
                <dl className="mt-1 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="overflow-hidden rounded-lg bg-light px-3 py-5 shadow sm:p-2 max-w-screen-sm flex items-center justify-center">
                        <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">수시점검: {inspectionCountData}건</dd>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-light px-3 py-5 shadow sm:p-2 max-w-screen-sm flex items-center justify-center">
                        <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">정기점검: y건</dd>
                    </div>
                </dl>
            </div>
        </div>

            <div className="w-1/2">
                <div className="h-1/2 p-4">
                    <div className="flex justify-between items-center">
                        <h5 className="text-xl font-semibold leading-2 text-gray-900">연간 정기점검 종류 분석</h5>
                        <button
                            type="button"
                            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
                            onClick={handleExport2}
                        >
                            엑셀 저장
                        </button>
                    </div>

                    <div style={{ height: '500px' }}>
                            {barChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    //width={500}
                                    height={300}
                                    data={barChartData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                    barSize={20}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month"
                                           tickFormatter={(value) => {
                                               const monthIndex = parseInt(value, 10) - 1;
                                               if (months[monthIndex]) {
                                                   return months[monthIndex];
                                               }
                                               return '';
                                           }} />
                                    <YAxis domain={[0, maxCount]}/>
                                    <Tooltip />
                                    <Legend />

                                    {uniqueDangerKinds.map((dangerKind, index) => (
                                        <Bar
                                            key={index}
                                            dataKey={dangerKind}
                                            stackId="a"
                                            fill={colors[index % colors.length]}
                                        />
                                    ))}
                                </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p>데이터를 불러오는 중에 오류가 생겼습니다</p>
                                )}
                    </div>
                </div>

                <div className="h-1/2 p-4">
                    <div className="flex justify-between items-center">
                        <h5 className="text-xl font-semibold leading-2 text-gray-900">연간 수시점검 위험분류 분석</h5>
                        <button
                            type="button"
                            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
                            onClick={handleExport2}
                        >
                            엑셀 저장
                        </button>
                    </div>

                    <div style={{ height: '500px' }}>
                        {barChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    //width={500}
                                    height={300}
                                    data={barChartData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                    barSize={20}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month"
                                           tickFormatter={(value) => {
                                               const monthIndex = parseInt(value, 10) - 1;
                                               if (months[monthIndex]) {
                                                   return months[monthIndex];
                                               }
                                               return '';
                                           }} />
                                    <YAxis domain={[0, maxCount]}/>
                                    <Tooltip />
                                    <Legend />

                                    {uniqueDangerKinds.map((dangerKind, index) => (
                                        <Bar
                                            key={index}
                                            dataKey={dangerKind}
                                            stackId="a"
                                            fill={colors[index % colors.length]}
                                        />
                                    ))}
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p>데이터를 불러오는 중에 오류가 생겼습니다</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default SafetyInspectionStatisticsYearImg;