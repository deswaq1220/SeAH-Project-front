
import { useState } from "react";

export default function Inspector({onFormDataChange}){
  const [inspector, setInspector] = useState({
    employeenumber:"",
    name:"",
    email:"",
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // 새로운 상태 업데이트
    const updatedFormDate = {
      ...inspector,
      [name]: value,
    };
    setInspector(updatedFormDate);

    // 폼 데이터 업데이트 후에 콜백 호출
    onFormDataChange({
      employeenumber: updatedFormDate.employeenumber,
      name: updatedFormDate.name,
      email: updatedFormDate.email,
    });
  };

  return(
    <div className=" flex flex-col   ml-4">
      <div className="">
        <input
          type="text"
          name="employeenumber"
          id="Employeenumber"
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6"
          placeholder="사원번호"
          value={inspector.employeenumber} // 상태 value로 설정
          onChange={handleInputChange} // 입력란 변경 시 상태업데이트
        />
      </div>
      <div className="my-2">
        <input
          type="text"
          name="name"
          id="name"
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6"
          placeholder="이름"
          value={inspector.name} // 상태 value로 설정
            onChange={handleInputChange} // 입력란 변경 시 상태업데이트

        />
      </div>
      <div className="">
        <input
          type="email"
          name="email"
          id="email"
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6"
          placeholder="세아@seah.co.kr"
          value={inspector.email} // 상태 value로 설정
          onChange={handleInputChange} // 입력란 변경 시 상태업데이트
        />
      </div>
    </div>
  )
}