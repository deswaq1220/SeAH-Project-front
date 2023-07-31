import UserHeader from "../../components/UserHeader";
import { Link } from "react-router-dom";
// import { CheckCircleIcon } from "@heroicons/react/20/solid";

import {CheckCircleIcon ,XCircleIcon } from "@heroicons/react/24/outline";

const people = [
  {
    name: '[2023-07-31 08:00]',
    title: '[김흥돌]',
    department: '',
    email: '',
    inscontent:'브레이크 정밀 점검 필요',
    action: '',
    icon: XCircleIcon ,
  },
  {
    name: '[2023-07-31 08:00]',
    title: '[김흥돌]',
    department: '[김안전]',
    email: '[2023-08-02 16:00]',
    inscontent:'브레이크 정밀 점검 필요',
    action: '정밀 점검 수행',
    icon: CheckCircleIcon ,
  },
  // More people...
]

export default function Userfrequent() {
  return (
    <div className="container mx-auto sm:px-6 lg:px-8">
      <UserHeader />
      <div className="px-4">
        <p className="font-bold text-xl mb-2">수시점검</p>
        <div className="flex flex-wrap gap-2">
          <label htmlFor="output" className="sr-only"></label>
          <input
            type="text"
            name="output"
            id="output"
            className="block w-auto rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-4 mr-2"
            placeholder="주조/직접집진기(900m2/min)"
          />
          <Link to="/userfrequentreg">

          <button
            type="button"
            className="inline-flex items-center gap-x-2 rounded-md bg-seahColor px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
          >
            <CheckCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            수시점검 등록하기
          </button>
          </Link>
        </div>
      </div>
      {/* <div className="sm:flex sm:items-center"></div> */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    완료여부
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    점검/조치 내용
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {people.map((person) => (
                  <tr key={person.email}>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="h-11 w-11 flex-shrink-0">
                          <person.icon
                            className={
                              person.icon === XCircleIcon
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {person.name}
                          </div>
                          <div className="mt-1 text-gray-500">
                            {person.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div className="text-gray-900">{person.title}</div>
                      <div className="mt-1 text-gray-500">
                        {person.department}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                      <div className="text-gray-900">{person.inscontent}</div>
                      <div className="mt-1 text-gray-500">
                        {person.action}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
