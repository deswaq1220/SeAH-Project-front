import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { toast } from 'react-toastify';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function InspectionArea({ handleInspectionAreaChange }) {
  const [regularPartList, setRegularPartList] = useState([]); // 설비영역
  const [selectedArea, setSelectedArea] = useState(null);
  const [customInputVisible, setCustomInputVisible] = useState(false); // 직접입력 인풋창 가시성 상태
  const [customInputValue, setCustomInputValue] = useState(""); // 새로운 상태 변수 추가

  const showNotification = () => {
    toast.warn('점검구역이 선택되지 않았습니다.', {
      position: 'top-right',
      autoClose: 3000, 
    });
  };

  const handleInputChange = (name) => {
    const regularPart = name;
    console.log(regularPart);
  };
  useEffect(() => {
    if (selectedArea !== null) {
      handleInputChange(selectedArea.name);
      handleInspectionAreaChange({
        regularPart: selectedArea.name,
      });
    }
  }, [selectedArea]);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/regularpart`
        );

        // 문자열 배열을 객체로 변환하여 새로운 배열 생성
        const optionsArray = response.data.regularPartList.map(
          (name, index) => ({
            id: index + 1,
            name: name,
          })
        );
        setRegularPartList(optionsArray);
        setSelectedArea(optionsArray[0]);
      } catch (error) {
        console.error("서버 요청 오류:", error);
      }
    }

    fetchOptions();
  }, []);

  // 영역 선택 시 selectedPart 값 업데이트하고 onFormDataChange 호출
  const handleSelectedArea = (value) => {
    setSelectedArea(value);
    if (value.name === '기타(직접입력)') {
      setCustomInputVisible(true);
    } else {
      if (!value.name) {
        showNotification(); 
        return; 
      }
      setCustomInputVisible(false);
      handleInputChange(value.name);
      handleInspectionAreaChange({
        regularPart: value.name,
      });
    }
  };

  // 직접 입력 값을 업데이트하고 onFormDataChange 호출
  const handleCustomInputChange = (event) => {
    const value = event.target.value;
    setCustomInputValue(value);
    handleInspectionAreaChange({
      regularPart: value,
    });
  };

  return (
    <>
      <div id="charge" className="flex  items-baseline justify-start">
        <div className="flex flex-col ml-2">
          <Listbox value={selectedArea} onChange={handleSelectedArea}>
            {({ open }) => (
              <>
                <div className="relative mt-2">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-32 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                    <span className="block truncate">
                      {selectedArea ? selectedArea.name : "선택"}
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
                      {regularPartList.map((option) => (
                        <Listbox.Option
                          key={option.id}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "bg-seahColor text-white"
                                : "text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
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
                                [{option.name}]
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
              className="cursor-default rounded-md bg-white py-1.5 px-3 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6 my-2 border-0"
            />
          )}
        </div>
      </div>
    </>
  );
}
