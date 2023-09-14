import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios"; // axios를 임포트]
import { toast } from "react-toastify";
const Status = [
  { id: 1, name: "선택" },
  { id: 2, name: "Y" },
  { id: 3, name: "N" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FacilityInfo({ fetchData, handleNewData }) {
  const [selectedArea, setSelectedArea] = useState(null);
  const [status, setStatus] = useState(Status[0]);
  const [facilityName, setFacilityName] = useState(""); // 설비명 관련 상태 추가
  const [qrValue, setQRValue] = useState(""); // QR 코드 데이터
  const [specialPartList, setSpecialPartList] = useState([]); // 설비영역

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // QR 코드 생성 버튼 클릭 시 호출되는 함수
  const generateQRCode = () => {
    const combinedValue = `${facilityName} - ${selectedArea.name}`; // 설비명과 영역을 합친 문자열 생성
    setQRValue(combinedValue); // 합친 문자열을 QR 코드 데이터로 설정
  };

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/admin/master/partdropdown`
        );

        // 문자열 배열을 객체로 변환하여 새로운 배열 생성
        const optionsArray = response.data.specialPartList.map(
          (name, index) => ({
            id: index + 1,
            name: name,
          })
        );

        setSpecialPartList(optionsArray);
        setSelectedArea(optionsArray[0]);
        console.log(response.data);
      } catch (error) {
        console.error("서버 요청 오류:", error);
      }
    }

    fetchOptions();
  }, []);

  const handleSubmit = async () => {
    const requiredFields = [
      { value: selectedArea?.name, name: "영역" },
      { value: name, name: "성명" },
      { value: email, name: "이메일" },
      { value: status?.name, name: "수신여부" },
    ];

    for (let field of requiredFields) {
      if (!field.value || field.value.trim() === "") {
        toast.warn(`${field.name} 항목이 작성되지 않았습니다.`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          style: {
            marginTop: "5rem", // 원하는 세로 위치로 조정
          },
        });
        return;
      }
    }

    if (selectedArea?.name === "선택" || status?.name === "선택") {
      toast.warn(`올바른 영역 또는 수신여부를 선택해주세요.`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        style: {
          marginTop: "5rem", // 원하는 세로 위치로 조정
        },
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/admin/master/email`,
        {
          emailPart: selectedArea.name,
          emailName: name, // 상태로 관리된 이름 값
          emailAdd: email, // 상태로 관리된 이메일 주소 값
          masterStatus: status.name,
        }
      );

      fetchData();
      // Add this line to update FacilityTable's state directly
      handleNewData(response.data);
      toast.success("이메일 등록이 정상적으로 완료되었습니다.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: {
          marginTop: "5rem", // 원하는 세로 위치로 조정
        },
      });
      // API 호출이 성공한 경우에 대한 처리
      console.log("등록 성공:", response.data);
    } catch (error) {
      // console.error("등록 오류:", error);
      toast.error("이메일 등록에 실패하였습니다. 다시 시도해주세요.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        style: {
          marginTop: "5rem", // 원하는 세로 위치로 조정
        },
      });
    }
  };

  function ReceiptStatus(Status) {
    switch (Status) {
      case "선택":
        return "[선택]";
      case "Y":
        return "[고정수신]";
      case "N":
        return "[선택수신]";
      default:
        return "";
    }
  }

  return (
    <div className="px-8 relative z-20">
      <span className=" w-22 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 my-4">
        이메일등록
      </span>
      <div id="charge" className="flex  items-baseline justify-start">
        <div className="flex flex-col">
          <Listbox value={selectedArea} onChange={setSelectedArea}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                  영역
                </Listbox.Label>
                <div className="relative mt-2">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-28 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
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
                      {specialPartList.map((option) => (
                        <Listbox.Option
                          key={option}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "bg-seahColor text-white"
                                : "text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                          value={option}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                [{option.name}]
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

        <div className="sm:col-span-3 ml-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            성명
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="김세아"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="family-name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
            />
          </div>
        </div>
        <div className="sm:col-span-3 ml-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            E-mail
          </label>
          <div className="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seah@test.com"
              autoComplete="family-name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
            />
          </div>
        </div>

        <div className="flex flex-col ml-2">
          <div className="flex flex-col ml-2">
            <Listbox value={status} onChange={setStatus}>
              {({ open }) => (
                <>
                  <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                    수신여부
                  </Listbox.Label>
                  <div className="relative mt-2">
                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-28 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                      <span className="block truncate">
                        {ReceiptStatus(status.name)}
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
                        {Status.map((person) => (
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
                                  {ReceiptStatus(person.name)}
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
        </div>
        <div className="flex flex-col ml-2">
          <label
            htmlFor="submit"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            생성
          </label>
          <button
            type="button"
            id="submit"
            onClick={handleSubmit}
            className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor mt-2"
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}
