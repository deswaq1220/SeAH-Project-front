import {useState} from "react";

// 점검자
export default function Inspector({onFormDataChange}) {
  // 점검자정보
  const [inspectorData, setInspectorData] = useState({
    inspectorName: null,
    inspectorNum: null,
  });

  // 입력란 변경 시 상태 업데이트 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // 새로운 상태 업데이트
    const updatedInspecFormDate = {
      ...inspectorData,
      [name]: value || null, // 빈 문자열이면 null로 설정
    }
    setInspectorData(updatedInspecFormDate);
    // 폼 데이터 업데이트 후에 콜백 호출
    onFormDataChange({
      inspectorName: updatedInspecFormDate.inspectorName,
      inspectorNum: updatedInspecFormDate.inspectorNum,
    });
  };


  return (
    <>
      <div id="inspector" className="flex items-baseline justify-start">
        <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
          점검자
        </span>
        <div className="sm:col-span-3">
          <div className="mt-2">
            <input
              type="text"
              name="inspectorNum"
              id="inspectorNum"
              autoComplete="off"
              placeholder="사원번호"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
              value={inspectorData.inspectorNum}   // 상태 value로 설정
              onChange={handleInputChange}         // 입력란 변경 시 상태업데이트
            />
          </div>
        </div>
        <div className="sm:col-span-3 ml-2">
          <div className="mt-2">
            <input
              type="text"
              name="inspectorName"
              id="inspectorName"
              autoComplete="off"
              placeholder="이름"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5 "
              value={inspectorData.inspectorName}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
