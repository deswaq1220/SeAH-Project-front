import { Fragment, useState,useEffect } from "react";
import axios from "axios";
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { tab } from "@testing-library/user-event/dist/tab";
import UserRegularTable from "./UserRegularTable";


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function InspectionItem() {
  const [regularNameList, setRegularNameList] = useState([]); //정기점검 항목
  const [checkList, setCheckList] = useState([]); //정기점검 항목
  const [selectedArea, setSelectedArea] = useState(null);

  //점검리스트 조회
  const handleSearchClick = async () => {
    try {
      if (selectedArea) {
        const selectedPosition = regularNameList.indexOf(selectedArea);
        if (selectedPosition !== -1) {
          const regularNum = selectedPosition + 1;
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user/regularcheck`, {   // 세아
              params: {
                regularNum: regularNum,
              },
            });
            setCheckList  (response.data);
        }
      }
    } catch (error) {
      console.error("서버 요청 오류:", error);
    }
  };

  useEffect(() => {

  }, [checkList]);
  


  

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/regularname`
        );

        // 문자열 배열을 객체로 변환하여 새로운 배열 생성
        const optionsArray = response.data.regularNameList.map(
          (name, index) => ({
            id: index + 1,
            name: name,
          })
        );

        setRegularNameList(optionsArray);
        setSelectedArea(optionsArray[0]);
     
      } catch (error) {
        console.error("서버 요청 오류:", error);
      }
    }

    fetchOptions();
  }, []);

  


  return (
    <div className="flex items-center justify-center ml-4">
     <Listbox value={selectedArea} onChange={setSelectedArea}>
      {({ open }) => (
        <>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
            <span className="block truncate">
                      {selectedArea ? selectedArea.name : "선택"}
                    </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {regularNameList.map((regularName) => (
                  <Listbox.Option
                    key={regularName.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-seahColor text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={regularName}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {regularName.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-seahColor',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
    <button
        type="button"
        onClick={handleSearchClick}
        className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor ml-2 mt-2"
      >
        조회하기
      </button>
    </div>
  )
};
