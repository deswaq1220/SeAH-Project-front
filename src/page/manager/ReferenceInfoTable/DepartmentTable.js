import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../../../components/Pagination";

export default function DepartmentTable() {
  const [departments, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; //

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/admin/master/department/view`
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("데이터 로딩 오류:", error);
      }
    };

    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedDepartments = departments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            부서
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            부서등록 및 수정이 가능합니다
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"></div>
      </div>
      <div className="-mx-4 mt-8 sm:-mx-0">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                부서명
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                부서코드
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              ></th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              >
                수정
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                삭제
              </th>
              <th
                scope="col"
                className="relative py-3.5 pl-3 pr-4 sm:pr-0"
              ></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {displayedDepartments.map((department) => (
              <tr key={department.departmentId}>
                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                  {department.departmentName}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                  {department.departmentId}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell"></td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  <span className="text-green-700 hover:text-green-900 cursor-pointer">
                    수정
                  </span>
                </td>
                <td className="py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-0">
                  <span className="text-seahColor hover:text-seahDeep cursor-pointer">
                    삭제
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={departments.length}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
