import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {useParams} from "react-router-dom";
import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}


export default function Falsetrap({onFormDataChange}){
  const { masterdataPart } = useParams(); // url 영역 파라미터
  const { masterdataId } = useParams(); // url 설비코드 파라미터
  const [specialTrapList, setSpecialTrapList] = useState([]) // 실수함정List
  const [trapSelected, setTrapSelected] = useState(""); //  실수함정


  // 실수함정 get
  useEffect(() => {
    function specialTrapFetchDataWithAxios(masterdataPart, masterdataFacility) {
      axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/user/special/new/${masterdataPart}/${masterdataId}`)   // 세아
          .then((response) => {
            const speTrapListFromBack = response.data.specialTrapList;
            const speTrapData = speTrapListFromBack.map((item) => {
              return {
                trapMenu : item.trapMenu,
                trapNum: item.trapNum,
              };
            });
            setSpecialTrapList(speTrapData);
            setTrapSelected(speTrapData[0]);
          })
          .catch((error) => {
            console.error("Error fetching data: ", error);
          });
    }

    specialTrapFetchDataWithAxios(masterdataPart, masterdataId);
  }, [masterdataPart, masterdataId]);

  // 선택한 값 세팅
  const handleTrapChange = (value) => {
    setTrapSelected(value);
    onFormDataChange(value);
  };

  return(
    <div id="falsetrap" className="flex items-baseline justify-start">
        <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
          실수함정
        </span>
        {/* 실수함정 */}
        <Listbox value={trapSelected} onChange={handleTrapChange}>
          {({ open }) => (
            <>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-32 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                  <span className="block truncate">
                    {trapSelected.trapMenu}
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
                    {specialTrapList.map((specialTrapItem) => (
                      <Listbox.Option
                        key={specialTrapItem.trapMenu}
                        className={({ active }) =>
                          classNames(
                            active
                              ? "bg-seahColor text-white"
                              : "text-gray-900",
                            "relative cursor-default select-none py-2 pl-3 pr-9"
                          )
                        }
                        value={specialTrapItem}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "block truncate"
                              )}
                            >
                              {specialTrapItem.trapMenu}
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