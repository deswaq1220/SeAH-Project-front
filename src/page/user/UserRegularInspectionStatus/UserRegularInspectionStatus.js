import Header from "../../../components/Header";
import UserHeader from "../../../components/UserHeader";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import InsBreadcrumbs from "./InsBreadcrumbs";
import InsArea from "./InsArea";
import InsRegularItem from "./InsRegularItem";
import InsPeriod from "./InsPeriod";
import RegularInspector from "./RegularInspector";
import UserRegularInspectionTable from "./UserRegularInstpectionTable";
//수시점검 현황
export default function UserRegularInspectionStatus() {
  const [spePart, setSpePart] = useState(null); // 영역
  const [speStartDate, setSpeStartDate] = useState(null); // 시작기간
  const [speEndDate, setSpeEndDate] = useState(null); //종료기간

  const [spePerson, setSpePerson] = useState(null); // 점검자사번
  const [speEmpNum, setSpeEmpNum] = useState(null); // 점검자 이름
  const [searchResult, setSearchResult] = useState([]); // 검색 결과 저장할 새로운 state
  const [regularInsName, setRegularInsName] = useState(null);
  const [regularComplete, setRegularComplete] = useState(null);
  // 영역 콜백
  const handlePartDataChange = (selected) => {
    if (selected === "선택") {
      setSpePart(null);
    } else {
      setSpePart(selected);
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
    setRegularComplete(selected.speComplete); // 추가된 코드
  };

  // 점검항목 콜백
  const handleRegularNameDataChange = (selected) => {
    if (selected.name === "선택") {
      setRegularInsName(null);
    } else {
      setRegularInsName(selected.name);
    }
  };
  const isLoggedIn = sessionStorage.getItem("username", "admin") !== null;

  useEffect(() => {
    async function fetchAllData() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/searchregularlist`
        );
        setSearchResult(response.data.searchResult);
        console.log(response.data.searchResult);

        // 검색 결과를 해당 월에 해당하는 데이터로 필터링
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const filteredResult = response.data.searchResult.filter((item) => {
          const inspectionDate = new Date(item.regularDate);
          const inspectionYear = inspectionDate.getFullYear();
          const inspectionMonth = inspectionDate.getMonth();

          // 검색 결과의 월과 년도가 현재 월과 년도와 같은 경우만 포함
          return (
            inspectionYear === currentYear && inspectionMonth === currentMonth
          );
        });

        setSearchResult(filteredResult); // 필터링된 결과를 state에 저장
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchAllData();
  }, []);

  const handleSearch = async () => {
    console.log(spePart);
    
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user/searchregularlist`,
        {
          params: {
            regularPart: spePart,
            regularInsName: regularInsName,
            regularStartDate: speStartDate,
            regularEndDate: speEndDate,
            regularEmpNum: speEmpNum,
            regularPerson: spePerson,
            regularComplete: regularComplete,
          },
        }
      );
      setSearchResult(response.data.searchResult); // 응답 데이터를 state에 저장
      if (response.data.searchResult.length === 0) {
        toast.info("검색 결과가 없습니다.", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000, // 1초 동안 알림 표시
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
              <InsArea onFormDataChange={handlePartDataChange} /> {/* 점검구역 */}
              <InsRegularItem
                onFormDataChange={handleRegularNameDataChange}
              />{" "}
              {/* 점검항목 */}
              <InsPeriod onFormDataChange={handleDateDataChange} /> {/* 기간 */}
            </div>
            <div className="flex items-center flex-wrap">
              <RegularInspector onFormDataChange={handleInspectorDataChange} />{" "}
              {/* 점검자 */}
              <div className="flex flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="rounded-md bg-seahColor px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-seahDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-seahColor ml-4 mr-4 h-9 w-28 "
                >
                  검색
                </button>
              </div>
            </div>
          </div>
        </form>
        {/* 테이블 */}
        {/* 테이블 컴포넌트에 props로 searchResult 전달 */}
        <UserRegularInspectionTable data={searchResult} />
      </div>
    </>
  );
}
