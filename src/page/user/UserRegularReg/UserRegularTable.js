import React, { useState } from "react";
import FaultyModal from "./FaultyModal";

const people = [
  {
    name: "1",
    title: "근로자가 작업에 필요한 보호구를 착용하고 있는가?",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];

const notificationMethods = [
  { id: "good", title: "양호", color: "text-blue-600" },
  { id: "bad", title: "불량", color: "text-red-600" },
  { id: "NA", title: "N/A", color: "text-gray-900" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UserRegularTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const handleRadioChange = (person) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            정기점검
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            정기점검 체크항목 리스트입니다
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
                번호
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                유해위험요인 확인
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
              >
                확인결과
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {people.map((person) => (
              <tr key={person.email}>
                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                  {person.name}
                  <div className="font-normal lg:hidden">
                    <div className="mt-1 truncate text-gray-700">
                      {person.title}
                    </div>
                    <div className="sr-only sm:hidden">Email</div>
                    <div className="mt-1 truncate text-gray-500 sm:hidden">
                      <div className="ml-1">
                        <div className="space-x-4 flex">
                          {notificationMethods.map((notificationMethod) => (
                            <div
                              key={notificationMethod.id}
                              className="flex items-center"
                            >
                              <input
                                type="radio"
                                id={`radio-${person.email}`}
                                name="radio-group"
                                value="bad"
                                onChange={() => handleRadioChange(person)}
                                className="h-4 w-4 border-gray-300 text-seahColor focus:ring-seahColor"
                              />
                              <label
                                htmlFor={notificationMethod.id}
                                className={`ml-3 block text-sm font-bold leading-6 ${notificationMethod.color}`}
                              >
                                {notificationMethod.title}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                  {person.title}
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                  <div>
                    <div className="space-x-4 flex">
                      {notificationMethods.map((notificationMethod) => (
                        <div
                          key={notificationMethod.id}
                          className="flex items-center"
                        >
                          <input
                            type="radio"
                            id={`radio-${person.email}`}
                            name="radio-group"
                            value="bad"
                            onChange={() => handleRadioChange(person)}
                            className="h-4 w-4 border-gray-300 text-seahColor focus:ring-seahColor"
                          />
                          <label
                            htmlFor={notificationMethod.id}
                            className={`ml-3 block text-sm font-bold leading-6 ${notificationMethod.color}`}
                          >
                            {notificationMethod.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor "
        >
          저장
        </button>
      </div>

      {isModalOpen && (
        <FaultyModal
          person={selectedPerson}
          closeModal={() => setIsModalOpen(false)} // 모달 닫기
        />
      )}
    </div>
  );
}
