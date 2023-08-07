import Header from "../../components/Header";
import {useEffect, useState} from "react";
import axios from 'axios';
//import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ResponsiveLine } from '@nivo/line'
import useSafetyEduForm from "../../useHook/useSafetyEduForm";
function SafetyInspectionStatisticsImg() {

    //공통: 년도입력, 기본값은 당해로 지정되어 있음
    const seoulTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
    const currentYear = new Date(seoulTime).getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const handleYearChange = (event) => {
        setSelectedYear(parseInt(event.target.value));
    };

    const handleSave = async () => {
        try {
            const barChartResponse = await axios.get("http://localhost:8081/special/statistics/detaildanger", {
                params: {
                    year: selectedYear,
                },
            });
            // 백엔드로부터 받은 데이터 처리
            console.log("백엔드 응답 데이터:", barChartResponse.data);
        } catch (error) {
            console.error("백엔드 요청 에러:", error);
        }
    };



    //(LineChart) 특정년도의 수시점검과 정기점검 건수
    const [lineChartData, setLineChartData] = useState([]);
    const {
        selected,
        selectedDuty,
        isCompleted,
        uploadedFiles,
        error,
        formData,
        handleChange,
        handleStartTimeChange,
        // handleEndTimeChange,
        handleCreate,
        onDrop,
        deleteFile,
        handleFileChange,
        getRootProps,
        getInputProps,
        isDragActive,
        formatTimeRange,
        handleListboxChange,
        handleDutyChange,
        navigate,
        handleSubmit,
        selectedEtcTime,
        calculateTotalTime,
        handleEtcTimeChange,
        selectedStartTime,
        qrValue,
        setQrValue,
        resetForm,
        showNotification,
    } = useSafetyEduForm();






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
                    const lineChartResponse = await axios.get('http://localhost:8081/special/statistics/dangerandmonth', { params: { year: 2023, month:7} });
                    specialCountData(lineChartResponse.data);


                    //(BarChart) 특정년도의 월별 수시점검한 위험분류 건수
                    const barChartResponse = await axios.get('http://localhost:8081/special/statistics/detaildanger', { params: {
                            year: selectedYear
                        }, });
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



    const formatCount = (value) => {
        return Math.round(value);
    };

    const maxCount = Math.max(barChartData.map((data) => Math.max(Object.values(data).filter((val) => typeof val === 'number'))));
    const colors = ['rgba(130,205,255,0.8)', 'rgba(158,132,216,0.75)', 'rgba(130,202,157,0.89)', 'rgba(156,132,216,0.9)',
                            'rgba(255,159,180,0.94)', 'rgba(50,44,140,0.88)', '#84bbd8', 'rgba(237,138,76,0.87)',
                            '#f55e5e', 'rgba(150,77,238,0.91)', '#d7549d', 'rgba(121,183,101,0.95)',
                            'rgba(88,192,182,0.82)', 'rgba(150,52,52,0.76)', '#07796c', 'rgba(239,204,110,0.83)'];





    return (
        <div>
            <Header />

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

                    <button
                        type="submit"
                        className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
                        onClick={handleSave}
                    >
                        검색
                    </button>

                </div>
            </div>




            <div style={{ width: '800px', height: '500px', margin: '0 auto' }}>
                {lineChartData.length > 0 ? (
                    <ResponsiveLine
                        data={lineChartData}
                        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                        xScale={{ type: 'point' }}
                        yScale={{
                            type: 'linear',
                            min: 'auto',
                            max: 'auto',
                            stacked: true,
                            reverse: false
                        }}
                        yFormat=" >-.2f"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 1,
                            tickRotation: 0,
                            legend: '위험분류',
                            legendOffset: 32,
                            legendPosition: 'middle'
                        }}
                        axisLeft={{
                            tickSize: 7,
                            tickPadding: 3,
                            tickRotation: 0,
                            legend: '발생 건수',
                            legendOffset: -40,
                            legendPosition: 'middle'
                        }}
                        enableGridX={false}
                        enableGridY={false}
                        colors={{ scheme: 'accent' }}
                        pointSize={7}
                        pointColor={{ from: 'color', modifiers: [] }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        pointLabelYOffset={-12}
                        useMesh={true}
                        legends={[
                            {
                                anchor: 'top-left',
                                direction: 'column',
                                justify: false,
                                translateX: 21,
                                translateY: 0,
                                itemsSpacing: 6,
                                itemDirection: 'left-to-right',
                                itemWidth: 80,
                                itemHeight: 20,
                                itemOpacity: 0.75,
                                symbolSize: 20,
                                symbolShape: 'circle',
                                symbolBorderColor: 'rgba(0, 0, 0, .5)',
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
            안전점검 대시보드 페이지입니다

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
                    <p>데이터를 불러오는 중입니다</p>
                    )}
            </div>
        </div>
    );
}

export default SafetyInspectionStatisticsImg;