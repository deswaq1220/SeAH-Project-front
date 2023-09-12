import Header from "../../../components/Header";
import UserHeader from "../../../components/UserHeader";
import axios from "axios";
import {useState} from "react";
import { toast } from "react-toastify";
import InsBreadcrumbs from "./InsBreadcrumbs";
import InsArea from "./InsArea";
import InsRegularItem from "./InsRegularItem";
import InsPeriod from "./InsPeriod";
import Inspector from "../../manager/FrequentinseptionForm/inspector";
import UserRegularInspectionTable from "./UserRegularInstpectionTable"
//수시점검 현황
export default function UserRegularInspectionStatus() {
  const [spePart, setSpePart] = useState(null); // 영역
  const [speStartDate, setSpeStartDate] = useState(null);// 시작기간
  const [speEndDate, setSpeEndDate] = useState(null);//종료기간

  const [spePerson, setSpePerson] = useState(null);// 점검자사번
  const [speEmpNum, setSpeEmpNum] = useState(null);// 점검자 이름

  // 영역 콜백
  const handlePartDataChange = (selected) => {
    if(selected.partMenu === "선택"){
      setSpePart(null);
    } else {
      setSpePart(selected.partMenu);
    }
  };

  // 기간 콜백
  const handleDateDataChange = (value) => {
    setSpeStartDate(value.startDate);
    setSpeEndDate(value.endDate);
  };
  
   // 점검자 콜백
   const handleInspectorDataChange = (selected) => {
    setSpePerson(selected.inspectorName);
    setSpeEmpNum(selected.inspectorNum);
  };
  const isLoggedIn = sessionStorage.getItem('username','admin') !== null;

  return (
    <>
      {isLoggedIn ? <Header /> : <UserHeader />}
      {/* 세션 유무 비교해서 true 면 header false면 usehader */}
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* 탭 */}
        <InsBreadcrumbs />
        {/* 여기는 검색폼 좌리*/}
        <form className="flex mb-8">
          <div className="flex flex-wrap">
            <div className="flex flex-wrap">
              <InsArea onFormDataChange={handlePartDataChange}/> {/* 영역 */}
              <InsRegularItem /> {/* 점검항목 */}
             
              <InsPeriod onFormDataChange={handleDateDataChange}/> {/* 기간 */}
            </div>
            <div className="flex items-center">
              <Inspector onFormDataChange={handleInspectorDataChange}/> {/* 점검자 */}
              <button
                type="button"
               
                className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor ml-2 mr-4 h-9 w-28 "
              >
                검색
              </button>
            </div>
          </div>
        </form>
        {/* 테이블 */}
        <UserRegularInspectionTable/>
      </div>
    </>
  );
}
