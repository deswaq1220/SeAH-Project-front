import React, { useState, Fragment, useCallback, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import UserHeader from "../../components/UserHeader";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function UserSafetyEduAttendance() {
  const [department, setDepartment] = useState([]);
  const [selected, setSelected] = useState({
    departmentName: "", // 부서 이름을 나중에 설정하기 위한 임시 값
    attenName: "",
    attenEmployeeNumber: "",
  });
  // ...
  const { eduId } = useParams();
  const [eduList, setEduList] = useState([]); // 안전교육 데이터를 담을 상태 변수
  const [eduData, setEduData] = useState(null);
  const [eduTitle, setEduTitle] = useState("");
  const [isAttendanceCompleted, setIsAttendanceCompleted] = useState(false); // 출석 완료 여부 상태 변수
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}. ${month}. ${day}`;

  const handleSubmit = (event) => {
    event.preventDefault();

    // Form 데이터 가져오기
    const attenDepartment = selected.name;
    const attenName = selected.attenName;
    const attenEmployeeNumber = selected.attenEmployeeNumber;

    const requestData = {
      attenDepartment,
      attenName,
      attenEmployeeNumber,
      eduId,
    };

    // 버튼이 비활성화되어 있더라도 클릭 이벤트가 발생하도록 수정
    axios
      .post(
        `${process.env.REACT_APP_API_BASE_URL}/user/register/${eduId}`, // 세아
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {

        toast.success("출석이 완료되었습니다.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          style: {
            marginTop: "5rem", // 원하는 세로 위치로 조정
          },
        });
        setIsAttendanceCompleted(true);
      })
      .catch((error) => {
        console.error(error);
        toast.error(<div>
          출석 등록에 실패했습니다. 다시 시도해주세요.
        </div>, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          style: {
            width: "400px",
          },
        });
      });
  };

  // 값 가져오는 핸들러
  const handleNameChange = (event) => {
    setSelected((prevSelected) => ({
      ...prevSelected,
      attenName: event.target.value,
    }));
  };

  const handleNumberChange = (event) => {
    setSelected((prevSelected) => ({
      ...prevSelected,
      attenEmployeeNumber: event.target.value,
    }));
  };

  useEffect(() => {
    // 서버로부터 안전교육 데이터를 가져오는 함수
    const fetchEduList = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/admin/edudetails/${eduId}` // 세아
        );
        setEduList(response.data); // 해당 아이디에 해당하는 데이터를 상태 변수에 저장
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    // GET 요청을 통해 eduTitle 가져오기
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/user/register/${eduId}`) // 세아
    
      .then((response) => {
        // 응답 데이터에서 eduTitle 값을 추출하여 상태 업데이트
        setEduTitle(response.data.eduTitle);
      })
      .catch((error) => {
        // 오류 처리
        console.error("Error fetching eduTitle:", error);
      });

    fetchEduList(); // 데이터 가져오기 함수 호출
  }, [eduId]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/admin/master/departdropdown`)
      .then((response) => {
        if (
          response.data &&
          response.data.departmentList &&
          response.data.departmentList.length > 0
        ) {
          const departmentData = response.data.departmentList.map((item) => {
            const [id, name] = item.split(","); // 각 항목을 쉼표로 분리
            return { id, name }; // 분리한 값을 가진 객체 반환
          });
          setDepartment(departmentData);
          setSelected((prevSelected) => ({
            ...prevSelected,
            name: departmentData[0].name,
          }));
        } else {
          console.error("No department data received");
        }
      })
      .catch((error) => {
        console.error("Error fetching department data:", error);
      });
  }, []);

  return (
    <div>
      <UserHeader></UserHeader>

      <div className="flex justify-center">
        <div
          id="safeEduDetail"
          className="max-w-screen-lg w-full px-2 flex flex-col items-center mt-4  "
        >
          <div className="px-4 sm:px-0 text-center mt-3">
            <h3 className=" text-4xl font-bold leading-7  text-gray-900 ">
              {formattedDate}
            </h3>
            <p className="mt-1 max-w-2xl text-lg leading-6 text-gray-500">
              <span className=" font-bold text-seahColor">
                {eduList.eduTitle}
              </span>{" "}
              교육 사원출석 페이지입니다.
            </p>
          </div>
          <form className="w-full md:grid-cols-2" onSubmit={handleSubmit}>
            <div id="sortation" className="flex items-baseline justify-start">
              <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
                부서
              </span>
              <Listbox value={selected} onChange={setSelected}>
                {({ open }) => (
                  <>
                    <div className="relative mt-2">
                      <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-28 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
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
                          {department.map((person) => (
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
                                          : "text-seahColor",
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
            <div id="name" className="flex items-baseline justify-start">
              <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
                이름
              </span>
              <div className="sm:col-span-3">
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="Employee_name"
                    autoComplete="family-name"
                    value={selected.attenName}
                    onChange={handleNameChange}
                    placeholder="이름"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5  "
                  />
                </div>
              </div>
            </div>
            <div
              id="Employee_number"
              className="flex items-baseline justify-start"
            >
              <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4  ">
                사원번호
              </span>
              <div className="sm:col-span-3">
                <div className="mt-2">
                  <input
                    type="text"
                    name="number"
                    id="number"
                    value={selected.attenEmployeeNumber}
                    onChange={handleNumberChange}
                    required
                    placeholder="사원번호"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5 "
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pr-3 pb-3 flex items-center justify-end gap-x-6 ">
              
              <button
                type="submit"
                className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor"
                disabled={isAttendanceCompleted}
              >
                출석하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserSafetyEduAttendance;
