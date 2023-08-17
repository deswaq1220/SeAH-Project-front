import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios"; // axios를 임포트]


const people = [
  { id: 1, name: "[선택]" },
  { id: 2, name: "[주조]" },
  { id: 2, name: "[압출]" },
  { id: 3, name: "[가공]" },
  { id: 4, name: "[품질]" },
  { id: 5, name: "[생산기술]" },
  { id: 6, name: "[금형]" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FacilityReg({ fetchData, handleNewData }) {
  const [selected, setSelected] = useState(people[0]);
  const [facilityName, setFacilityName] = useState(""); // 설비명 관련 상태 추가

  const handleRegister = async () => {
    const requestData = {
      masterdataFacility: facilityName,
      masterdataPart: selected.name,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/master`, requestData); //세아
      // const response = await axios.post("http://localhost:8081/master", requestData); // POST 요청 보내기
      console.log("서버 응답:", response.data);
      fetchData();
      // Add this line to update FacilityTable's state directly
      handleNewData(response.data); 
    } catch (error) {
      console.error("서버 요청 오류:", error);
    }
  };

  return (
    <div className="px-8">
      <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 my-4">
        설비등록
      </span>
      <div id="charge" className="flex  items-baseline justify-start">
        <div className="sm:col-span-3">
          <label
            htmlFor="Facilityname"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            설비명
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="Facilityname"
              id="Facilityname"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)} // 입력 값 변경 시 설비명 상태 업데이트
              autoComplete="family-name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
            />
          </div>
        </div>
        <div className="flex flex-col ml-2 z-10">
          <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                  영역
                </Listbox.Label>
                <div className="relative mt-2">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-28 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
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
                      {people.map((person) => (
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
            onClick={handleRegister}
            className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor mt-2"
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}
