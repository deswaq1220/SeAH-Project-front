import Header from "../../components/Header";
import Breadcrumbs from "./Breadcrumbs";
import FrequentInseptionTable from "./FrequentInseptionTable";
import FrequentInsArea from "./FrequentinseptionForm/area";
import EquipmentName from "./FrequentinseptionForm/equipmentName";
import Period from "./FrequentinseptionForm/Period";
import Inspector from "./FrequentinseptionForm/inspector";
import axios from "axios";
import {useState} from "react";
import { toast } from "react-toastify";

//수시점검 현황
export default function FrequentIns() {
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 데이터 저장
  const [spePart, setSpePart] = useState("");            // 영역
  const [speFacility, setSpeFacility] = useState("");   // 설비명
  const [speStartDate, setSpeStartDate] = useState("");   // 시작기간
  const [speEndDate, setSpeEndDate] = useState("");       // 끝기간
  const [spePerson, setSpePerson] = useState("");       // 점검자 사번
  const [speEmpNum, setSpeEmpNum] = useState("");       // 점검자 이름
  const [speComplete, setSpeComplete] = useState("");       // 완료여부




  // 영역 콜백
  const handlePartDataChange = (selected) => {
    setSpePart(selected.partMenu);
  };

  // 설비 콜백
  const handleFacilityDataChange = (selected) => {
    setSpeFacility(selected);
  };

  // 기간 콜백
  const handleDateDataChange = (selected) => {
    setSpeStartDate(selected.startDate);
    setSpeEndDate(selected.endDate);
  };

  // 점검자 콜백
  const handleInspectorDataChange = (selected) => {
    setSpePerson(selected.inspectorName);
    setSpeEmpNum(selected.inspectorNum);
  };


  return (
    <>
      <Header />

      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* 탭 */}
        <Breadcrumbs />

        {/* 여기는 검색폼 좌리*/}
        <form className="flex">
          <div className="flex flex-wrap">
            <div className="flex flex-wrap">
              <FrequentInsArea onFormDataChange={handlePartDataChange}/> {/* 영역 */}
              <EquipmentName onFormDataChange={handleFacilityDataChange}
                             selectedPart={spePart}/> {/* 설비명 */}
              <Period onFormDataChange={handleDateDataChange}/> {/* 기간 */}
            </div>
            <div className="flex items-center">
              <Inspector onFormDataChange={handleInspectorDataChange}/> {/* 점검자 */}
              <button
                type="submit"
                // onClick={handleFormSubmit}
                className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor ml-2 mr-4 h-9 w-28 "
              >
                검색
              </button>
            </div>
          </div>
        </form>
        {/* 테이블 */}
        <FrequentInseptionTable searchResults={searchResults} />
      </div>
    </>
  );
}
