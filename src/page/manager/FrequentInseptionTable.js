import React, {useEffect, useState} from "react";
import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}


export default function FrequentInseptionTable({ searchResults }) {
  // const [fetchedResults, setFetchedResults] = useState([]);



  useEffect(() => {
    function specialFetchDataWithAxios() {
    // 검색
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/frequentinspection`)   // 세아
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
              speDanger:item.speDanger,
              speInjure:item.speInjure,
              speCause:item.speCause,
              speTrap:item.speTrap,
              speRiskAssess:item.speRiskAssess,
              speContent:item.speContent,
              speActContent:item.speActContent,
              speActEmail:item.speActEmail,
              speActDate:item.speActDate,
              speDeadline:item.speDeadline,
              speComplete:item.speComplete,
            };
          });
          console.log("확인ㅇㅁ: "+speListFromBack);
          // setFetchedResults(speListData);
          // setSelectedDanger(speDangerData[0]); // 리스트의 첫번째값으로 세팅
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    }

      specialFetchDataWithAxios();
  }, []);

  // 검색 결과 또는 전체 데이터를 표시할 배열
  // const displayResults = searchResults.length > 0 ? searchResults : fetchedResults;




  /// 수시점검현황
  return (
      <div className="mx-4 mt-4">
        <div className="flex">
          {searchResults.map((result, index) => (
              <React.Fragment key={index}>
                <p className="text-blue-700">
                  <span className=" font-semibold mr-1">점검일자</span>
                  {result.speDate}
                </p>
                <p className="text-blue-700">
                  <span className=" font-semibold mr-1">점검자</span>
                  {result.spePerson}
                </p>
              </React.Fragment>
          ))}
      </div>
      <div className="-mx-4 mt-2 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
        <div className="mx-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
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
                      className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-0"
                    >
                      위험분류
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-0"
                    >
                      부상부위
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-0"
                    >
                      위험원인
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-0"
                    >
                      실수함정
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-0"
                    >
                      위험성평가
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {searchResults.map((result, index) => (
                    <tr key={index} className="divide-x divide-gray-200">
                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                        {result.spePart}
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                        {result.speFacility}
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                        {result.speDanger}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-0">
                        {result.speInjure}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-0">
                        {result.speCause}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-0">
                        {result.speTrap}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-0">
                        {result.speRiskAssess}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* 점검내용 /개선대책*/}
        <div className="mx-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
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
                {searchResults.map((result, index) => (
                    <tr key={index} className="divide-x divide-gray-200">
                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                        {result.speContent}
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                        {result.speActContent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* 조치자/조치완료요청기간/조치완료여부/조치내용*/}
        <div className="mx-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr className="divide-x divide-gray-200">
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
                      조치완료 요청기간
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      조치완료 여부
                    </th>
                    {/*<th*/}
                    {/*  scope="col"*/}
                    {/*  className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"*/}
                    {/*>*/}
                    {/*  조치내용*/}
                    {/*</th>*/}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {searchResults.map((result, index) => (
                    <tr key={index} className="divide-x divide-gray-200">
                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                        {result.speActPerson} / {result.speActEmail}
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                        {result.speDeadline}
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                        {result.speComplete}
                      </td>
                      {/*<td className="whitespace-nowrap p-4 text-sm text-gray-500">*/}
                      {/*  {result.title}*/}
                      {/*</td>*/}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
