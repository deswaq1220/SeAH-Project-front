import React, { useState } from 'react';

//기간
export default function Period({onFormDataChange}) {
    const [date, setDate] = useState({
        startDate:null,
        endDate:null
    });

  const handleInputChange = (e) => {
      const { name, value } = e.target;

      // 새로운 상태 업데이트
      const updatedDate = {
          ...date,
          [name]: value,
      }
      setDate(updatedDate);


      // 폼 데이터 업데이트 후에 콜백 호출
      onFormDataChange({
          startDate:updatedDate.startDate,
          endDate:updatedDate.endDate,
      });

      console.log("handleInputChange - startDate:", updatedDate.startDate);
      console.log("handleInputChange - endDate:", updatedDate.endDate);
  };


    return (
    <div id="eduPlace" className="flex items-baseline justify-start">
      <span className="w-20 inline-flex items-center justify-center rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-seahColor ring-1 ring-inset ring-red-600/10 flex-grow-0 m-4">
        기간
      </span>
      <div className="sm:col-span-3">
        <div className="mt-2">
          <div className="flex">
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={date.startDate}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
            />
            <span className="mx-2">~</span>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={date.endDate}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}
