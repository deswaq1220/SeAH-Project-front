import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom";

export default function UserRegularInstpectionTable({ data }) {
  const navigate = useNavigate();
  const regularlist = data;


  // 날짜 포맷
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth는 0부터 시작하므로 1을 더해줍니다.
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}년 ${month}월 ${day}일`;
  }

   const goToRegularDetail = (regularId) => {
    navigate(`/regulardetails/${regularId}`);
   }


  return (
    <div className="px-4 sm:px-6 lg:px-8 mx-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            정기점검 현황
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            검색을 통해 등록된 정기점검 현황 데이터를 조회 할 수있습니다.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          {/* <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button> */}
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {regularlist.length === 0 ? (
              <>
                {/* 데이터가 없음 문구 */}
                <p className="flex justify-center items-center h-full text-gray-500">
                  해당 데이터가 없습니다.
                </p>
              </>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
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
                        점검항목
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        점검일자
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        점검자
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        불량건수
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                      >
                        조치완료여부
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {regularlist.map((status) => (
                        <tr key={status.regularId} onClick={() => goToRegularDetail(status.regularId)}>
                          {/*<Link to={`/regulardetails/${result.regularId}`}>*/}
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {status.regularPart}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {status.regularInsName}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatDate(status.regularDate)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {status.regularPerson}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {status.regularInsCount}건
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 flex justify-center">
                            {status.regularComplete === "OK" ? (
                                <CheckCircleIcon className="w-10 text-green-600" />
                            ) : (
                                <XCircleIcon className="w-10 text-red-600" />
                            )}
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}