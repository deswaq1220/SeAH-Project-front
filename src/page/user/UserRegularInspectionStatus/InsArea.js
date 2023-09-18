import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function InsArea({ onFormDataChange }) {
  const [regularPartList, setRegularPartList] = useState([]);
  const [selectedPart, setSelectedPart] = useState(""); // 선택영역
  const [customInputVisible, setCustomInputVisible] = useState(false); // 직접입력 인풋창 가시성 상태
  // 새로운 상태 변수 추가
  const [customInputValue, setCustomInputValue] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user/regularpart`
      );

      setRegularPartList(response.data.regularPartList);
      // console.log(response.data.regularPartList);
    } catch (error) {
      console.error("데이터 로딩 오류:", error);
    }
  }

  // 직접 입력 값을 업데이트하고 onFormDataChange 호출
  const handleCustomInputChange = (event) => {
    const value = event.target.value;
    setCustomInputValue(value);
    onFormDataChange({ partMenu: value });
  };

  // 영역 선택 시 selectedPart 값 업데이트하고 onFormDataChange 호출
  const handleSelectedPart = (value) => {
    if (value === "기타(직접입력)") {
      setCustomInputVisible(true);
      setSelectedPart(value); // 기타(직접입력) 선택 시에만 selectedPart 업데이트
      onFormDataChange(customInputValue); // 기타(직접입력) 선택 시 customInputValue를 전달함.
    } else {
      setCustomInputVisible(false);
      setSelectedPart(value);
      onFormDataChange(value);
    }
  };

  return (
    <>
      <div className="flex flex-col flex-wrap">
        <div className="flex items-center">
          <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
            영역
          </span>
          <Listbox value={selectedPart} onChange={handleSelectedPart}>
            {({ open }) => (
              <>
                <div className="relative mt-2">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-20 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                    <span className="block truncate">
                      {selectedPart ? selectedPart : "선택"}
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
                      {regularPartList.map((item) => (
                        <Listbox.Option
                          key={item}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "bg-seahColor text-white"
                                : "text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                          value={item}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {item}
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
          {customInputVisible && (
            <input
              type="text"
              value={customInputValue}
              onChange={handleCustomInputChange}
              placeholder="직접 입력"
              className="cursor-default rounded-md bg-white py-1.5 px-3 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6 ml-2 mt-2 border-0"
            />
          )}
        </div>
      </div>
    </>
  );
}
