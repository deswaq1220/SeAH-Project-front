import React, { Fragment, useState, useEffect } from "react";
import FaultyModal from "./FaultyModal";
import InspectionItem from "./InspectionItem";
import InspectionArea from "./InspectionArea";
import axios from "axios";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Inspector from "./Inspector";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "../../../style/reset.css";

const notificationMethods = [
  { id: "GOOD", title: "양호", color: "text-blue-600" },
  { id: "BAD", title: "불량", color: "text-red-600" },
  { id: "NA", title: "N/A", color: "text-gray-900" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UserRegularTable() {
  const navigate = useNavigate();
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null); // 양호,불량,NA선택 저장
  const [regularNameList, setRegularNameList] = useState([]); //정기점검 항목
  const [checkList, setCheckList] = useState([]); //정기점검 항목
  const [selectedArea, setSelectedArea] = useState(null);
  const [regularNum, setRegularNum] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // 각 행마다 모달 상태 저장
  const [isEditButtonVisible, setIsEditButtonVisible] = useState([]); // 각 행마다 수정 버튼 상태 저장
  const [regularcheckList, setRegularcheckList] = useState([]);
  const [files, setFiles] = useState([]);
  const formData = new FormData();
  const [staticEmailPerson, setStaticEmailPerson] = useState([]); //고정수신자
  const [isInspectionAreaSelected, setIsInspectionAreaSelected] =
    useState(false); //"점검항목"이 선택되었는지 여부를 추적
  const [uncheckedItemIndexes, setUncheckedItemIndexes] = useState([]); // 체크되지 않은 항목의 인덱스를 기록하는 상태 변수

  const handleRadioChange = (index, method) => {
    console.log(regularcheckList[index]);
    regularcheckList[index].regularCheck = method; // 해당 행의 상태 입력
    if (method === "BAD") {
      handleChecklistClick(index);
    }
    // 체크 해제된 경우 해당 인덱스를 제거하고, 체크되지 않은 경우 해당 인덱스를 추가합니다.
    if (method === null && uncheckedItemIndexes.includes(index)) {
      setUncheckedItemIndexes((prevIndexes) =>
        prevIndexes.filter((itemIndex) => itemIndex !== index)
      );
    } else if (method !== null && !uncheckedItemIndexes.includes(index)) {
      setUncheckedItemIndexes((prevIndexes) => [...prevIndexes, index]);
    }
  };

  const [regularDTO, setRegularDTO] = useState({
    regularPerson: "", // 관찰자 이름
    regularEmail: "", //관찰자 이메일
    regularEmpNum: "", // 관찰자 사원번호
    regularPart: "", // 점검구역(주조, 압출 등)
    regularInsName: "중대재해예방 일반점검", //점검항목(중대재해, LOTO 등 )
    file: null,
  });

  const emailTitle = `${regularDTO.regularPerson}님의 정기점검 요청메일입니다`;

  // 세아도메인
  const [seahDomain, setSeahDomain] = useState("@seah.co.kr");

  // Inspector 항목 저장 : 관찰자(이름, 이메일, 사원번호)
  const handleInspectorDataChange = (inspectorForm) => {
    setRegularDTO((prevData) => ({
      ...prevData,
      regularPerson: inspectorForm.name, //
      regularEmail: inspectorForm.email !== null && inspectorForm.email !== "" ?
          inspectorForm.email + seahDomain : inspectorForm.email,
      regularEmpNum: inspectorForm.employeenumber,
    }));
  };

  const handleRegularPartDataChange = (form) => {
    setRegularDTO((prevData) => ({
      ...prevData,
      regularPart: form.regularPart,
    }));
  };

  //점검항목 저장
  const handleRegularInsNameChange = (value) => {
    setSelectedArea(value);
    setRegularDTO((prevData) => ({
      ...prevData,
      regularInsName: value.name,
    }));
    console.log(value);

    // 점검항목이 변경되면 라디오 버튼 상태를 초기화
    setRegularcheckList((prevChecklist) =>
      prevChecklist.map((item) => ({ ...item, regularCheck: null }))
    );
    setIsInspectionAreaSelected(true); // 유효한 옵션을 선택했을 때 true로 설정
  };

  function handleChecklistClick(index) {
    setIsModalOpen(true);
    regularcheckList[index].isModalState = "open";
  }

  const handleActDataChange = (actForm) => {
    console.log(regularcheckList[actForm.index]);

    const updatedActPerson = actForm.regularActPerson;
    const updatedActEmail = actForm.regularActEmail;
    const updatedActContent = actForm.regularActContent;
    const updatedFile = actForm.files;
    const id = actForm.id;

    regularcheckList[actForm.index].isModalState = "close";
    setIsModalOpen(false);
    console.log(regularcheckList[actForm.index].isModalState);
    setRegularcheckList((prevChecklist) => {
      const updatedChecklist = [...prevChecklist]; // Copy the previous checklist
      // Update the specific object in the checklist
      updatedChecklist[actForm.index].regularActPerson = updatedActPerson;
      updatedChecklist[actForm.index].regularActEmail = updatedActEmail;
      updatedChecklist[actForm.index].regularActContent = updatedActContent;
      updatedChecklist[actForm.index].files = updatedFile;

      return updatedChecklist; // Return the new checklist to update the state
    });

    setRegularDTO((prevData) => ({
      ...prevData,
      file: {
        ...prevData.file,
        [id]: updatedFile, // '1' is the key and 'updatedFile' should be an array of File or Blob objects.
      },
    }));
    const staticEmailPerson = actForm.staticEmailPerson; //고정수신자
    setStaticEmailPerson(staticEmailPerson);
  };

  //점검리스트 조회
  const handleSearchClick = async () => {
    try {
      const selectedPosition = regularNameList.indexOf(selectedArea);
      if (selectedPosition !== -1) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/regularcheck`,
          {
            params: {
              regularNum: selectedPosition,
            },
          }
        );

        setRegularcheckList(response.data);
        console.log("초기화 된다..");
        console.log(response.data);
      }
    } catch (error) {
      console.error("점검리스트 조회 오류", error);
    }
  };

  const handleFormSubmit = async () => {
    // "점검항목"이 선택되었는지 확인
    if (!isInspectionAreaSelected) {
      toast.error("점검항목을 선택해주세요.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    // 이메일 필드가 비어있는지 확인
    if (!regularDTO.regularEmail) {
      toast.error("이메일을 입력해주세요.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }
    // 저장 버튼 클릭 시, 라디오 버튼이 선택되었는지 확인
    const radioButtonsNotSelected = regularcheckList.some(
      (item) => !item.regularCheck
    );

    // 라디오 버튼이 선택되지 않은 경우, 알림 띄우기
    // 선택되지 않은 항목의 인덱스를 찾음
    const uncheckedItemIndexes = regularcheckList
      .map((item, index) => (item.regularCheck === null ? index : -1))
      .filter((index) => index !== -1);

    // 만약 선택되지 않은 라디오 버튼이 있다면, 알림을 표시
    if (uncheckedItemIndexes.length > 0) {
      // 선택되지 않은 항목의 인덱스를 문자열로 변환하여
      // 쉼표로 구분하여 표시
      const uncheckedItemsText = uncheckedItemIndexes
        .map((index) => `${index + 1}`)
        .join(", ");
      toast.error(`항목 ${uncheckedItemsText}을(를) 체크해주세요.`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }

    if (!regularDTO.regularPart || !regularDTO.regularPerson || !selectedArea) {
      toast.error("모든 필수 항목을 선택 또는 입력해주세요.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }
    try {
      const updatedRegularcheckList = regularcheckList.map((regularcheck) => {
        const { files, isModalState, ...rest } = regularcheck;
        return rest;
      });

      regularDTO.regularDetailRegDTOList = JSON.stringify(
        updatedRegularcheckList
      );

      console.log("regularDTO", regularDTO);

      // axios.post 실행
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/user/regular/new`,
        regularDTO,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      if (formData !== null) {
        // 등록이 완료되었다는 알림 띄우기
        toast.success("등록이 완료되었습니다.", {
          position: "top-center",
          autoClose: 2000, // 알림이 3초 후에 자동으로 사라짐
          hideProgressBar: true,
        });

        // 이메일 발송기능
        for (const item of regularcheckList) {
          if (item.regularActEmail) {
            // 이메일이 기재되어 있다면 실행

            const registerDate = new Date(response.data.regularDate);
            const options = {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
              hour12: true,
            };

            const formattedRegisterDate = registerDate.toLocaleDateString(
              "ko-KR",
              options
            );
            const id = item.id; // 아이템의 ID 가져오기
            const itemContent = regularcheckList.find(
              (checkItem) => checkItem.id === id
            );
            const itemChecklist = itemContent.checklist;
            // console.log(
            //   "itemContent==============" + formattedRegisterDate,
            //   regularDTO.regularPerson,
            //   item.regularActPerson,
            //   regularDTO.regularPart,
            //   regularDTO.regularInsName,
            //   itemChecklist,
            //   itemContent.regularActContent
            // );
            // console.log(staticEmailPerson);
            /*/★!*!/!*!/!*고정수신자 생기면 넣기*!/!*!/!*!/*/
            const spendForm = `
                                          <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc;">
                                          <tr>
                                            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">항목</td>
                                            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>내용</strong></td>
                                          </tr>
                                          <tr>
                                            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검일시</td>
                                            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${formattedRegisterDate}</strong></td>
                                          </tr>
                                          <tr>
                                            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검자</td>
                                            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${regularDTO.regularPerson}</strong></td>
                                          </tr>
                                          <tr>
                                            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">조치자</td>
                                            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${item.regularActPerson}</strong></td>
                                          </tr>
                                          <tr>
                                            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검구역</td>
                                            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${regularDTO.regularPart}</strong></td>
                                          </tr>
                                          <tr>
                                            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검항목</td>
                                            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${regularDTO.regularInsName}</strong></td>
                                          </tr>
                                          <tr>
                                            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">점검 유해위험요인</td>
                                            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${itemChecklist}</strong></td>
                                          </tr>
                                          <tr>
                                            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;">개선대책</td>
                                            <td style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"><strong>${item.regularActContent}</strong></td>
                                          </tr>
                                          </table>
                                            <p style="font-size:16px;">링크 : <a href="http://172.20.10.13:3000/regulardetails/${response.data.regularId}">상세보기</a></p>
                                            <p style="font-size:16px;">해당 메일은 발신전용 메일입니다. </p>
                                            `; /*★이거 정기점검항목의 상세목록-항목별 목록생기면 해당하는 주소로 바꿔야함 */

            const actPersonEmails = item.regularActEmail
              .split(",")
              .map((email) => email.trim());
            const finalEmailList = [...actPersonEmails, ...staticEmailPerson];
            const uniqueRecipientsSet = new Set(finalEmailList); //이메일 중복제거
            const uniqueRecipientsArray = Array.from(uniqueRecipientsSet); // Set을 다시 배열로 변환

            const emailData = {
              recipients: uniqueRecipientsArray,
              subject: emailTitle,
              content: spendForm,
            };
            console.log(
              "emailData===============" + JSON.stringify(emailData, null, 2)
            );

            axios
              .post(
                `${process.env.REACT_APP_API_BASE_URL}/api/send-email`,
                emailData
              )
              .then((response) => {
                console.log("이메일 전송 완료:", response);
              })
              .catch((error) => {
                console.error("이메일 전송 오류: ", error);
              });
          } // 반복 끝*/
        }

        // 저장성공시 리스트 페이지
        navigate(`/regular`);
      }
    } catch (error) {
      console.error(error);
      toast.error("정기점검 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/regularname`
        );

        // 문자열 배열을 객체로 변환하여 새로운 배열 생성
        const optionsArray = response.data.regularNameList.map(
          (name, index) => ({
            id: index + 1,
            name: name === "전체" ? "선택" : name,
          })
        );

        setRegularNameList(optionsArray);
        setSelectedArea(optionsArray[0]);
        // console.log(response.data);

        // 여기서 regularcheckList를 초기화합니다.
        setRegularcheckList([]); //
      } catch (error) {
        console.error("서버 요청 오류:", error);
      }
    }

    fetchOptions();
  }, []);

  return (
    <div className="flex flex-col ">
      <div id="ReformMeasures" className="flex items-center flex-wrap">
        <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
          점검구역
        </span>
        <InspectionArea
          handleInspectionAreaChange={handleRegularPartDataChange}
        />
      </div>
      <div id="ReformMeasures" className="flex items-center flex-wrap">
        <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4">
          점검자
        </span>
        <Inspector onFormDataChange={handleInspectorDataChange} />
      </div>
      <div className="flex items-center ml-4 flex-wrap">
        <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 mr-6 my-4 ">
          점검항목
        </span>
        <div>
          <Listbox
            value={selectedArea}
            onChange={(value) => handleRegularInsNameChange(value)}
          >
            {({ open }) => (
              <>
                <div className="relative mt-2">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-36 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                    <span className="block">
                      {selectedArea ? selectedArea.name : "선택"}
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
                      {regularNameList.map((regularName) => (
                        <Listbox.Option
                          key={regularName.id}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "bg-seahColor text-white"
                                : "text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                          value={regularName}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {regularName.name}
                                {/*{regularName.name === "전체" ? "선택" : regularName.name}*/}
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
        <button
          type="button"
          onClick={handleSearchClick}
          className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor ml-2 mt-2 w-auto"
        >
          조회하기
        </button>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 mt-4">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              정기점검
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              점검항목 체크리스트입니다.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none"></div>
        </div>
        <div className="-mx-4 mt-8 sm:-mx-0">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  번호
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  유해위험요인 확인
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  확인결과
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                ></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {regularcheckList.map((item, index) => (
                <tr key={index}>
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                    {index + 1}
                    <dl className="font-normal lg:hidden">
                      <dt className="sr-only">Title</dt>
                      <dd
                        className="mt-1 text-gray-700"
                        onClick={() => handleChecklistClick(index)}
                        dangerouslySetInnerHTML={{
                          __html: item.checklist.replace(
                            /퀜/g,
                            '<span class="special-font">퀜</span>'
                          ),
                        }}
                      ></dd>
                      <dt className="sr-only sm:hidden">Email</dt>
                      <dd className="mt-1  text-gray-500 sm:hidden">
                        <div className="space-x-4 flex">
                          {notificationMethods.map((notificationMethod) => (
                            <div
                              key={notificationMethod.id}
                              className="flex items-center"
                            >
                              <input
                                type="radio"
                                name={`radio-group-${index}-1`}
                                value={item.id}
                                onChange={() =>
                                  handleRadioChange(
                                    index,
                                    notificationMethod.id
                                  )
                                }
                                className="h-4 w-4 border-gray-300 text-seahColor focus:ring-seahColor"
                              />
                              <label
                                htmlFor={notificationMethod.id}
                                className={`ml-3 block text-sm font-bold leading-6 ${notificationMethod.color}`}
                              >
                                {notificationMethod.title}
                              </label>
                            </div>
                          ))}
                        </div>
                      </dd>
                    </dl>
                  </td>
                  <td
                    className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell"
                    onClick={() => handleChecklistClick(index)}
                    dangerouslySetInnerHTML={{
                      __html: item.checklist.replace(
                        /퀜/g,
                        '<span class="special-font">퀜</span>'
                      ),
                    }}
                  ></td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                    <div className="space-x-4 flex">
                      {notificationMethods.map((notificationMethod) => (
                        <div
                          key={notificationMethod.id}
                          className="flex items-center"
                        >
                          <input
                            type="radio"
                            name={`radio-group-${index}-1`}
                            value={notificationMethod.id}
                            onChange={() =>
                              handleRadioChange(index, notificationMethod.id)
                            }
                            className="h-4 w-4 border-gray-300 text-seahColor focus:ring-seahColor"
                          />
                          <label
                            htmlFor={notificationMethod.id}
                            className={`ml-3 block text-sm font-bold leading-6 ${notificationMethod.color}`}
                          >
                            {notificationMethod.title}
                          </label>
                        </div>
                      ))}
                    </div>
                    {item.isModalState === "open" ? (
                      <FaultyModal
                        actForm={handleActDataChange}
                        fetchData={item}
                        index={index}
                      />
                    ) : null}
                  </td>

                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor "
            onClick={handleFormSubmit}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
