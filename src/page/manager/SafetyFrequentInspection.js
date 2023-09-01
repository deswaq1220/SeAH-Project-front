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
  const [searchData, setSearchData] = useState([]); // 검색 결과 데이터 저장
  const [spePart, setSpePart] = useState(null);            // 영역
  const [speFacility, setSpeFacility] = useState("");   // 설비명
  const [speStartDate, setSpeStartDate] = useState(null);   // 시작기간
  const [speEndDate, setSpeEndDate] = useState(null);       // 끝기간
  const [spePerson, setSpePerson] = useState(null);       // 점검자 사번
  const [speEmpNum, setSpeEmpNum] = useState(null);       // 점검자 이름
  const [speComplete, setSpeComplete] = useState("");       // 완료여부

  // 영역 콜백
  const handlePartDataChange = (selected) => {
    if(selected.partMenu === "선택"){
      setSpePart(null);
    } else {
      setSpePart(selected.partMenu);
    }
  };

  // 설비 콜백
  const handleFacilityDataChange = (selected) => {
    setSpeFacility(selected.masterdataFacility);
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


  // 검색 조건을 이용하여 서버로 요청 보내고 검색 결과를 받아옴
  const handleSearchButtonClick = () => {
    axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/user/frequentinspection`, {
          params: {
            spePart,
            speFacility,
            speStartDate,
            speEndDate,
            speComplete,
            spePerson,
            speEmpNum,
          },
        })
        .then((response) => {
          const speListFromBack = response.data.searchSpeList.searchSpeDataDTOList;
          setSearchData(speListFromBack);

          // 검색 결과가 없는 경우 알림을 표시
          if (speListFromBack.length === 0) {
            toast.info('검색 결과가 없습니다.', {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 1000, // 1초 동안 알림 표시

            });
          }
        })

        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
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
                type="button"
                onClick={handleSearchButtonClick}
                className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor ml-2 mr-4 h-9 w-28 "
              >
                검색
              </button>
            </div>
          </div>
        </form>
        {/* 테이블 */}
        <FrequentInseptionTable searchResults={searchData} />
      </div>
    </>
  );
}
