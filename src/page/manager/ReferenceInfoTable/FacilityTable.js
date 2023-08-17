import { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "qrcode.react";
import FacilityReg from "../ReferebceInfoForm/FacilityReg";

export default function FacilityTable() {
  const [facilityList, setFacilityList] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedFacilityData, setSelectedFacilityData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/master/viewfacilities"
      );
      setFacilityList(response.data.facilityList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedFacility !== null) {
      const facility = facilityList.find(
        (facility) => facility.masterdataId === selectedFacility
      );
      setSelectedFacilityData(facility);
    }
  }, [selectedFacility, facilityList]);

  const handleNewData = (newData) => {
    setFacilityList((prevList) => [...prevList, newData]);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            설비
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            해당 설비에 생성된 큐알코드를 열람할 수 있습니다
          </p>
         <div className="flex justify-end">
         <button
            type="button"
            className="rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ml-1"
          >
            주조
          </button>
         <button
            type="button"
            className="rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ml-1"
          >
            압출
          </button>
         <button
            type="button"
            className="rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ml-1"
          >
            가공
          </button>
         <button
            type="button"
            className="rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ml-1"
          >
            품질
          </button>
         <button
            type="button"
            className="rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ml-1"
          >
            생산기술
          </button>
         <button
            type="button"
            className="rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ml-1"
          >
            금형
          </button>
         </div>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr className="divide-x divide-gray-200">
                  <th
                    scope="col"
                    className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900 sm:pl-4"
                  >
                    설비명
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    영역
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    QR코드
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {facilityList.map((facility) => (
                  <tr
                    key={facility.masterdataId}
                    className="divide-x divide-gray-200"
                  >
                    <td className="whitespace-nowrap text-sm font-medium text-gray-900 sm:pl-4 px-4">
                      {facility.masterdataFacility}
                    </td>
                    <td className="whitespace-nowrap text-sm font-medium text-gray-900 sm:pl-4 px-4">
                      {facility.masterdataPart}
                    </td>
                    <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                      {selectedFacility === facility.masterdataId ? (
                        <QRCode value={JSON.stringify(selectedFacilityData)} />
                      ) : (
                        <button
                          className="text-seahColor"
                          onClick={() =>
                            setSelectedFacility(facility.masterdataId)
                          }
                        >
                          보기
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <FacilityReg fetchData={fetchData} handleNewData={handleNewData} />
    </div>
  );
}
