import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DepartmentReg() {
  return (
    <>
      <div className="px-8 relative z-20">
        <span className=" w-22 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 my-4">
          부서등록
        </span>
        <div id="charge" className="flex  items-baseline justify-start">
        

        <div className="sm:col-span-3 ml-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            부서명1
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="Department"
              id="Department"
              placeholder="영업부"
              autoComplete="family-name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
            />
          </div>
        </div>
        <div className="sm:col-span-3 ml-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            부서명2
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="Department2"
              id="Department2"
              placeholder="영업팀"
              autoComplete="family-name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
            />
          </div>
        </div>

        <div className="flex flex-col ml-2">
          <label
            htmlFor="submit"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            생성
          </label>
          <button
            type="button"
            id="submit"
            className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor mt-2"
          >
            등록하기
          </button>
        </div>
      </div>
        
      </div>
    </>
  );
}
