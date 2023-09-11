import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FrequentInseptionTable({ searchResults }) {
  const navigate = useNavigate();
  const [thisMonthResults, setThisMonthResults] = useState([]); // 해당 월 데이터

  // 현재월 구하기
  var today = new Date();
  var year = today.getFullYear();
  var month = ("0" + (today.getMonth() + 1)).slice(-2);
  var dateString = year + "-" + month;
  // console.log(dateString);

  useEffect(() => {
    function specialFetchDataWithAxios() {
      // 첫 화면
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/user/frequentinspection`) // 세아
        .then((response) => {
          const speListFromBack =
            response.data.searchSpeList.searchSpeDataDTOList;

          // 해당 월 데이터 세팅
          const thisMonthData = speListFromBack.filter(
            (item) => item.speDate.substring(0, 7) === dateString
          );
          setThisMonthResults(thisMonthData);
          console.log("데이터 다 불러와", speListFromBack);
        })

        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    }

    specialFetchDataWithAxios();
  }, []);

  // 검색 결과 또는 해당월 데이터를 표시할 배열
  const displayResults =
    searchResults.length > 0 ? searchResults : thisMonthResults;

  // 점검 일자 포맷팅 함수 추가

  const formatDate = (dateString) => {
    if (dateString === "0000-00-00") return ""; // '0000-00-00'일 경우 빈 문자열 반환

    const dateObj = new Date(dateString);
    return format(dateObj, "yyyy-MM-dd"); // 날짜를 'yyyy-MM-dd' 형식으로 반환
  };

  // 위험성평가 포맷
  const getRiskAssessmentText = (riskAssessment) => {
    switch (riskAssessment) {
      case "HIGH":
        return "고 위험(6~9): 즉시 개선";
      case "MEDIUM":
        return "중 위험(3~4): 개선 필요";
      case "LOW":
        return "저 위험(1~2): 수용 가능";
      default:
        return "";
    }
  };
  // 완료여부 포맷
  const getComplateText = (complate) => {
    switch (complate) {
      case "NO":
        return "미완료";
      case "OK":
        return "완료";
      default:
        return "";
    }
  };

  const handleExcelSave = () => {
    // 엑셀 파일 생성 로직 작성

    const data = [
      [
        "점검일시",
        "점검자",
        "점검영역",
        "설비명",
        "위험분류",
        "부상부위",
        "위험원인",
        "실수함정",
        "위험성평가",
        "완료요청기한",
        "점검내용",
        "개선대책",
        "조치자",
        "이메일",
        "완료여부",
      ],
      ...displayResults.map((result) => [
        formatDate(result.speDate),
        result.spePerson,
        result.spePart,
        result.speFacility,
        result.speDanger,
        result.speInjure,
        result.speCause,
        result.speTrap,
        getRiskAssessmentText(result.speRiskAssess),
        formatDate(result.speDeadline),
        result.speContent,
        result.speActContent,
        result.speActPerson,
        result.speActEmail,
        getComplateText(result.speComplete),
      ]),
    ];

    const worksheetName = "Sheet 1"; // 시트 이름 설정

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Blob으로 변환하여 파일 저장
    const blobData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blobData, "수시점검현황.xlsx");
  };

  // 점검 내용과 개선 대책의 길이를 확인하고, 20자가 넘으면 '...'으로 처리하는 함수
  const formatText = (text) => {
    return text.length > 20 ? text.slice(0, 20) + "..." : text;
  };

  /// 수시점검현황
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
          수시점검 현황 조회
          </h1>
          <p className="mt-2 text-sm text-gray-700">
          검색을 통해 등록된 수시점검 현황 데이터를 조회 및 엑셀 저장이 가능합니다.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
            type="button"
            onClick={handleExcelSave}
            className="block rounded-md bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-800  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            엑셀저장
          </button>
        </div>
      </div>
      {displayResults.map((result, index) => (
        <div key={index} className="mt-8 flow-root">
          <div className="flex flex-col mb-2">
            <p className="text-seahColor">
              <span className="font-semibold mr-1">점검일자</span>
              {formatDate(result.speDate)}
              {/* formatDate 함수로 점검일자 포맷팅 */}
            </p>
            <p className="text-seahColor">
              <span className="font-semibold mr-1">점검자</span>
              {result.spePerson}
            </p>
          </div>
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <Link to={`/all/special/detail/${result.speId}`}>
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          영역
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          설비명
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          위험분류
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          조치자
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          완료여부
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {result.spePart}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {result.speFacility}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {result.speDanger}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {result.speActPerson} / {result.speActEmail}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
                          <span
                            className={
                              result.speComplete === "NO"
                                ? "text-red-500"
                                : "text-blue-500"
                            }
                          >
                            {getComplateText(result.speComplete)}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          점검내용
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {formatText(result.speContent)}
                        </td>
                        
                      </tr>
                    </tbody>
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          개선대책
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {formatText(result.speActContent)}
                        </td>
                        
                      </tr>
                    </tbody>
                  </table>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
