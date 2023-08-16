
import {Fragment, useEffect, useState} from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {useParams} from "react-router-dom";
import axios from "axios";



function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Danger({onFormDataChange}){
  const { masterdataPart } = useParams(); // url 영역 파라미터
  const { masterdataFacility } = useParams(); // url 설비 파라미터
  const [specialDangerList, setSpecialDangerList] = useState([]) // 위험분류List
  const [selectedDanger, setSelectedDanger] = useState(""); // 위험분류

  // 위험분류 get
  useEffect(() => {
    function specialDangerFetchDataWithAxios(masterdataPart, masterdataFacility) {
      axios
          //.get(`http://172.20.20.252:8081/special/new/${masterdataPart}/${masterdataFacility}`)   // 세아
           .get(`http://localhost:8081/special/new/${masterdataPart}/${masterdataFacility}`)
          .then((response) => {
            const speDangerListFromBack = response.data.specialDangerList;
            const speDangerData = speDangerListFromBack.map((item) => {
              return {
                dangerMenu : item.dangerMenu,
                dangerNum: item.dangerNum,
              };
            });
            setSpecialDangerList(speDangerData);
            setSelectedDanger(speDangerData[0]);  // 리스트의 첫번째값으로 세팅
          })
          .catch((error) => {
            console.error("Error fetching data: ", error);
          });
    }

    specialDangerFetchDataWithAxios(masterdataPart, masterdataFacility);
  }, [masterdataPart, masterdataFacility]);

  // 선택한 값 세팅
  const handleDangerChange = (value) => {
    setSelectedDanger(value);
    onFormDataChange(value);
  }



  return(
    <div id="danger" className="flex items-baseline justify-start">
        <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
          위험분류
        </span>
        {/*<Listbox value={selected} onChange={setSelected}>*/}
        <Listbox value={selectedDanger} onChange={handleDangerChange}>
          {({ open }) => (
            <>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-32 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                  <span className="block truncate">{selectedDanger.dangerMenu}</span>
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
                    {specialDangerList.map((specialDangerItem) => (
                      <Listbox.Option
                        key={specialDangerItem.dangerMenu}
                        className={({ active }) =>
                          classNames(
                            active
                              ? "bg-seahColor text-white"
                              : "text-gray-900",
                            "relative cursor-default select-none py-2 pl-3 pr-9"
                          )
                        }
                        value={specialDangerItem}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "block truncate"
                              )}
                            >
                              {specialDangerItem.dangerMenu}
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
  )
}