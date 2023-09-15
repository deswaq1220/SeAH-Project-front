import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const status = [
  { id: 1, name: "선택", value: "00" },
  { id: 2, name: "완료", value: "OK" },
  { id: 3, name: "미완료", value: "NO" },
];
// 점검자
export default function Inspector({ onFormDataChange }) {
  // 점검자정보
  const [inspectorData, setInspectorData] = useState({
    inspectorName: null,
    inspectorNum: null,
  });

  const [selected, setSelected] = useState(status[0]);
  // 입력란 변경 시 상태 업데이트 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // 새로운 상태 업데이트
    const updatedInspecFormDate = {
      ...inspectorData,
      [name]: value || null, // 빈 문자열이면 null로 설정
    };

    setInspectorData(updatedInspecFormDate);

    // 폼 데이터 업데이트 후에 콜백 호출
    onFormDataChange({
      inspectorName: updatedInspecFormDate.inspectorName,
      inspectorNum: updatedInspecFormDate.inspectorNum,
      speComplete: selected.value,
    });
  };

  const handleSelected = (selectedData) => {
    setSelected(selectedData);
    onFormDataChange({
      inspectorName: inspectorData.inspectorName,
      inspectorNum: inspectorData.inspectorNum,
      speComplete: selectedData.value,
    });
  };

  return (
    <div className="flex flex-wrap">
      <div id="inspector" className="flex items-baseline justify-start flex-wrap">
        <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
          점검자
        </span>
        <div className="flex flex-wrap">
          <div className="sm:col-span-3">
            <div className="mt-2 mr-2">
              <input
                type="text"
                name="inspectorNum"
                id="inspectorNum"
                autoComplete="off"
                placeholder="사원번호"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
                value={inspectorData.inspectorNum} // 상태 value로 설정
                onChange={handleInputChange} // 입력란 변경 시 상태업데이트
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <div className="mt-2">
              <input
                type="text"
                name="inspectorName"
                id="inspectorName"
                autoComplete="off"
                placeholder="이름"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5 mb-2"
                value={inspectorData.inspectorName}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className=" flex items-baseline justify-start ">
          <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
            완료 여부
          </span>
          <Listbox value={selected} onChange={handleSelected}>
            {({ open }) => (
              <>
                <div className="relative mt-2">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-14 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                    <span className="block truncate">{selected.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
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
                      {status.map((person) => (
                        <Listbox.Option
                          key={person.id}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "bg-seahColor text-white"
                                : "text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                          value={person}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {person.name}
                              </span>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? "text-white" : "text-seahColor",
                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                  )}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
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
        </div>
      </div>
    </div>
  );
}
