import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useParams } from "react-router-dom";
import axios from "axios";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Injured({ onFormDataChange, defaultState, complete }) {
  const { masterdataPart } = useParams(); // url 영역 파라미터
  const { masterdataId } = useParams(); // url 설비코드 파라미터
  const [specialInjuredList, setSpecialInjuredList] = useState([]); // 부상부위List
  const [injuredSelected, setInjuredSelected] = useState(""); //  부상부위
  const [customInjured, setCustomInjured] = useState(""); // 기타[직접선택] 입력된 값
  const [showErrorMessage, setShowErrorMessage] = useState(false); // 해당 셀렉박스 미설정시 알람

  // 부상부위 get
  useEffect(() => {
    function specialInjureFetchDataWithAxios( masterdataPart, masterdataId) {
      axios
          .get(`${process.env.REACT_APP_API_BASE_URL}/user/special/new/${masterdataPart}/${masterdataId}`)   // 세아
          .then((response) => {
            // 백에서 보내주는 부상부위 리스트
            const speInjuredListFromBack = response.data.specialInjuredList;
            const speInjuredData = speInjuredListFromBack.map((item) => {
              return {
                injuredMenu: item.injuredMenu,
                injuredNum: item.injuredNum,
              };
            });
            setSpecialInjuredList(speInjuredData);

            // defaultState확인 : 수정/완료등록일 경우
            if (defaultState) {
              if(defaultState.indexOf("기타(직접입력)/")===0){
                const splitArray = defaultState.split('/');
                const firstPart = splitArray[0]; // "기타(직접입력)"
                const secondPart = splitArray[1]; // "내용"

                setInjuredSelected(firstPart);    // 셀렉트박스
                setCustomInjured(secondPart);    // 인풋박스
              } else {
                setInjuredSelected(defaultState);
              }
            } else {
              setInjuredSelected(speInjuredData[0].injuredMenu); // defaultState가 없을 때 첫 번째 값을 선택
            }
          })
          .catch((error) => {
            console.error("Error fetching data: ", error);
        });
    }

    specialInjureFetchDataWithAxios(masterdataPart, masterdataId);
  }, [defaultState]);


  // 기타(직접입력) 선택 시, customInjured 값 업데이트, onFOrmDataChange 호출
  const handleCustomInjuredChange = (e) => {
    setCustomInjured(e.target.value);
    onFormDataChange(injuredSelected+"/"+e.target.value);
  };

  // 부상부위 선택 시 injuredSelected 값 없데이트, onFormDataChange 호출
  const handleSelectedInjuredChange = (value) => {
    setInjuredSelected(value);

    // 기타(직접입력)을 제외한 경우 onFormDataChange에 value값 넘김
    if (value !== "기타(직접입력)") {
      onFormDataChange(value);
    }
  };


  return (
    <div id="injured" className="flex items-baseline justify-start">
      <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
        부상부위
      </span>
      <div className="flex flex-col">
        {/* 부상부위 */}
        <Listbox value={injuredSelected} onChange={handleSelectedInjuredChange}>
          {({ open }) => (
            <>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-32 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                  <span className="block truncate">{injuredSelected}</span>
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
                    {specialInjuredList.map((specialInjuredItem) =>(
                          <Listbox.Option
                            key={specialInjuredItem.injuredMenu}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "bg-seahColor text-white"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={specialInjuredItem.injuredMenu}
                            onChange={handleSelectedInjuredChange}
                            disabled={complete}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {specialInjuredItem.injuredMenu}
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
                        )
                    )}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
        {/* Custom Input */}
        {injuredSelected === "기타(직접입력)" && (
            <input
              type="text"
              value={customInjured}
              name="speInjure"
              onChange={handleCustomInjuredChange}
              className="block w-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5 mt-1"
              placeholder="직접 입력"
              readOnly={complete}
            />
          )}
      </div>
    </div>
  );
}