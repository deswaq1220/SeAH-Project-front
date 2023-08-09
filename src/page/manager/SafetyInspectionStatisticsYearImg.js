import Header from "../../components/Header";
import {useEffect, useState} from "react";
import axios from 'axios';
//import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ResponsiveLine } from '@nivo/line'

//네비게이션
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

function SafetyInspectionStatisticsYearImg() {

    //공통: 년도입력, 기본값은 당해로 지정되어 있음
    const seoulTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
    const currentYear = new Date(seoulTime).getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    //이벤트1: 연도 검색이벤트
    const handleYearChange = (event) => {
        setSelectedYear(parseInt(event.target.value));
    };

    //이벤트2
    const handleSave = async () => {
        try {
            // const barChartResponse = await axios.get("http://http://172.20.20.252/:8081/special/statistics/detaildanger", {  // 세아
            const barChartResponse = await axios.get("http://localhost:8081/special/statistics/detaildanger", {
                params: {
                    year: selectedYear,
                },
            });

            // const lineChartResponse = await axios.get("http://http://172.20.20.252/:8081/statistics/inspectioncount", {  // 세아
            const lineChartResponse = await axios.get("http://localhost:8081/statistics/inspectioncount", {
                params: {
                    year: selectedYear,
                },
            });

            // 백엔드로부터 받은 데이터 처리
            console.log("백엔드 응답 데이터(lineChart)):", lineChartResponse.data);
            console.log("백엔드 응답 데이터2(barChart):", barChartResponse.data);
        } catch (error) {
            console.error("백엔드 요청 에러:", error);
        }
    };


    //(LineChart) 특정년도의 수시점검과 정기점검 건수
    const [lineChartData, setLineChartData] = useState([]);

    //(BarChart) 특정년도의 월별 수시점검한 위험분류 건수
    const [barChartData, setBarChartData] = useState([]);
    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    // 모든 dangerKind를 추출하여 하나의 배열로 모으기
    const [uniqueDangerKinds, setUniqueDangerKinds] = useState([]); //중복값 제거
    const generateDataForAllMonths = (dataByMonth, uniqueDangerKinds) => {
        const dataForAllMonths = [];
        for (let i = 1; i <= 12; i++) {
            const month = i;
            if (!dataByMonth[month]) {
                // 해당 월에 데이터가 없으면 0으로 초기화하여 추가
                dataForAllMonths.push({ month, ...Object.fromEntries(uniqueDangerKinds.map((kind) => [kind, 0])) });
            } else {
                dataForAllMonths.push(dataByMonth[month]);
            }
        }
        return dataForAllMonths;
    };



        useEffect(() => {

            if (selectedYear) {
                fetchData();
            }
        }, [selectedYear]);


            const fetchData = async () => {
                try {

                    //(LineChart) 특정년도의 수시점검과 정기점검 건수
                    // const lineChartResponse = await axios.get('http://172.20.20.252:8081/statistics/inspectioncount', { params: { year: selectedYear } });   // 세아
                    const lineChartResponse = await axios.get('http://localhost:8081/statistics/inspectioncount', { params: { year: selectedYear } });

                    const specialCountData = lineChartResponse.data;
                    console.log("첫번째"+ JSON.stringify(lineChartResponse.data, null, 2));

                    // x가 1부터 12까지 있는 배열 생성하고, 해당하는 y 값이 있으면 사용하고 없으면 0을 사용
                    const resultData = Array.from({ length: 12 }, (_, i) => {
                        const foundData = specialCountData.find(data => data.data.some(item => item.x === i + 1));
                        return { x: i + 1, y: foundData ? foundData.data.find(item => item.x === i + 1).y : 0 };
                    });

                    setLineChartData([{ data: resultData, id: "수시점검" }]);
                    console.log("세번째"+ JSON.stringify(resultData));


                    //(BarChart) 특정년도의 월별 수시점검한 위험분류 건수
                    // const barChartResponse = await axios.get('http://172.20.20.252:8081/special/statistics/detaildanger', { params: {year: selectedYear} });   // 세아
                    const barChartResponse = await axios.get('http://localhost:8081/special/statistics/detaildanger', { params: {year: selectedYear} });
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

                } catch (error) {
                    console.error("불러온 데이터에 에러가 발생했습니다:", error);
                }
            };



/*    const formatCount = (value) => {
        return Math.round(value);
    };*/

    const maxCount = Math.max(barChartData.map((data) => Math.max(Object.values(data).filter((val) => typeof val === 'number'))));
    const colors = ['rgba(130,205,255,0.8)', 'rgba(158,132,216,0.75)', 'rgba(130,202,157,0.89)', 'rgba(156,132,216,0.9)',
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
                                        <img
                                            className="h-8 w-auto"
                                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                            alt="Your Company"
                                        />
                                    </div>
                                    <div className="hidden lg:ml-6 lg:block">
                                        <div className="flex space-x-4">
                                            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                                            <a href="http://172.20.20.252:3000/inspection/statistics/yearimg" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">
                                                연도 상세 분석
                                            </a>
                                            <a
                                                href="http://172.20.20.252:3000/inspection/statistics/monthimg"
                                                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                            >
                                                월별 분석
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
                                                id="search"
                                                name="search"
                                                className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                                                placeholder="Search"
                                                type="search"
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

            <div>      안전점검 당해년도 대시보드 페이지입니다</div>




            <div
                id="Training_time"
                className="flex items-baseline justify-start"
            >
              <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
                검색년도
              </span>
                <div className="mt-2">
                    <input
                        type="number"
                        id="yearInput"
                        className="block w-56 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
                        value={selectedYear}
                        onChange={handleYearChange}
                    />

                </div>
            </div>



            <div> (수시점검/정기점검) 점검 수 통계</div>
            <div style={{ width: '800px', height: '500px', margin: '0 auto' }}>
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
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: '월',
                            legendOffset: 36,
                            legendPosition: 'middle'
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: '점검 건수',
                            legendOffset: -40,
                            legendPosition: 'middle'
                        }}
                        //enableGridX={false}
                        //enableGridY={false}
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


            <div>  (수시점검) 당해 점검발생 건 - 위험분류 통계</div>
            <div style={{ height: '350px' }}>
                {barChartData.length > 0 ? (
                    <ResponsiveContainer width={1200} height="100%">
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
    );
}

export default SafetyInspectionStatisticsYearImg;