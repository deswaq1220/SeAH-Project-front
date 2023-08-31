import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {format} from "date-fns";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}


export default function FrequentInseptionTable({ searchResults }) {
  const navigate = useNavigate();
  const [thisMonthResults, setThisMonthResults] = useState([]);   // 해당 월 데이터

  // 현재월 구하기
  var today = new Date();
  var year = today.getFullYear();
  var month = ('0' + (today.getMonth() + 1)).slice(-2);
  var dateString = year + '-' + month;
  console.log(dateString);


  useEffect(() => {
    function specialFetchDataWithAxios() {
      // 첫 화면
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/frequentinspection`)   // 세아
        .then((response) => {
          const speListFromBack = response.data.searchSpeList.searchSpeDataDTOList;

          // 해당 월 데이터 세팅
          const thisMonthData = speListFromBack.filter((item) => item.speDate.substring(0, 7) === dateString);
          setThisMonthResults(thisMonthData);
        })


        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    }

    specialFetchDataWithAxios();
  }, []);


  // 검색 결과 또는 해당월 데이터를 표시할 배열
  const displayResults = searchResults.length > 0 ? searchResults : thisMonthResults;



  /// 수시점검현황
  return (
    <div className="mx-4 mt-4">
      {displayResults.map((result, index) => (
        <div key={index} className="mx-8 flow-root"  onClick={() => {navigate(`/all/special/detail/${result.speId}`);}} >
          <div className="flex">
            <p className="text-blue-700">
              <span className="font-semibold mr-1">점검일자</span>
              {result.speDate}
            </p>
            <p className="text-blue-700">
              <span className="font-semibold mr-1">점검자</span>
              {result.spePerson}
            </p>
          </div>
          <div className="mx-4 mt-4 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
              <tr className="divide-x divide-gray-200">
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  영역
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  설비명
                </th>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  조치자
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  조치완료 여부
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
              <tr className="divide-x divide-gray-200">
                <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                  {result.spePart}
                </td>
                <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                  {result.speFacility}
                </td>
                <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                  {result.speActPerson} / {result.speActEmail}
                </td>
                <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                  {result.speComplete}
                </td>
              </tr>
              </tbody>
              <thead>
              <tr className="divide-x divide-gray-200">
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  점검내용
                </th>
                <th
                  scope="col"
                  className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  개선대책
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
              <tr className="divide-x divide-gray-200">
                <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                  {result.speContent}
                </td>
                <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                  {result.speActContent}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>

  );
}