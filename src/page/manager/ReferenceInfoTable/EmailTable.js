import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../../../components/Pagination";

export default function EmailTable() {
  const [people, setPeople] = useState({ email: [] });
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const [editingRow, setEditingRow] = useState(null);
  const [editedValues, setEditedValues] = useState({
    emailPart: "",
    emailName: "",
    emailAdd: "",
    masterStatus: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/master/viewemail`
      );
      console.log("API Response:", response.data);
      setPeople(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function updateEmail(emailId) {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/admin/master/email/update/${emailId}`,
        editedValues
      );
      console.log("이메일이 수정되었습니다");
      setEditingRow(null);
      setEditedValues({
        emailPart: "",
        emailName: "",
        emailAdd: "",
        masterStatus: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error updating email:", error);
    }
  }

  function ReceiptStatus(Status) {
    switch (Status) {
      case "Y":
        return "고정수신";
      case "N":
        return "선택수신";
      default:
        return "";
    }
  }

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentItems = people.email.slice(firstIndex, lastIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            조치담당자
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            이메일 수신여부 설정 및 수정이 가능합니다
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"></div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    영역
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    성명
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    이메일 수신여부
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    수정
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    삭제
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentItems.map((person) => (
                  <tr key={person.emailId}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                      {editingRow === person.emailId ? (
                        <input
                          type="text"
                          value={editedValues.emailPart}
                          onChange={(e) =>
                            setEditedValues({
                              ...editedValues,
                              emailPart: e.target.value,
                            })
                          }
                          className="block w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
                        />
                      ) : (
                        person.emailPart
                      )}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                      {editingRow === person.emailId ? (
                        <input
                          type="text"
                          value={editedValues.emailName}
                          onChange={(e) =>
                            setEditedValues({
                              ...editedValues,
                              emailName: e.target.value,
                            })
                          }
                          className="block w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
                        />
                      ) : (
                        person.emailName
                      )}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                      {editingRow === person.emailId ? (
                        <input
                          type="text"
                          value={editedValues.emailAdd}
                          onChange={(e) =>
                            setEditedValues({
                              ...editedValues,
                              emailAdd: e.target.value,
                            })
                          }
                          className="block w-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
                        />
                      ) : (
                        person.emailAdd
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {editingRow === person.emailId ? (
                        <select
                          value={editedValues.masterStatus}
                          onChange={(e) =>
                            setEditedValues({
                              ...editedValues,
                              masterStatus: e.target.value,
                            })
                          }
                        >
                          <option value="Y">고정수신</option>
                          <option value="N">선택수신</option>
                        </select>
                      ) : (
                        ReceiptStatus(person.masterStatus)
                      )}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6 lg:pr-8">
                      {editingRow === person.emailId ? (
                        <>
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => updateEmail(person.emailId)}
                          >
                            저장
                          </button>
                        </>
                      ) : (
                        <button
                          className="text-green-700 hover:text-green-900"
                          onClick={() => {
                            setEditingRow(person.emailId);
                            setEditedValues({
                              emailPart: person.emailPart,
                              emailName: person.emailName,
                              emailAdd: person.emailAdd,
                              masterStatus: person.masterStatus,
                            });
                          }}
                        >
                          수정
                        </button>
                      )}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6 lg:pr-8">
                      <button
                        className="text-seahColor hover:text-seahDeep"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={people.email.length}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
