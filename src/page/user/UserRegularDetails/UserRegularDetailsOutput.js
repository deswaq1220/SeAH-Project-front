import {useEffect, useState} from "react";
import axios from "axios";

export default function UserRegularDetailsOutput({regularData}) {
  const [regularIns, setRegularIns] = useState([]);
  //
  // useEffect(() => {
  //   const setData = () =>{
  //     setRegularIns({onFormDataChange} );
  //     console.log(onFormDataChange.regularPerson);
  //   }
  //       setData()
  //
  // }, []);

  return (
    <>
      <div className="flex items-center">
        <label
          htmlFor="inspectionArea"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
            점검항목
          </span>
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="inspectionArea"
            id="inspectionArea"
            defaultValue={regularData.regularInsName}
            disabled
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"

          />
        </div>
      </div>
      <div className="flex items-center">
        <label
          htmlFor="date"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
            점검날짜
          </span>
        </label>
        <div className="mt-2">
          <input
            type="type"
            name="date"
            id="date"
            defaultValue={regularData.regularDate}
            disabled
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
            placeholder="2023.08.22 11시30분"
          />
        </div>
      </div>
      <div className="flex items-center">
        <label
          htmlFor="inspectionArea"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
            점검구역
          </span>
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="inspectionArea"
            id="inspectionArea"
            defaultValue={regularData.regularPart}
            disabled
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"

          />
        </div>
      </div>
      <div className="flex items-center">
        <label
          htmlFor="inspector"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
            점검자
          </span>
        </label>
        <div className="flex flex-wrap">
          <div className="mt-2 mr-2">
            <input
              type="text"
              name="inspector"
              id="inspector"
              disabled
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
              defaultValue={regularData.regularPerson}
            />
          </div>
          <div className="mt-2 mr-2">
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={regularData.regularEmail}
              disabled
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
              placeholder="cutysexy@seah.co.kr"
            />
          </div>
          <div className="mt-2">
            <input
              type="text"
              name="Employeenumber"
              id="Employeenumber"
              defaultValue={regularData.regularEmpNum}
              disabled
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
              placeholder="A201913925"
            />
          </div>
        </div>
      </div>
    </>
  );
}
