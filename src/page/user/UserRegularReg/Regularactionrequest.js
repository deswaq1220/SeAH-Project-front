import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { useParams } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Regularactionrequest({ onFormDataChange,fetchEmail }) {
  const { masterdataPart, masterdataId } = useParams();
  const [emailDataList, setEmailDataList] = useState([]);
  const [instances, setInstances] = useState([{ selectedEmail: null }]);

  useEffect(() => {
    async function emailFetchDataWithAxios() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/regularemail`
        );

        const emailListFromBack = response.data["emailList"];
        if(fetchEmail===null){
            setEmailDataList(fetchEmail);
        }else{
            setEmailDataList(emailListFromBack);
        }

      } catch (error) {
        console.error("데이터 가져오기 오류: ", error);
      }
    }
    emailFetchDataWithAxios();
  }, [masterdataPart, masterdataId]);

  // -----------------------------------
  const handleActionChange = (instanceIndex, selectedEmail) => {
    const updatedInstances = [...instances];
    updatedInstances[instanceIndex] = { selectedEmail };
    setInstances(updatedInstances);

    // ,로 구분된 문자열로 변환하여 넘기기
    const updatedEmails = updatedInstances
      .map((instance) => instance.selectedEmail)
      .filter((email) => email !== null);

    const selectedEmailNames = updatedEmails
      .map((email) => email.emailName)
      .join(", ");
    const selectedEmailAddresses = updatedEmails
      .map((email) => email.emailAdd)
      .join(", ");

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

    const selectedEmailNames = updatedEmails
      .map((email) => email.emailName)
      .join(", ");
    const selectedEmailAddresses = updatedEmails
      .map((email) => email.emailAdd)
      .join(", ");

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
                  <div className="relative mt-2">
                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-16 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                      <span className="block truncate">
                        {instance.selectedEmail
                          ? instance.selectedEmail.emailName
                          : "[선택]"}
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
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "bg-seahColor text-white"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
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
            {/* <button
              className="px-4 py-2 text-black border rounded-full hover:bg-seahColor hover:text-white ml-1"
              onClick={() => sendEmail(instance.selectedEmail)}
            >
              전송
            </button> */}

            <div className="mt-2 ml-1 flex items-center">
              <input
                type="text"
                name="Inspectionarea"
                id="Inspectionarea"
                placeholder="E-Mail"
                autoComplete=""
                className="block w-full rounded-md border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5 "
                value={
                  instance.selectedEmail ? instance.selectedEmail.emailAdd : ""
                }
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
