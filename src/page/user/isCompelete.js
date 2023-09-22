import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";


const completionStatusOptions = [
 { id: 1, name: "미완료", value: "NO" },
 { id: 2, name: "완료", value: "OK" },
];


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function IsCompelete({ onFormDataChange, complete }) {
  const [completionStatusSelected, setCompletionStatusSelected] = useState(
    completionStatusOptions.find((option) => option.id === (complete ? 2 : 1))
  );


  // 선택 시 값 업데이트, onFormDataChange 호출
 const handleCompletionStatusChange  = (completionStatusSelected) => {
  setCompletionStatusSelected(completionStatusSelected);
  onFormDataChange(completionStatusSelected.value);
 };

  // 처음 세팅된 값을 onFormDataChange로 보내기
  useEffect(() => {
    onFormDataChange(completionStatusSelected.value);
  }, [completionStatusSelected, onFormDataChange]);


  useEffect(() => {
    setCompletionStatusSelected(completionStatusOptions.find((option) => option.id === (complete ? 2 : 1)));
  }, [complete]); // 'complete' prop이 변경될 때마다 실행


  return (
    <div id="injured" className="flex items-baseline justify-start">
      <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
        조치여부
      </span>
      <div className="flex flex-col">
        {/* 완료여부 */}
        <Listbox
          value={completionStatusSelected}
          onChange={handleCompletionStatusChange}
        >
          {({ open }) => (
            <>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-60 cursor-default rounded-md bg-white py-1.5 pl-3 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                  <span className="block truncate">
                    {completionStatusSelected.name}
                  </span>
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
                    {completionStatusOptions.map((option) => (
                      <Listbox.Option
                        key={option.id}
                        disabled={option.id === (complete ? 1 : 2)}
                        className={({ active, disabled }) =>
                            classNames(
                                active
                                    ? "bg-seahColor text-white"
                                    : disabled // 비활성화된 옵션을 연하게 표시
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-gray-900 cursor-pointer",
                                "relative select-none py-2 pl-3 pr-9"
                            )
                        }
                        value={option}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "block truncate"
                              )}
                            >
                              {option.name}
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
  );
}
