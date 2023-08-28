import {Fragment, useEffect, useState} from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function EquipmentName({onFormDataChange, selectedPart}) {
 const [speFacilityList, setSpeFacilityList] = useState([]);
 const [selectedFacility, setSelectedFacility] = useState(""); // 선택영역


 // 설비 목록 업데이트 함수
 const updateFacilityList = (part) => {
  axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/frequentinspection`)  // 세아
      .then((response) => {
       const speFacListFromBack = response.data.searchPartAndFacList.facilityList;
          console.log("여기확인임: "+speFacListFromBack);

       if (part === "선택") {
        setSelectedFacility("");
       } else {
        // 선택한 영역에 해당하는 설비가 등록되어있을때
        const filteredFacilityData = speFacListFromBack.filter(
            (item) => item.masterdataPart === part
        );

        if (filteredFacilityData.length > 0) {
         setSpeFacilityList(filteredFacilityData);
         setSelectedFacility(filteredFacilityData[0]);
         onFormDataChange(filteredFacilityData[0]);
        } else {
         // 선택한 영역에 해당하는 설비가 등록되지 않았을 때
         setSpeFacilityList([]);
         setSelectedFacility("");
         onFormDataChange("");
         // alert("선택한 영역에 해당하는 설비가 없습니다.");
        }
       }
      })
      .catch((error) => {
       console.error("Error fetching data: ", error);
      });
 };

 useEffect(() => {
  updateFacilityList(selectedPart);

 }, [selectedPart]);

 const handleSelectedFac = (value) => {
  setSelectedFacility(value);
  onFormDataChange(value);
 };



  return (
    <>
      <div className="flex flex-col ">
        <div className="flex items-center">
          <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
            설비명
          </span>
          <Listbox value={selectedFacility} onChange={handleSelectedFac}>
            {({ open }) => (
              <>
                <div className="relative mt-2">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-20 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                    <span className="block truncate">{selectedFacility.masterdataFacility}</span>
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
                      {speFacilityList.map((item) => (
                          <Listbox.Option
                              key={item.masterdataId}
                              className={({ active }) =>
                                  classNames(
                                      active ? "bg-seahColor text-white" : "text-gray-900",
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
                                {item.masterdataFacility}
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
    </>
  );
}
