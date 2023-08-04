import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

// 부상부위
const injured = [
  { id: 1, name: "[신체]" },
  { id: 2, name: "[머리]" },
  { id: 3, name: "[팔]" },
  { id: 4, name: "[다리]" },
  { id: 5, name: "[가슴]" },
  { id: 6, name: "[등,허리]" },
  { id: 7, name: "[안면]" },
  { id: 8, name: "[기타(직접입력)]" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Injured({onFormDataChange}) {
  const [injuredSelected, setInjuredSelected] = useState(injured[0]); //  부상부위
  const [customInjured, setCustomInjured] = useState("");
    const [formData, setFormData] = useState({
        speActContent: "",
        speActEmail: "",
        speActPerson: "",
        speCause: "",
        speContent:"",
        speDanger:"",
        speEmail:"",
        speEmpNum:"",
        speInjure: "",
        spePerson:"",
        speRiskAssess:"",
        speTrap:"",
    });

    const handleFormDataChange = (updatedData) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            ...updatedData,
        }));
    };

    const handleCustomInjuredChange = (e) => {
        const value = e.target.value;
        setCustomInjured(value);
        if (injuredSelected.name === "[기타(직접입력)]") {
            // 선택된 옵션이 "[기타(직접입력)]"인 경우, 부모 컴포넌트의 상태를 업데이트합니다.
            onFormDataChange({ speInjure: value });
        }
    };

  return (
    <div id="injured" className="flex items-baseline justify-start">
      <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
        부상부위
      </span>
      <div className="flex flex-col">
        {/* 부상부위 */}
        {/*<Listbox value={injuredSelected} onChange={setInjuredSelected}>*/}
        <Listbox value={injuredSelected} onFormDataChange={handleFormDataChange}>
          {({ open }) => (
            <>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-32 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                  <span className="block truncate">{injuredSelected.name}</span>
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
                    {injured.map((person) => (
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
        {/* Custom Input */}
        {injuredSelected.name === "[기타(직접입력)]" && (
          <input
              type="text"
              value={customInjured}
              name="speInjure"
              onChange={handleCustomInjuredChange}
              className="block w-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5 mt-1"
              placeholder="직접 입력"
          />
        )}
      </div>
    </div>
  );
}
