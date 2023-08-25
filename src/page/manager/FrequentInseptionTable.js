import React from "react";
import axios from "axios";

// const people = [
//   {
//     name: "Lindsay Walton",
//     title: "Front-end Developer",
//     email: "lindsay.walton@example.com",
//     role: "Member",
//   },
//   // More people...
// ];




export default function FrequentInseptionTable({ searchResults }) {

  // const handleFormSubmit = () => {
  //   const requestData = {
  //     // 영역, 설비명, 기간_시작, 기간_끝, 점검자 이름, 점검자 사번, 완료유무
  //     spePart: spePart,
  //     speFacility: speFacility,
  //     speStartDate: speStartDate,
  //     speEndDate: speEndDate,
  //     speComplete: speComplete,
  //     spePerson: spePerson,
  //     speEmpNum: speEmpNum,
  //   }
  //   console.log(requestData);

  //   // 검색
  //   axios
  //       .get(`${process.env.REACT_APP_API_BASE_URL}/frequentinspection`, requestData, {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       })
  //       .then((response) => {
  //         setSearchResults(response.data.searchSpeList);
  //
  //         if(requestData !== null) {
  //           // 등록이 완료되었다는 알림 띄우기
  //           toast.success("등록이 완료되었습니다.", {
  //             position: "top-center",
  //             autoClose: 2000, // 알림이 2초 후에 자동으로 사라짐
  //             hideProgressBar: true,
  //           });
  //
  //           console.log(response);
  //           console.log(requestData);
  //
  //           // // 저장성공시 해당설비의 리스트 페이지
  //           // navigate(`/special/list/${masterdataPart}/${encodeURIComponent(masterdataFacility)}`);
  //         }
  //
  //       })
  //       .catch((error) => {
  //         console.log(requestData);
  //         console.error(error);
  //         alert("검색에 실패했습니다. 다시 시도해주세요.");
  //       });
  // };




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
