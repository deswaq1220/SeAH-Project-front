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
  const [isModalOpen, setIsModalOpen] = useState([]); // 각 행마다 모달 상태 저장
  const [isEditButtonVisible, setIsEditButtonVisible] = useState([]); // 각 행마다 수정 버튼 상태 저장
  const [regularcheckList, setRegularcheckList] = useState([]);
  const [files, setFiles] = useState([]);
  const formData = new FormData();

  const handleRadioChange = (index, method) => {
    if (method === "BAD") {
      isModalOpen[index] = true; // 불량을 선택한 행의 모달을 열기
    } else {
      isModalOpen[index] = false; // 그 외에는 모달 닫기
    }

    regularcheckList[index].regularCheck = method; // 해당 행의 상태 입력

    setIsModalOpen([...isModalOpen]); // 새로운 모달 상태 설정
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItemIndex(null); // 모달을 닫을 때 선택된 항목 인덱스 초기화
  };

  const [regularDTO, setRegularDTO] = useState({
    regularPerson: "", // 관찰자 이름
    regularEmail: "", //관찰자 이메일
    regularEmpNum: "", // 관찰자 사원번호
    regularPart: "", // 점검구역(주조, 압출 등)
    regularInsName: "중대재해예방 일반점검", //점검항목(중대재해, LOTO 등 )
    file: null,
  });

  // Inspector 항목 저장 : 관찰자(이름, 이메일, 사원번호)
  const handleInspectorDataChange = (inspectorForm) => {
    setRegularDTO((prevData) => ({
      ...prevData,
      regularPerson: inspectorForm.name, //
      regularEmail: inspectorForm.email,
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
      regularInsName: value.name, //
    }));
    console.log(value);
  };

  //bad 상태일때 점검자 이름, 이메일,내용 저장
  const handleActDataChange = (actForm) => {
    const updatedActPerson = actForm.regularActPerson;
    const updatedActEmail = actForm.regularActEmail;
    const updatedActContent = actForm.regularActContent;
    const updatedFile = actForm.files;
    const id = actForm.id;
    console.log(id);
    setRegularcheckList((prevChecklist) => {
      const updatedChecklist = [...prevChecklist];

      updatedChecklist[actForm.index].regularActPerson = updatedActPerson;
      updatedChecklist[actForm.index].regularActEmail = updatedActEmail;
      updatedChecklist[actForm.index].regularActContent = updatedActContent;

      return updatedChecklist;
    });

    setRegularDTO((prevData) => ({
      ...prevData,
      file: {
        ...prevData.file,
        [id]: updatedFile,
      },
    }));
  };

  //점검리스트 조회
  const handleSearchClick = async () => {
    try {
      const selectedPosition = regularNameList.indexOf(selectedArea);
      if (selectedPosition !== -1) {
        const newRegularNum = selectedPosition + 1;

        setRegularNum(newRegularNum);

        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/regularcheck`,
          {
            params: {
              regularNum: newRegularNum,
            },
          }
        );
        setRegularcheckList(response.data);
      }
    } catch (error) {
      console.error("점검리스트 조회 오류", error);
    }
  };

  const handleFormSubmit = async () => {
    regularDTO.regularDetailDTOList = JSON.stringify(regularcheckList);

    const response = await axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/user/regular/new`,

        regularDTO,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {

        if (formData !== null) {
          // 등록이 완료되었다는 알림 띄우기
          toast.success("등록이 완료되었습니다.", {
            position: "top-center",
            autoClose: 2000, // 알림이 3초 후에 자동으로 사라짐
            hideProgressBar: true,
          });

          // 저장성공시 리스트 페이지
          navigate(`/regular`);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("정기점검 등록에 실패했습니다. 다시 시도해주세요.");
      });
  };

  useEffect(() => {}, [checkList]);

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
            name: name,
          })
        );

        setRegularNameList(optionsArray);
        setSelectedArea(optionsArray[0]);
      } catch (error) {
        console.error("서버 요청 오류:", error);
      }
    }

    fetchOptions();
  }, []);

  return (
    <div className="flex flex-col ">
      <div id="ReformMeasures" className="flex items-center">
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
      <div className="flex items-center  ml-4">
        <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 mr-4 my-4 ">
          점검항목
        </span>
        <Listbox
          value={selectedArea}
          onChange={(value) => handleRegularInsNameChange(value)}
        >
          {({ open }) => (
            <>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                  <span className="block truncate">
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
        <button
          type="button"
          onClick={handleSearchClick}
          className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor ml-2 mt-2"
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
              정기점검 체크항목 리스트입니다.
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
                >확인결과</th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >

                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {regularcheckList.map((item, index) => (
                <tr key={index}>
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                    {index + 1}
                    <dl className="font-normal lg:hidden">
                      <dt className="sr-only">Title</dt>
                      <dd className="mt-1 truncate text-gray-700">{item.checklist}</dd>
                      <dt className="sr-only sm:hidden">Email</dt>
                      <dd className="mt-1 truncate text-gray-500 sm:hidden">
                        <div className="space-x-4 flex">
                          {notificationMethods.map((notificationMethod) => (
                            <div
                              key={notificationMethod.id}
                              className="flex items-center"
                            >
                              <input
                                type="radio"
                                name={`radio-group-${index}`}
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
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                    {item.checklist}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                    <div className="space-x-4 flex">
                      {notificationMethods.map((notificationMethod) => (
                        <div
                          key={notificationMethod.id}
                          className="flex items-center"
                        >
                          <input
                            type="radio"
                            name={`radio-group-${index}`}
                            value={item.id}
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
                    {item.regularCheck === "BAD" ? (
                      <FaultyModal
                        actForm={handleActDataChange}
                        index={index}
                        id={item.id}
                      />
                    ) : null}
                  </td>

                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">

                  </td>
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