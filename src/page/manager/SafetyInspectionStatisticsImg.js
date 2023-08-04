import Header from "../../components/Header";
import {useEffect, useState} from "react";
import axios from 'axios';
import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// yarn add @nivo/line
import { ResponsiveLine } from '@nivo/line'

function SafetyInspectionStatisticsImg() {
    const [lineChartData, setLineChartData] = useState([]);
    const barChartData = [
        {
            name: '1월',
            uv: 4000,
            pv: 2400,
        },
        {
            name: '2월',
            uv: 3000,
            pv: 1398,
        },
        {
            name: '3월',
            uv: 2000,
            pv: 9800,
        },
        {
            name: '4월',
            uv: 2780,
            pv: 3908,
        },
        {
            name: '5월',
            uv: 1890,
            pv: 4800,
        },
        {
            name: '6월',
            uv: 2390,
            pv: 3800,
        },
        {
            name: '7월',
            uv: 3490,
            pv: 4300,
        },
    ];
    useEffect(() => {
        const fetchData = async () => {
            try {
                const lineChartResponse = await axios.get('http://localhost:8081/special/statistics/dangerandmonth', { params: { year: 2023, month: 7 } });
                setLineChartData(lineChartResponse.data);
                console.log("가져온 데이터 출력값:    ", lineChartResponse.data);
            } catch (error) {
                console.error("불러온 데이터에 에러가 발생했습니다:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Header />
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

            <div>
                <ResponsiveContainer width="100%" height="100%">
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
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="pv" stackId="a" fill="#8884d8" />
                        <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default SafetyInspectionStatisticsImg;