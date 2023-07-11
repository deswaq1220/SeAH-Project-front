import { useState, Fragment, useCallback } from "react";
import Header from "../components/Header";
// import { format, addMonths, subMonths } from "date-fns";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  PhotoIcon,
  CheckCircleIcon,
} from "@heroicons/react/20/solid";
import { useDropzone } from "react-dropzone";
import QRCode from "qrcode.react";
const people = [
  {
    id: 1,
    name: "[집체교육]",
  },
  {
    id: 2,
    name: "[조회]",
  },
  {
    id: 3,
    name: "[임시]",
  },
  {
    id: 4,
    name: "[임시]",
  },
  {
    id: 5,
    name: "[임시]",
  },
  {
    id: 6,
    name: "[임시]",
  },
  {
    id: 7,
    name: "[임시]",
  },
  {
    id: 8,
    name: "[임시]",
  },
  {
    id: 9,
    name: "[임시]",
  },
  {
    id: 10,
    name: "[임시]",
  },
];

const duty = [
  {
    id: 1,
    name: "사무직",
  },
  {
    id: 2,
    name: "현장직",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SafetyEduReg() {
  const [selected, setSelected] = useState(people[0]);
  const [selectedDuty, setSelectedDuty] = useState(duty[0]);
  // const [currentDate, setCurrentDate] = useState(new Date());
  const [isCompleted, setIsCompleted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    sortation: "",
    edutitle: "",
    charge: "",
    trainingTime: {
      startTime: "",
      endTime: "",
    },
    trainingTarget: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");

  const handleStartTimeChange = (e) => {
    setSelectedStartTime(e.target.value);
    setSelectedEndTime("");
  };

  const handleEndTimeChange = (e) => {
    setSelectedEndTime(e.target.value);
  };

  const handleCreate = () => {
    setIsCompleted(true); // 생성 완료 상태 업데이트
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
      console.log(acceptedFiles);
    },
    [uploadedFiles]
  );

  const deleteFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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

  return (
    <div>
      <Header />

      <div className="flex justify-center">
        <div
          id="safeEduDetail"
          className="max-w-screen-lg w-full px-2 flex flex-col items-center mt-4  ring-1 ring-inset rounded-md ring-red-600/10"
        >
          <form className="w-full md:grid-cols-2">
            <div id="sortation" className="flex items-baseline justify-start">
              <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
                구분
              </span>
              <Listbox value={selected} onChange={setSelected}>
                {({ open }) => (
                  <>
                    <div className="relative mt-2">
                      <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-16 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                        <span className="flex items-center">
                          <span className="ml-3 block truncate">
                            {selected.name}
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
                                      {person.name}
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
            <div id="Training_title" className="flex items-baseline justify-start">
              <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
                교육제목
              </span>
              <div className="sm:col-span-3 w-56">
                <div className="mt-2">
                  <input
                    type="text"
                    name="edutitle"
                    id="edutitle"
                    value={formData.edutitle}
                    onChange={handleChange}
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
                  />
                </div>
              </div>
            </div>
            <div id="charge" className="flex items-baseline justify-start">
              <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
                담당자
              </span>
              <div className="sm:col-span-3">
                <label
                  htmlFor="educharge"
                  className="block text-sm font-medium leading-6 text-gray-900"
                ></label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="charge"
                    id="educharge"
                    value={formData.charge}
                    onChange={handleChange}
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
                  />
                </div>
              </div>
            </div>
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
                  끝나는 시간
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
              <Listbox value={selectedDuty} onChange={setSelectedDuty}>
                {({ open }) => (
                  <>
                    <div className="relative mt-2">
                      <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-16 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                        <span className="flex items-center">
                          <span className="ml-3 block truncate">
                            {selectedDuty.name}
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
                                      {dutyItem.name}
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
                  name="content"
                  rows={3}
                  value={formData.conte}
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
                          />
                        </label>
                        <p className="pl-1">
                          파일을 여기에 드롭하여 선택하세요
                        </p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">10MB</p>
                      {/* 파일첨부 삭제시 밑에서부터는 하나씩 삭제 가능하나 맨 처음 첨부한 파일 삭제시 첨부한 파일들 전체가 삭제되는 오류있음 */}
                    </div>
                  </div>
                </div>

                <div>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-centern mt-2">
                      <div>{file.name}</div>
                      <button
                        onClick={() => deleteFile(index)}
                        className="ml-2 text-red-600"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
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
