import {Fragment, useEffect, useState} from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import {useParams} from "react-router-dom";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dangersource({onFormDataChange}) {
  const { masterdataPart } = useParams(); // url 영역 파라미터
  const { masterdataFacility } = useParams(); // url 설비 파라미터
  const [specialCauseList, setSpecialCauseList] = useState([]);       // 위험원인
  const [sourceSelected, setSourceSelected] = useState([]);
  const [customSource, setCustomSource] = useState("");


  useEffect(() => {
    function specialCauseFetchDataWithAxios(masterdataPart, masterdataFacility) {
      axios
          .get(`http://localhost:8081/special/new/${masterdataPart}/${masterdataFacility}`)
          .then((response) => {
            const speCauseListFromBack = response.data.specialCauseList;

            const speCauseData = speCauseListFromBack.map((item) => {
              return {
                causeId: item.causeId,
                causeMenu : item.causeMenu,
              };
            });
            setSpecialCauseList(speCauseData);
            console.log(speCauseData);
          })
          .catch((error) => {
            console.error("Error fetching data: ", error);
          });
    }

    specialCauseFetchDataWithAxios(masterdataPart, masterdataFacility);
  }, [masterdataPart, masterdataFacility]);



  const handleSelectedChange = (value) => {
    setSourceSelected(value);
      // if (value.causeMenu === "기타(직접입력)") {
      //     // setCustomSource("");
      // }
      onFormDataChange(value);
    console.log(value);
  };


  return(
    <div id="danger" className="flex items-baseline justify-start">
        <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
          위험원인
        </span>
        <div className="flex flex-col">
        {/*<Listbox value={sourceSelected} onChange={setSourceSelected}>*/}
        <Listbox value={sourceSelected} onChange={handleSelectedChange}>
          {({ open }) => (
            <>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-32 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                  <span className="block truncate">{sourceSelected.causeMenu}</span>
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
                      {specialCauseList.map((specialCauseItem) => (
                      <Listbox.Option
                        key={specialCauseItem.causeId}
                        className={({ active }) =>
                          classNames(
                            active
                              ? "bg-seahColor text-white"
                              : "text-gray-900",
                            "relative cursor-default select-none py-2 pl-3 pr-9"
                          )
                        }
                        value={specialCauseItem}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "block truncate"
                              )}
                            >
                              {specialCauseItem.causeMenu}
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
        {sourceSelected && sourceSelected.causeMenu === "기타(직접입력)" && (
            <input
              type="text"
              value={customSource}
              name = "speCause"
              onChange={(e) => setCustomSource(e.target.value)}
              className="block w-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5 mt-1"
              placeholder="직접 입력"
            />
          )}
        </div>
      </div>
  )
}