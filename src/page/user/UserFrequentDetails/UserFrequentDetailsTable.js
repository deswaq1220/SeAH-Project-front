import React, { useState, useEffect } from "react";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { useParams } from "react-router-dom";
import axios from "axios";
import fetcher from "../../../api/fetcher";
import { useCookies } from "react-cookie";
export default function UserFrequentDetailsTable() {
  const { speId } = useParams(); // URL 파라미터로부터 speId를 가져옵니다.
  const [inspectionData, setInspectionData] = useState(null); // API로부터 받은 데이터를 저장할 상태 변수
  const [atCookies, setAtCookie] = useCookies(["at"]); // 쿠키 훅

  useEffect(() => {
    // API 요청을 보내 데이터를 가져옵니다.
    async function fetchData() {
      const authToken = atCookies["at"]; // 사용자의 인증 토큰을 가져옵니다.
      try {
        const response = await fetcher.get(`/special/detail/${speId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        setInspectionData(response.data); // 데이터를 상태 변수에 저장합니다.
        console.log(response.data);
        const accessToken = response.data.access_token;
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [speId]); // speId가 변경될 때마다 useEffect가 실행됩니다.

  if (!inspectionData) {
    // 데이터가 아직 로드되지 않았을 때의 처리
    return <div>Loading...</div>;
  }

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  };

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
  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-5">
      <div className="px-4 sm:px-0">
        <h3 className="text-xl font-extrabold leading-7 text-gray-900">
          수시점검
        </h3>
        <p className="mt-1 max-w-2xl text-base leading-6 text-gray-500">
          등록한 해당 수시점검을 수정 및 조회가 가능합니다
        </p>
        <div className="flex justify-end mt-1">
          <button
            type="button"
            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2"
          >
            삭제
          </button>
        </div>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-base font-bold leading-6 text-gray-900">
              점검일시
            </dt>
            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {formatDate(inspectionData.specialData.speDate)}
            </dd>
          </div>
          <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-base font-bold leading-6 text-gray-900">
              점검자
            </dt>
            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {inspectionData.specialData.spePerson}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-base font-bold leading-6 text-gray-900">
              점검영역
            </dt>
            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {inspectionData.specialData.spePart}
            </dd>
          </div>
          <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-base font-bold leading-6 text-gray-900">
              설비명
            </dt>
            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {inspectionData.specialData.speFacility}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-base font-bold leading-6 text-gray-900">
              위험분류 및 부상부위
            </dt>
            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {inspectionData.specialData.speDanger} /{" "}
              {inspectionData.specialData.speInjure}
            </dd>
          </div>
          <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-base font-bold leading-6 text-gray-900">
              위험원인
            </dt>
            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {inspectionData.specialData.speCause}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-base font-bold leading-6 text-gray-900">
              실수함정
            </dt>
            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {inspectionData.specialData.speTrap}
            </dd>
          </div>
          <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-base font-bold leading-6 text-gray-900">
              위험성평가
            </dt>
            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {getRiskAssessmentText(inspectionData.specialData.speRiskAssess)}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-base font-bold leading-6 text-gray-900">
              완료요청기한
            </dt>
            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {formatDate(inspectionData.specialData.speDeadline)}
            </dd>
          </div>
          <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-base font-bold leading-6 text-gray-900">
              점검내용
            </dt>
            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {inspectionData.specialData.speContent}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-base font-bold leading-6 text-gray-900">
              개선대책
            </dt>
            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {inspectionData.specialData.speActContent}
            </dd>
          </div>
          <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-base font-bold leading-6 text-gray-900">
              조치요청
            </dt>
            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <dd>조치자 : {inspectionData.specialData.speActPerson}</dd>
              <dd>이메일 : {inspectionData.specialData.speActEmail}</dd>
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-base font-bold leading-6 text-gray-900">
              완료여부
            </dt>
            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {getComplateText(inspectionData.specialData.speComplete)}
            </dd>
          </div>
          <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-base font-bold leading-6 text-gray-900">
              조치요청 사진
            </dt>
            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0 flex flex-wrap">
              {inspectionData && inspectionData.noCompImageUrls
                ? inspectionData.noCompImageUrls.map((file, index) => (
                    <img
                      key={index}
                      src={process.env.REACT_APP_API_BASE_URL + file}
                      alt={`사진 ${index + 1}`}
                    />
                  ))
                : "첨부된 사진이 없습니다"}
            </dd>
          </div>

          <div className="bg-white px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-3">
            <dt className="text-base font-bold leading-6 text-gray-900">
              조치완료 사진
            </dt>
            <dd className="mt-1 text-base leading-6 text-gray-700 sm:col-span-2 sm:mt-0 flex flex-wrap">
              {inspectionData && inspectionData.compImageUrls
                ? inspectionData.compImageUrls.map((file, index) => (
                    <img
                      key={index}
                      src={process.env.REACT_APP_API_BASE_URL + file}
                      alt={`사진 ${index + 1}`}
                    />
                  ))
                : "첨부된 사진이 없습니다"}
            </dd>
          </div>
        </dl>
      </div>
      <div className="flex justify-center my-4">
        <button
          type="button"
          className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mr-2"
        >
          확인
        </button>
        <button
          type="button"
          className="rounded-md bg-seahColor px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
        >
          수정 / 조치완료 등록
        </button>
      </div>
    </div>
  );
}
