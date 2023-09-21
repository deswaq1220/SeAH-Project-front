import Header from "../../components/Header";
import UserHeader from "../../components/UserHeader";
import Breadcrumbs from "./Breadcrumbs";
import FrequentInseptionTable from "./FrequentInseptionTable";
import FrequentInsArea from "./FrequentinseptionForm/area";
import EquipmentName from "./FrequentinseptionForm/equipmentName";
import Period from "./FrequentinseptionForm/Period";
import Inspector from "./FrequentinseptionForm/inspector";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import DangerousType from "./FrequentinseptionForm/DangerousType";
import {useParams} from "react-router-dom";

// String -> SpeStatus 형변환
const SpeStatus = {
  OK: "OK",
  NO: "NO",
};

//수시점검 현황
export default function FrequentIns() {
  const { isManager } = useParams(); // 관리자접근 파라미터
  const [searchData, setSearchData] = useState([]); // 검색 결과 데이터 저장
  const [spePart, setSpePart] = useState(null); // 영역
  const [speFacility, setSpeFacility] = useState(""); // 설비명
  const [speDanger, setSpeDanger] = useState(null); // 영역
  const [speStartDate, setSpeStartDate] = useState(null); // 시작기간
  const [speEndDate, setSpeEndDate] = useState(null); // 끝기간
  const [spePerson, setSpePerson] = useState(null); // 점검자 사번
  const [speEmpNum, setSpeEmpNum] = useState(null); // 점검자 이름
  const [speComplete, setSpeComplete] = useState(""); // 완료여부

  // 영역 콜백
  const handlePartDataChange = (selected) => {
    if (selected.partMenu === "선택") {
      setSpePart(null);
    } else {
      setSpePart(selected.partMenu);
    }
  };

  // // 설비 콜백
  // const handleFacilityDataChange = (selected) => {
  //   setSpeFacility(selected.masterdataFacility);
  // };

  // 설비 콜백
  const handleFacilityDataChange = (selected) => {
    if (selected.masterdataFacility === "전체") {
      setSpeFacility(null);
    } else {
      setSpeFacility(selected.masterdataFacility);
    }
  };

  // 위험분류 콜백
  const handleDangerDataChange = (selected) => {
    if (selected.dangerMenu === "선택") {
      setSpeDanger(null);
    } else {
      setSpeDanger(selected.dangerMenu);
    }
  };

  // 기간 콜백
  const handleDateDataChange = (value) => {
    setSpeStartDate(value.startDate);
    setSpeEndDate(value.endDate);
  };

  // // 점검자 콜백
  // const handleInspectorDataChange = (selected) => {
  //   setSpePerson(selected.inspectorName);
  //   setSpeEmpNum(selected.inspectorNum);
  // };

  // 점검자 콜백
  const handleInspectorDataChange = (selected) => {
    setSpePerson(selected.inspectorName);
    setSpeEmpNum(selected.inspectorNum);

    if (selected.speComplete === "OK") {
      setSpeComplete(SpeStatus.OK);
    } else if (selected.speComplete === "NO") {
      setSpeComplete(SpeStatus.NO);
    } else {
      setSpeComplete(null);
    }
  };

  // 세션스토리지 값 비교
  const isLoggedIn = sessionStorage.getItem("username", "admin") !== null;

  // 검색 조건을 이용하여 서버로 요청 보내고 검색 결과를 받아옴
  const handleSearchButtonClick = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/user/frequentinspection`, {
        params: {
          spePart,
          speFacility,
          speDanger,
          speStartDate,
          speEndDate,
          speComplete,
          spePerson,
          speEmpNum,
        },
      })
      .then((response) => {
        const speListFromBack =
          response.data.searchSpeList.searchSpeDataDTOList;
        setSearchData(speListFromBack);

        // 검색 결과가 없는 경우 알림을 표시
        if (speListFromBack.length === 0) {
          toast.info("검색 결과가 없습니다.", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000, // 1초 동안 알림 표시
          });
        } else {
          // 검색 결과가 있을 경우 searchResults에 세팅
          setSearchData(speListFromBack);
        }
      })

      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  return (
    <>
      {isLoggedIn ? <Header /> : <UserHeader />}
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* 탭 */}
        <Breadcrumbs />
        {/* 여기는 검색폼 좌리*/}
        <form className="flex mb-8">
          <div className="flex flex-wrap">
            <div className="flex flex-wrap">
              <FrequentInsArea onFormDataChange={handlePartDataChange} />{" "}
              {/* 영역 */}
              <EquipmentName
                onFormDataChange={handleFacilityDataChange}
                selectedPart={spePart}
              />{" "}
              {/* 설비명 */}
              <DangerousType
                onFormDataChange={handleDangerDataChange}
              ></DangerousType>{" "}
              {/* 위험분류 */}
              <Period onFormDataChange={handleDateDataChange} /> {/* 기간 */}
            </div>
            <div className="flex items-center flex-wrap">
              <Inspector onFormDataChange={handleInspectorDataChange} />{" "}
              {/* 점검자 */}
              <div className="sm:flex flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSearchButtonClick}
                  className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor ml-4 mr-4 h-9 w-28 "
                >
                  검색
                </button>
              </div>
            </div>
          </div>
        </form>
        {/* 테이블 */}
        <FrequentInseptionTable searchResults={searchData}
                                isManager={isManager}/>
      </div>
    </>
  );
}
