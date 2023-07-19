import { useState, Fragment, useCallback } from "react";
import Header from "../../components/Header";
// import { format, addMonths, subMonths } from "date-fns";
import { Listbox, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckIcon,
  ChevronUpDownIcon,
  PhotoIcon,
  CheckCircleIcon,
} from "@heroicons/react/20/solid";
import { useDropzone } from "react-dropzone";
import QRCode from "qrcode.react";
import axios from "axios";
const people = [
  {
    id: 1,
    name: "선택",
  },
  {
    id: 2,
    name: "CREW",
  },
  {
    id: 3,
    name: "DM",
  },
  {
    id: 4,
    name: "MANAGE",
  },
  {
    id: 5,
    name: "ETC",
  },
];

// 한글 값 매핑 함수
function mapEduCategoryName(category) {
  switch (category) {
    case "선택":
      return "[선택]";
    case "CREW":
      return "[크루미팅]";
    case "DM":
      return "[DM미팅]";
    case "MANAGE":
      return "[관리감독]";
    case "ETC":
      return "[기타]";
    default:
      return "";
  }
}

const duty = [
  {
    id: 1,
    name: "선택",
  },
  {
    id: 2,
    name: "T",
  },
  {
    id: 3,
    name: "O",
  },
  {
    id: 4,
    name: "F",
  },
];
// 한글 값 매핑 함수
function mapDutyName(duty) {
  switch (duty) {
    case "선택":
      return "[선택]";
    case "T":
      return "[전체]";
    case "O":
      return "[사무직]";
    case "F":
      return "[현장직]";
    default:
      return "";
  }
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MAX_FILENAME_LENGTH = 30;
const FILENAME_SUFFIX = "...";

const TruncatedFileName = ({ fileName }) => {
  if (fileName.length <= MAX_FILENAME_LENGTH) {
    return <div>{fileName}</div>;
  }

  const truncatedFileName = fileName.slice(
    0,
    MAX_FILENAME_LENGTH - FILENAME_SUFFIX.length
  );
  const displayedFileName = truncatedFileName + FILENAME_SUFFIX;

  return <div>{displayedFileName}</div>;
};

function SafetyEduReg() {
  const [selected, setSelected] = useState(people[0]);
  const [selectedDuty, setSelectedDuty] = useState(duty[0]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState(null);
  // const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    eduCategory: "", // 교육
    eduClass: "", // 교육분류
    eduInstructor: "", // 담당자
    eduPlace: "", // 교육장소,
    //교육시간
    eduStartTime: new Date(), // 시작시간
    eduEndTime: new Date(), // 끝나는 시간

    eduTarget: "", // 대상자
    eduContent: "", // 교육내용
    eduWriter: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }; // 값 넘기는 기능

  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");

  const handleStartTimeChange = (e) => {
    const newValue = e.target.value;
    setSelectedStartTime(newValue);
    setFormData((prevData) => ({
      ...prevData,

      eduStartTime: newValue, // 시작시간 필드 이름 변경
    }));
  };

  const handleEndTimeChange = (e) => {
    const newValue = e.target.value;
    setSelectedEndTime(newValue);
    setFormData((prevData) => ({
      ...prevData,
      eduEndTime: newValue, // 종료시간 필드 이름 변경
    }));
  };

  const handleCreate = () => {
    setIsCompleted(true); // 생성 완료 상태 업데이트
  }; // 큐알코드 생성시 생성완료 출력

  const onDrop = useCallback(
    (acceptedFiles) => {
      setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
      if (acceptedFiles.length > 0) {
        setFormData({
          ...formData,
          file: acceptedFiles[0], // Update the file property in the formData state
        });
      }
      alert(acceptedFiles);
      console.log(acceptedFiles);
    },
    [formData, uploadedFiles]
  ); // 파일 온드롭 기능

  const deleteFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  }; // 파일 삭제기능

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      file: file, // Update the file property in the formData state
    });
  };
  // 파일 업로드 핸들러
  // 파일 업로드 핸들러
