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

  // qr 정보따라 url 파라미터 세팅되어야됨
  const { masterdataPart } = useParams(); // url 영역 파라미터
  const { masterdataFacility } = useParams(); // url 설비 파라미터
  const [emailDataList, setEmailDataList] = useState([]);
  // 선택된 이메일 담을 변수
  const [instances, setInstances] = useState([{ selectedEmail: null }]);
  // 넘길 이메일 데이터 : 선택 + 고정수신자----------------------------------
  // const [fullEmailData, setEmailData] = useState([{ selectedEmail: null }]);
// -----------------------------------



  // 백에서 데이터가져와서 뿌리기 : 해당 영역 + 고정수신자의 이메일정보
  useEffect(() => {
    function emailFetchDataWithAxios(masterdataPart, masterdataFacility) {
      axios
        .get(
          `http://172.20.20.252:8081/special/new/${masterdataPart}/${masterdataFacility}`   // 세아
          // `http://localhost:8081/special/new/${masterdataPart}/${masterdataFacility}`
          // `http://192.168.202.1:8081/special/new/${masterdataPart}/${masterdataFacility}`
        )
          .then((response) => {
            const emailListFromBack = response.data.emailList;
            const emailData = emailListFromBack.map((item) => ({
              emailId: item.emailId,
              emailName: item.emailName,
              emailAdd: item.emailAdd,
              masterStatus: item.masterStatus,
            }));
            setEmailDataList(emailData);

          })
          .catch((error) => {
            console.error("Error fetching data: ", error);
          });
    }
    emailFetchDataWithAxios(masterdataPart, masterdataFacility);
  }, [masterdataPart, masterdataFacility]);

  // 고정수신자 세팅--------------------------
  // const handleFixMailData = () => {
  //   console.log("확인용"+emailDataList.length);
  // }
// -----------------------------------
  const handleActionChange = (instanceIndex, selectedEmail) => {
    const updatedInstances = [...instances];
    updatedInstances[instanceIndex] = { selectedEmail };
    setInstances(updatedInstances);

    //  ,로 구분된 문자열로 변환하여 넘기기
    const updatedEmails = updatedInstances
        .map((instance) => instance.selectedEmail)
        .filter((email) => email !== null);

    const selectedEmailNames = updatedEmails.map((email) => email.emailName).join(", ");
    const selectedEmailAddresses = updatedEmails.map((email) => email.emailAdd).join(", ");

    onFormDataChange({
      speActPerson: selectedEmailNames,
      speActEmail: selectedEmailAddresses,
    });
  };


  // 이메일 정보 추가 : +버튼
  const handleAddInstance = () => {
    setInstances([...instances, {}]);
  };

  // 이메일 정보 삭제 : -버튼
  const handleDeleteInstance = (index) => {
    const updatedInstances = instances.filter((_, i) => i !== index);
    const updatedEmails = updatedInstances
        .map((instance) => instance.selectedEmail)
        .filter((email) => email !== null);

    const selectedEmailNames = updatedEmails.map((email) => email.emailName).join(", ");
    const selectedEmailAddresses = updatedEmails.map((email) => email.emailAdd).join(", ");

    setInstances(updatedInstances);

    // 다시 업데이트
    onFormDataChange({
      speActPerson: selectedEmailNames,
      speActEmail: selectedEmailAddresses,
    });
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
            <Listbox
                value={instance.selectedEmail || null}
                onChange={(selectedEmail) =>
                    handleActionChange(index, selectedEmail)
                }
            >
              {({ open }) => (
                <>
                  <div className="relative mt-2 ml-4">
                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-32 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6 ml-2">
                      <span className="block truncate">
                         {instance.selectedEmail ? instance.selectedEmail.emailName : "[선택]"}
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
                        {emailDataList.map((emailListItem) => (
                            <Listbox.Option
                                key={emailListItem.emailId}
                                disabled={emailListItem.masterStatus === 'Y'}
                                className={({active}) => classNames(active ? "bg-seahColor text-white" : emailListItem.masterStatus === 'Y' ? "bg-gray-200 " : "text-gray-900", "relative cursor-default select-none py-2 pl-3 pr-9")}
                                value={emailListItem}
                            >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {emailListItem.emailName}
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
                value={instance.selectedEmail ? instance.selectedEmail.emailAdd : ""}
                readOnly
                onChange={(e) => {
                  const updatedInstances = [...instances];
                  updatedInstances[index].selectedEmail = {
                    ...instance.selectedEmail,
                    emailAdd: e.target.value,
                  };
                  setInstances(updatedInstances);
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
