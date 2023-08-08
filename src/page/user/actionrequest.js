import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { useParams } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ActionRquest({ onFormDataChange }) {
  // get 정보
  // const [peopleSelected, SetPeopleSelected] = useState(people[0]); //  실수함정
  // qr 정보따라 url 파라미터 세팅되어야됨
  const { masterdataPart } = useParams(); // url 영역 파라미터
  const { masterdataFacility } = useParams(); // url 설비 파라미터
  const [emailList, setEmailList] = useState([]);

  useEffect(() => {
    function emailFetchDataWithAxios(masterdataPart, masterdataFacility) {
      axios
        .get(
          `http://172.20.20.252:8081/special/new/${masterdataPart}/${masterdataFacility}`
          //`http://localhost:8081/special/new/${masterdataPart}/${masterdataFacility}`
        )
        .then((response) => {
          const emailListFromBack = response.data.emailList;

          const emailData = emailListFromBack.map((item) => {
            return {
              emailId: item.emailId,
              emailName: item.emailName,
              emailAdd: item.emailAdd,
              masterStatus: item.masterStatus,
            };
          });
          setEmailList(emailData);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    }
    emailFetchDataWithAxios(masterdataPart, masterdataFacility);
  }, [masterdataPart, masterdataFacility]);

  // 선택된 이메일 담을 변수
  const [selectedEmail, setSelectedEmail] = useState(null);

  // post 정보
  const handleActionChange = (selectedEmail) => {
    setSelectedEmail(selectedEmail);
    onFormDataChange({
      speActPerson: selectedEmail?.emailName || "", // 선택한 이메일이 있다면 이름 저장
      speActEmail: selectedEmail?.emailAdd || "", // 선택한 이메일이 있다면 이메일 저장
    });
  };

  const [instances, setInstances] = useState([{}]);


  // 인스턴스 추가 함수 : 이메일 추가
  const handleAddInstance = () => {
    setInstances([...instances, {}]);
  };
  const handleDeleteInstance = (index) => {
    setInstances(instances.filter((_, i) => i !== index));
  };


  return (
    <div
      id="ActionRequest"
      className="grid sm:flex items-baseline justify-start"
    >
      <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 my-4 ml-4 ">
        조치요청
      </span>
      <div className="">
        {/* 조치요청 */}
        {instances.map((instance, index) => (
          <div key={index} className="flex justify-between">
            {/*<Listbox value={selectedEmail} onChange={setSelectedEmail}>*/}
            <Listbox value={selectedEmail} onChange={handleActionChange}>
              {({ open }) => (
                <>
                  <div className="relative mt-2 ml-4">
                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-32 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6 ml-2">
                      <span className="block truncate">
                        {selectedEmail ? selectedEmail.emailName : "[선택]"}
                        {/* {peopleSelected.name} */}
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
                        {emailList.map((emailList) => (
                          <Listbox.Option
                            key={emailList.emailId}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "bg-seahColor text-white"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={emailList}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {emailList.emailName}
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

            <div className="mt-2 ml-1 flex">
              <input
                type="text"
                name="Inspectionarea"
                id="Inspectionarea"
                placeholder="E-Mail"
                autoComplete=""
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5 ml-1"
                value={selectedEmail ? selectedEmail.emailAdd : ""}
                readOnly
                onChange={(e) => {
                  setSelectedEmail({
                    ...selectedEmail,
                    emailAdd: e.target.value,
                  });
                }}
              />
              {index === 0 ? (
                <button
                  className="px-4 py-2 text-black border rounded-full hover:bg-seahColor hover:text-white ml-1"
                  onClick={handleAddInstance}
                >
                  +
                </button>
              ) : (
                <button
                  className="px-4 py-2 text-black border rounded-full hover:bg-seahColor hover:text-white ml-1"
                  onClick={() => handleDeleteInstance(index)}
                >
                  -
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