const handleFileUpload = () => {
  if (!formData.file) {
    alert("Please select a file.");
    return;
  }

  const formDataWithFile = new FormData();

  // 파일 첨부 여부 확인
  if (formData.file) {
    formDataWithFile.append("file", formData.file);
  }

  // 나머지 필드 추가
  formDataWithFile.append("eduCategory", formData.eduCategory);
  formDataWithFile.append("eduClass", formData.eduClass);
  formDataWithFile.append("eduInstructor", formData.eduInstructor);
  formDataWithFile.append("eduPlace", formData.eduPlace);
  formDataWithFile.append("eduStartTime", formData.eduStartTime);
  formDataWithFile.append("eduEndTime", formData.eduEndTime);
  formDataWithFile.append("eduTarget", formData.eduTarget);
  formDataWithFile.append("eduContent", formData.eduContent);
  formDataWithFile.append("eduWriter", formData.eduWriter);

  axios
    .post("http://localhost:8081/edureg", formDataWithFile, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log("File uploaded successfully.", response);
    })
    .catch((error) => {
      console.error("Error uploading file.", error);
    });
};

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop }); // 온드롭기능

  // 데이트 피커
  const formatTimeRange = (startTime, endTime) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedStartTime = new Date(startTime).toLocaleString(
      "ko-KR",
      options
    );
    const formattedEndTime = new Date(endTime).toLocaleString("ko-KR", options);
    return `${formattedStartTime} ~ ${formattedEndTime}`;
  };
  // 큐알로 값 전달 기능
  const handleListboxChange = (selectedItem) => {
    setSelected(selectedItem);
    setFormData((prevData) => ({
      ...prevData,
      eduCategory: selectedItem.name, // 업데이트할 formData 속성에 맞게 수정
    }));
  };
  // 큐알로 값 전달기능
  const handleDutyChange = (value) => {
    setSelectedDuty(value);
    setFormData((prevData) => ({
      ...prevData,
      // 업데이트할 formData 속성에 맞게 수정
      eduTarget: value.name,
    }));
  };

  // 교육등록 핸들러
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.eduContent) {
      // eduContent 필드가 비어있을 경우 에러 처리
      setError("Edu Content is required.");
      return;
    }

    const formDataWithFile = new FormData();
    formDataWithFile.append("eduCategory", formData.eduCategory);
    formDataWithFile.append("eduClass", formData.eduClass);
    formDataWithFile.append("eduInstructor", formData.eduInstructor);
    formDataWithFile.append("eduPlace", formData.eduPlace);
    formDataWithFile.append("eduStartTime", formData.eduStartTime);
    formDataWithFile.append("eduEndTime", formData.eduEndTime);
    formDataWithFile.append("eduTarget", formData.eduTarget);
    formDataWithFile.append("eduContent", formData.eduContent);
    formDataWithFile.append("eduWriter", formData.eduWriter);
    formDataWithFile.append("file", formData.file); // 파일을 폼 데이터에 추가

    axios
      .post("http://localhost:8081/edureg", formDataWithFile, {
        // headers: {
        //   "Content-Type": "application/json",
        // },
      }) // 수정된 부분
      .then((response) => {
        console.log("저장내용:", formData);
        // 저장 성공 시 처리 로직 추가
        navigate("/edudetails"); // 저장 성공 후 화면 이동
        console.log(response);
      })
      .catch((error) => {
        console.log("에러저장내용:", error);

        // 저장 실패 시 처리 로직 추가
      });

      handleFileUpload()
  };

  // 큐알 스캔시 이동할 경로
  const eduUrl = "http://www.seahaerospace.com/kor/index.asp";

  return (
    <div>
      <Header />

      <div className="flex justify-center">
        <div
          id="safeEdureg"
          className="max-w-screen-lg w-full px-2 flex flex-col items-center mt-4  ring-1 ring-inset rounded-md ring-red-600/10"
        >
          <form
            className="w-full md:grid-cols-2"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <div id="sortation" className="flex items-baseline justify-start">
              <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
                구분
              </span>
              <Listbox value={selected} onChange={handleListboxChange}>
                {({ open }) => (
                  <>
                    <div className="relative mt-2">
                      <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-16 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                        <span className="flex items-center">
                          <span className="ml-3 block truncate">
                            {selected
                              ? mapEduCategoryName(selected.name)
                              : "선택"}
                          </span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
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
                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ">
                          {people.map((person) => (
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
                                  <div className="flex items-center">
                                    <span
                                      className={classNames(
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                        "ml-3 block truncate"
                                      )}
                                    >
                                      {mapEduCategoryName(person.name)}
                                    </span>
                                  </div>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active
                                          ? "text-white"
                                          : "text-indigo-600",
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
            <div
              id="Training_title"
              className="flex items-baseline justify-start"
            >
              <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
                분류
              </span>
              <div className="sm:col-span-3 w-56">
                <div className="mt-2">
                  <input
                    type="text"
                    name="eduClass"
                    id="eduClass"
                    value={formData.eduClass}
                    onChange={handleChange}
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
                  />
                </div>
              </div>
            </div>
            <div id="charge" className="flex items-baseline justify-start">
              <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
                강사
              </span>
              <div className="sm:col-span-3">
                <label
                  htmlFor="educharge"
                  className="block text-sm font-medium leading-6 text-gray-900"
                ></label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="eduInstructor"
                    id="educharge"
                    value={formData.eduInstructor}
                    onChange={handleChange}
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
                  />
                </div>
              </div>
            </div>
            <div id="eduPlace" className="flex items-baseline justify-start">
              <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
                교육장소
              </span>
              <div className="sm:col-span-3">
                <label
                  htmlFor="educharge"
                  className="block text-sm font-medium leading-6 text-gray-900"
                ></label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="eduPlace"
                    id="place"
                    value={formData.eduPlace}
                    onChange={handleChange}
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
                  />
                </div>
              </div>
            </div>
            {/* 교육시간은 세아측에서 결정 후 알려주기로 했음 아직 미정 */}
            <div
              id="Training_time"
              className="flex items-baseline justify-start"
            >
              <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
                교육시간
              </span>
              <div className="mt-2">
                <label
                  htmlFor="starttimepicker"
                  className="block mb-2 font-medium text-gray-700"
                >
                  시작시간
                </label>
                <input
                  type="datetime-local"
                  id="starttimepicker"
                  className="block w-56 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
                  value={selectedStartTime}
                  onChange={handleStartTimeChange}
                  min={new Date().toISOString().slice(0, 16)}
                />

                <label
                  htmlFor="endtimepicker"
                  className="block mt-4 mb-2 font-medium text-gray-700"
                >
                  종료시간
                </label>
                <input
                  type="datetime-local"
                  id="endtimepicker"
                  className="block w-56 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
                  value={selectedEndTime}
                  onChange={handleEndTimeChange}
                  min={selectedStartTime ? selectedStartTime.slice(0, 16) : ""}
                />

                {selectedStartTime && selectedEndTime && (
                  <p className="mt-2 text-gray-600 w-56">
                    교육일정:{" "}
                    {formatTimeRange(selectedStartTime, selectedEndTime)}
                  </p>
                )}
              </div>
            </div>
            <div
              id="Training_target"
              className="flex items-baseline justify-start"
            >
              <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
                교육대상
              </span>
              <Listbox value={selectedDuty} onChange={handleDutyChange}>
                {({ open }) => (
                  <>
                    <div className="relative mt-2">
                      <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-16 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                        <span className="flex items-center">
                          <span className="ml-3 block truncate">
                            {selectedDuty
                              ? mapDutyName(selectedDuty.name)
                              : "선택"}
                          </span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
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
                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {duty.map((dutyItem) => (
                            <Listbox.Option
                              key={dutyItem.id}
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? "bg-seahColor text-white"
                                    : "text-gray-900",
                                  "relative cursor-default select-none py-2 pl-3 pr-9"
                                )
                              }
                              value={dutyItem}
                            >
                              {({ selected, active }) => (
                                <>
                                  <div className="flex items-center">
                                    <span
                                      className={classNames(
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                        "ml-3 block truncate"
                                      )}
                                    >
                                      {mapDutyName(dutyItem.name)}
                                    </span>
                                  </div>

                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active
                                          ? "text-white"
                                          : "text-indigo-600",
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
            <div id="content" className="flex items-baseline justify-start">
              <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
                교육내용
              </span>

              <div className="mt-2 w-80">
                <textarea
                  id="about"
                  name="eduContent"
                  rows={3}
                  value={formData.eduContent}
                  onChange={handleChange}
                  className="block w-full h-16 rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
            </div>
            <div id="qr" className="flex items-baseline justify-start">
              <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
                QR생성
              </span>
              {isCompleted ? (
                <div className="mt-4">
                  <QRCode value={JSON.stringify(formData)} />
                  {/* <Link to={eduUrl}>
                    <QRCode value={eduUrl} />
                  </Link> */}
                  <div className="flex items-center mt-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="ml-1">생성완료</span>
                  </div>
                </div>
              ) : (
                <button
                  type="submit"
                  className="block w-30 rounded-md bg-seahColor px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={handleCreate}
                >
                  생성하기
                </button>
              )}
            </div>
            <div id="file" className="flex items-baseline justify-start ">
              <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
                파일첨부
              </span>

              <div id="fileuploader" className="flex flex-col items-center">
                <div
                  {...getRootProps()}
                  className={`dropzone ${
                    isDragActive ? "active" : ""
                  } col-span-full w-full md:w-96`}
                >
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon
                        className="mx-auto h-12 w-12 text-gray-300"
                        aria-hidden="true"
                      />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-seahColor focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-seahDeep"
                        >
                          <span>클릭하거나</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            {...getInputProps()}
                            className="sr-only"
                            type="file"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">
                          파일을 여기에 드롭하여 선택하세요
                        </p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">10MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  {uploadedFiles.map((file, index) => (
                    <div key={file.name} className="flex items-start mt-2">
                      <div className="text-left">
                        <TruncatedFileName fileName={file.name} />
                      </div>
                      <button
                        onClick={() => deleteFile(file.name)}
                        className="ml-2 text-red-600"
                        type="button"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div id="writer" className="flex items-baseline justify-start">
              <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
                작성자
              </span>
              <div className="sm:col-span-3">
                <label
                  htmlFor="educharge"
                  className="block text-sm font-medium leading-6 text-gray-900"
                ></label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="eduWriter"
                    id="eduwriter"
                    value={formData.eduWriter}
                    onChange={handleChange}
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 pr-3 pb-3 flex items-center justify-end gap-x-6 ">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                취소하기
              </button>
              <button
                type="submit"
                className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
              >
                저장하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SafetyEduReg;
