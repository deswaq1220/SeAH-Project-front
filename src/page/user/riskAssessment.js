import {Fragment, useEffect, useState} from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {id} from "date-fns/locale";

//위험성 평가
const riskAssessment = [
  { id: 1, name: "[선택]", value: "" },
  { id: 2, name: "[고 위험(6~9): 즉시개선]", value: "HIGH"},
  { id: 3, name: "[중 위험(3~4): 개선필요]", value: "MEDIUM"},
  { id: 4, name: "[저 위험(1~2): 수용가능]", value: "LOW" },
];


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function RiskAssessment({onFormDataChange, defaultState, complete, updateSpeId}) {
  const [riskAssessmentSelected, setRiskAssessmentSelected] = useState(riskAssessment[0]); //  위험성평가
  const handleRiskAssessmentChange = (riskAssessmentSelected) => {
    setRiskAssessmentSelected(riskAssessmentSelected);
    onFormDataChange(riskAssessmentSelected.value);
  };

  // 수정/완료등록시 세팅
  useEffect(() => {
    console.log("test"+ defaultState);
    console.log(defaultState);
    if (defaultState) {
      const defaultRisk = riskAssessment.find((item) => item.value === defaultState);
      setRiskAssessmentSelected(defaultRisk);
    }
  }, [defaultState]);

  return(
    <div id="riskAssessment" className="flex items-baseline justify-start">
        <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
          위험성평가
        </span>
        <Listbox value={riskAssessmentSelected} onChange={handleRiskAssessmentChange}>
          {({ open }) => (
            <>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-60 cursor-default rounded-md bg-white py-1.5 pl-3 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                  <span className="block truncate">
                    {riskAssessmentSelected.name}
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
                    {riskAssessment.map((person) => (
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
                        onChange={handleRiskAssessmentChange}
                        disabled={updateSpeId || complete}
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
  )
}