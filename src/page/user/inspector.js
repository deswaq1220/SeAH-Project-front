// import { useState } from "react";
import UserfrequentReg from "./UserfrequentReg";
import { useState, useEffect } from "react";
export default function Inspector({ onFormDataChange , defaultState}) {
  // 상태설정

    const [formData, setFormData] = useState({
      employeenumber: "",
      inspectorname: "",
      inspectoremail: "",
    });
  
    const [seahDomain, setSeahDomain] = useState("@seah.co.kr");

  // 수정/완료등록일 경우
    useEffect(() => {
      console.log("test"+ defaultState);
      console.log(defaultState);
      if (defaultState) {
        setFormData({
          employeenumber: defaultState.employeenumber,
          inspectorname: defaultState.inspectorname,
          inspectoremail: defaultState.inspectoremail,
        });
      }
    }, [defaultState]);

  // 입력란 변경 시 상태 업데이트 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // 새로운 상태 업데이트
    const updatedFormDate = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormDate);
    // 폼 데이터 업데이트 후에 콜백 호출
    onFormDataChange({
      employeenumber: updatedFormDate.employeenumber,
      inspectorname: updatedFormDate.inspectorname,
      inspectoremail: updatedFormDate.inspectoremail + seahDomain,
    });
  };

  return (
    <div id="inspector" className="flex items-baseline justify-start">
      <span className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
        점검자
      </span>
      <div className="sm:col-span-3">
        <label
          htmlFor="inspector"
          className="block text-sm font-medium leading-6 text-gray-900"
        ></label>
        <div className="mt-2">
          <input
            type="text"
            name="employeenumber"
            id="employeenumber"
            placeholder="사원번호"
            autoComplete=""
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5 mb-2"
            // value={formData.employeenumber} // 상태 value로 설정
            defaultValue={formData.employeenumber}
            onChange={handleInputChange} // 입력란 변경 시 상태업데이트
          />
        </div>
        <div>
          <input
            type="text"
            name="inspectorname"
            id="inspectorname"
            placeholder="이름"
            autoComplete=""
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5 mb-2"
            value={formData.inspectorname} // 상태 value로 설정
            onChange={handleInputChange} // 입력란 변경 시 상태업데이트
          />
          <input
            type="email"
            name="inspectoremail"
            id="inspectoremail"
            placeholder="이메일"
            autoComplete=""
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
            value={formData.inspectoremail} // 상태 value로 설정
            onChange={handleInputChange} // 입력란 변경 시 상태업데이트
          />
          <input
            type="text"
            name="emailDomain"
            id="emailDomain"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
            value={seahDomain}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
