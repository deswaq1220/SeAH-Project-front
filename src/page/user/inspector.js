import {useState} from "react";
import UserfrequentReg from "./UserfrequentReg";

export default function Inspector({onFormDataChange}) {
    // 상태설정
    const [speEmpNum, setSpeEmpNum] = useState("");
    const [spePerson, setSpePerson] = useState("");
    const [speEmail, setSpeEmail] = useState("");

    // 입력란 변경 시 상태 업데이트 함수

    // 입력란 변경 시 상태 업데이트 함수
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "Employeenumber") {
            setSpeEmpNum(value);
        } else if (name === "inspectorname") {
            setSpePerson(value);
        } else if (name === "inspectoremail") {
            setSpeEmail(value);
        }
        const formData = { [name]: value };
        onFormDataChange(formData);
    };

    // const handleEmpNumChange = (e) => {
    //     setSpeEmpNum(e.target.value);
    //     onFormDataChange({speEmpNum : e.target.value});        // 입력값 변경시 데이터 업데이트 콜백 호출
    // }
    //
    // const handlePersonChange = (e) => {
    //     setSpePerson(e.target.value);
    //     onFormDataChange({spePerson : e.target.value});        // 입력값 변경시 데이터 업데이트 콜백 호출
    // }
    // const handleEmailChange = (e) => {
    //     setSpeEmail(e.target.value);
    //     onFormDataChange({speEmail : e.target.value});        // 입력값 변경시 데이터 업데이트 콜백 호출
    // }
    return (

        <div id="inspector" className="flex items-baseline justify-start">
        <span
            className=" w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4 ">
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
                        name="Employeenumber"
                        id="Employeenumber"
                        placeholder="사원번호"
                        autoComplete=""
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5 mb-2"
                        value={speEmpNum}                   // 상태 value로 설정
                        onChange={handleInputChange}       // 입력란 변경 시 상태업데이트
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
                        value={spePerson}                   // 상태 value로 설정
                        onChange={handleInputChange}       // 입력란 변경 시 상태업데이트
                    />
                    <input
                        type="email"
                        name="inspectoremail"
                        id="inspectoremail"
                        placeholder="이메일"
                        autoComplete=""
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
                        value={speEmail}                   // 상태 value로 설정
                        onChange={handleInputChange}       // 입력란 변경 시 상태업데이트
                    />
                </div>
            </div>
        </div>

    )
}