import Header from "../../components/Header";
import {useEffect, useState} from "react";
import axios from 'axios';
import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ResponsiveLine } from '@nivo/line'

function SafetyInspectionStatisticsImg() {
    //const [lineChartData, setLineChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    //const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

        useEffect(() => {
            const fetchData = async () => {
                try {
                    //const lineChartResponse = await axios.get('http://localhost:8081/special/statistics/dangerandmonth', { params: { year: 2023, month: 7 } });
                    //setLineChartData(lineChartResponse.data);

                    const barChartResponse = await axios.get('http://localhost:8081/special/statistics/detaildanger', { params: { year: 2023} });
                    const specialDangerData = barChartResponse.data; //백엔드에서 받아온 데이터
                    const dataByMonth = {};

                    specialDangerData.forEach((data) => {
                        const month = data.month;
                        const dangerKind = data.dangerKind;
                        const count = data.count;

                        if(!dataByMonth.hasOwnProperty(month)){
                            dataByMonth[month] = {name: '${month}월'};
                        }
                        dataByMonth[month][dangerKind] = count;
                    });
                    const finalData = Object.values(dataByMonth);
                    setBarChartData(finalData);
                    console.log("가져온 데이터 출력값:    ", finalData);
                } catch (error) {
                    console.error("불러온 데이터에 에러가 발생했습니다:", error);
                }
            };

            fetchData();
        }, []);

    return (
        <div>
            <Header />
{/*            <div style={{ width: '800px', height: '500px', margin: '0 auto' }}>
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
            </div>*/}
            안전점검 대시보드 페이지입니다

            <div>
                    <BarChart
                        width={500}
                        height={300}
                        data={barChartData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" stackId="a" fill="#8884d8" />
                        <Bar dataKey="dangerKind" stackId="a" fill="#82ca9d" />
                    </BarChart>
            </div>
        </div>
    );
}

export default SafetyInspectionStatisticsImg;