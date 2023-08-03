
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";


  // 위험분류
const danger = [
  { id: 1, name: "[선택]" },
  { id: 2, name: "[추락]" },
  { id: 3, name: "[협착]" },
  { id: 4, name: "[끼임]" },
  { id: 5, name: "[말림]" },
  { id: 6, name: "[전도]" },
  { id: 7, name: "[절단]" },
  { id: 8, name: "[베임]" },
  { id: 9, name: "[찔림]" },
  { id: 10, name: "[충돌]" },
  { id: 11, name: "[화상]" },
  { id: 12, name: "[화재폭발]" },
  { id: 13, name: "[근골격]" },
  { id: 14, name: "[지게차]" },
  { id: 15, name: "[크레인]" },
  { id: 16, name: "[누출]" },
  { id: 17, name: "[환경사고]" },
  { id: 18, name: "[기타]" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Danger({onFormDataChange}){

const [selected, setSelected] = useState(danger[0]); // 위험분류

const handleDangerChange = (selected) => {
  setSelected(selected);
  onFormDataChange(selected);
}

  return(
    <div id="danger" className="flex items-baseline justify-start">
        <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
          위험분류
        </span>
        {/*<Listbox value={selected} onChange={setSelected}>*/}
        <Listbox value={selected} onChange={handleDangerChange}>
          {({ open }) => (
            <>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-32 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
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
                    {danger.map((person) => (
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
  )
}