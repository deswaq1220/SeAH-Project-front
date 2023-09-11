import {Fragment, useEffect, useState} from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import {useParams} from "react-router-dom";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dangersource({onFormDataChange, defaultState, complete}) {
  const { masterdataPart } = useParams(); // url 영역 파라미터
  const { masterdataId } = useParams(); // url 설비코드 파라미터
  const [specialCauseList, setSpecialCauseList] = useState([]);       // 위험원인List
  const [sourceSelected, setSourceSelected] = useState("");   // 선택내용(셀렉트박스)
  const [customSource, setCustomSource] = useState("");       // 입력내용(인풋박스)


 // 위험원인 get
 useEffect(() => {
  function specialCauseFetchDataWithAxios(masterdataPart, masterdataId) {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/user/special/new/${masterdataPart}/${masterdataId}`)  // 세아
      .then((response) => {
        const speCauseListFromBack = response.data.specialCauseList;

        

// <<<<<<< HEAD
        setSpecialCauseList(speCauseData);

        // defaultState확인 : 수정/완료등록일 경우
        if (defaultState) {
          if(defaultState.indexOf("기타(직접입력)/")===0){
            const splitArray = defaultState.split('/');
            const firstPart = splitArray[0]; // "기타(직접입력)"
            const secondPart = splitArray[1]; // "내용"

            setSourceSelected(firstPart);    // 셀렉트박스
            setCustomSource(secondPart);    // 인풋박스
          } else {
            setSourceSelected(defaultState);
          }
        } else {
          setSourceSelected(speCauseData[0].causeMenu); // defaultState가 없을 때 첫 번째 값을 선택
        }
      })
      .catch((error) => {
                console.error("Error fetching data: ", error);
      });
    }
  
    fetchData();
  }, [masterdataPart, masterdataId, defaultState]);


// =======
//         const speCauseData = speCauseListFromBack.map((item) => {
//           return {
//             causeMenu : item.causeMenu,
//             causeNum: item.causeNum,
//           };
//         });
//         setSpecialCauseList(speCauseData);
//         setSourceSelected(speCauseData[0]);
//       })
//       .catch((error) => {
//         console.error("Error fetching data: ", error);
//       });
//   }
// >>>>>>> ly_9

//   specialCauseFetchDataWithAxios(masterdataPart, masterdataId);
// }, [masterdataPart, masterdataId]);

  // 기타(직접입력) 선택 시, customSource 값을 업데이트하고 onFormDataChange를 호출
  const handleCustomSourceChange = (e) => {
    setCustomSource(e.target.value);
    onFormDataChange(sourceSelected+"/"+e.target.value);
  };

  // 위험원인 선택 시 sourceSelected 값 업데이트하고 onFormDataChange 호출
  const handleSelectedChange = (value) => {
    setSourceSelected(value);
    // 기타(직접입력)을 제외한 경우 onFormDataChange에 value값 넘김
// <<<<<<< HEAD
//     if (value !== "기타(직접입력)") {
// =======
    if (value.causeMenu !== "기타(직접입력)") {
      onFormDataChange(value);
    }
  };


  return(
    <div id="danger" className="flex items-baseline justify-start">
        <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
          위험원인
        </span>
        <div className="flex flex-col">
        <Listbox value={sourceSelected} onChange={handleSelectedChange}>
          {({ open }) => (
            <>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-32 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-seahColor sm:text-sm sm:leading-6">
                  <span className="block truncate">{sourceSelected}</span>
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
                    {specialCauseList.map((specialCauseItem) => (
                      <Listbox.Option
                        key={specialCauseItem.causeMenu}
                        className={({ active }) =>
                          classNames(
                            active
                              ? "bg-seahColor text-white"
                              : "text-gray-900",
                            "relative cursor-default select-none py-2 pl-3 pr-9"
                          )
                        }
                        value={specialCauseItem.causeMenu}
                        onChange={handleSelectedChange}
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
                              {specialCauseItem.causeMenu}
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

        {sourceSelected === "기타(직접입력)" && (
            <input
                type="text"
                value={customSource}
                name="speCause"
                onChange={handleCustomSourceChange}
                className="block w-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5 mt-1"
                placeholder="직접 입력"
                readOnly={complete}
            />
          )}
        </div>

{/* //         {sourceSelected && sourceSelected.causeMenu === "기타(직접입력)" && (
//           <input
//             type="text"
//             value={customSource}
//             name="speCause"
//             onChange={handleCustomSourceChange}
//             className="block w-40 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5 mt-1"
//             placeholder="직접 입력"
//           />
//         )} 
      </div>*/}

    </div>
  )
}