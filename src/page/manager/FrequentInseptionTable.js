import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}


export default function FrequentInseptionTable({ searchResults }) {
  // const [fetchedResults, setFetchedResults] = useState([]);
  const navigate = useNavigate();
  const [fetchedResults, setFetchedResults] = useState([]);

  // var now = new Data();
  // const thisYear =  currentDate.getFullYear();    // 현재년도
  // const thisMonth = thisYear.format("M");
  // console.log("thisYear 확인: " + thisYear);
  // console.log("thisMonth 확인: " + thisMonth);

  // useEffect(() => {
  //   function specialFetchDataWithAxios() {
  //   // 첫 화면
  //     axios
  //       .get(`${process.env.REACT_APP_API_BASE_URL}/frequentinspection`, {
  //         params: {
  //           spePart,
  //           speFacility,
  //           speStartDate ,
  //           speEndDate,
  //           speComplete,
  //           spePerson,
  //           speEmpNum,
  //         },
  //       })
  //       .then((response) => {
  //         const speListFromBack = response.data.searchSpeList.searchSpeDataDTOList;
  //         setSearchData(speListFromBack);
  //
  //       })
  //
  //       .catch((error) => {
  //         console.error("Error fetching data: ", error);
  //       });
  //   };
  //     specialFetchDataWithAxios();
  // }, []);
  //


  //
  useEffect(() => {
    function specialFetchDataWithAxios() {
      // 첫 화면
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/user/frequentinspection`)   // 세아
        .then((response) => {
          const speListFromBack = response.data.searchSpeList.searchSpeDataDTOList;
          const speListData = speListFromBack.map((item) => {
            return {
              speId:item.speId,
              speDate:item.speDate,
              spePerson:item.spePerson,
              speEmpNum:item.speEmpNum,
              speEmail:item.speEmail,
              spePart:item.spePart,
              speFacility:item.speFacility,
              speContent:item.speContent,
              speActContent:item.speActContent,
              speActEmail:item.speActEmail,
              speActDate:item.speActDate,
              speActPerson:item.speActPerson,
              speComplete:item.speComplete,
            };
          });
          console.log("확인ㅇㅁ: "+speListFromBack);
          setFetchedResults(speListData);
          // setSelectedDanger(speDangerData[0]); // 리스트의 첫번째값으로 세팅
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    }

    specialFetchDataWithAxios();
  }, []);


  // 검색 결과 또는 전체 데이터를 표시할 배열
  const displayResults = searchResults.length > 0 ? searchResults : fetchedResults;



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