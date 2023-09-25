import { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "qrcode.react";
import FacilityReg from "../ReferebceInfoForm/FacilityReg";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import DeleteRegInfoModal from "../../../components/DeleteRegInfoModal";
import "../../../style/reset.css";

export default function FacilityTable() {
  const [facilityList, setFacilityList] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedFacilityData, setSelectedFacilityData] = useState(null);
  const [selectedPart, setSelectedPart] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await handleDelete(deleteId);
    }
    setDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const handleShowConfirmDialog = (masterdataId) => {
    setDeleteId(masterdataId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async (masterdataId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/admin/master/delete/${masterdataId}`
      );
      setFacilityList((prevList) =>
        prevList.filter((facility) => facility.masterdataId !== masterdataId)
      );
      toast.success("설비 정보가 성공적으로 삭제되었습니다.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("설비 정보 삭제에 실패하였습니다. 다시 시도해주세요.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  const handleButtonClick = (part) => {
    setSelectedPart(part);
    setSelectedFacility(null); // 영역 변경 시 선택된 설비 초기화
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/master/viewfacilities`
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
    <div>
      <FacilityReg fetchData={fetchData} handleNewData={handleNewData} />
      <div className="px-4 sm:px-6 lg:px-8 mt-4 mb-20">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              설비
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              해당 설비에 생성된 QR 코드를 확인하실 수 있습니다.
            </p>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => handleButtonClick("주조")}
                className="rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ml-1"
              >
                주조
              </button>
              <button
                type="button"
                onClick={() => handleButtonClick("압출")}
                className="rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ml-1"
              >
                압출
              </button>
              <button
                type="button"
                onClick={() => handleButtonClick("가공")}
                className="rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ml-1"
              >
                가공
              </button>
              <button
                type="button"
                onClick={() => handleButtonClick("품질")}
                className="rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ml-1"
              >
                품질
              </button>
              <button
                type="button"
                onClick={() => handleButtonClick("생산기술")}
                className="rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ml-1"
              >
                생산기술
              </button>
              <button
                type="button"
                onClick={() => handleButtonClick("금형")}
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
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      설비삭제
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {facilityList
                    .filter((facility) =>
                      selectedPart === ""
                        ? true
                        : facility.masterdataPart === selectedPart
                    )
                    .map((facility) => (
                      <tr
                        key={facility.masterdataId}
                        className="divide-x divide-gray-200"
                      >
                        <td
                          className="whitespace-nowrap text-sm font-medium text-gray-900 sm:pl-4 px-4"
                          dangerouslySetInnerHTML={{
                            __html: facility.masterdataFacility.replace(
                              /퀜/g,
                              '<span class="special-font">퀜</span>'
                            ),
                          }}
                        />
                        <td className="whitespace-nowrap text-sm font-medium text-gray-900 sm:pl-4 px-4">
                          {facility.masterdataPart}
                        </td>
                        <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                          {selectedFacility === facility.masterdataId ? (
                            <QRCode
                              value={`http://172.20.10.43:3000/special/${facility.masterdataPart}/${facility.masterdataId}`}
                            />
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
                        <td className="whitespace-nowrap text-sm font-medium text-gray-900 sm:pl-4 px-4">
                          <button
                            onClick={() =>
                              handleShowConfirmDialog(facility.masterdataId)
                            }
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <DeleteRegInfoModal
        open={isDeleteModalOpen}
        setOpen={setIsDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
