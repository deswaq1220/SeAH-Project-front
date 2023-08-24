import React, { useState } from 'react';

//기간
export default function Period({onFormDataChange}) {
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);
  const [date, setDate] = useState({
      startDate:"",
      endDate:"",
  });

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      // 새로운 상태 업데이트
       const updateDateFormData = {
           ...date,
           [name]: value,
       }
      setDate(updateDateFormData);
       // 폼 데이터 업데이트 후에 콜백 호출
      onFormDataChange({
          startDate: updateDateFormData.startDate,
          endDate: updateDateFormData.startDate,
      });
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
              value={date.startDate}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-seahColor sm:text-sm sm:leading-6 px-1.5"
            />
            <span className="mx-2">~</span>
            <input
              type="date"
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
