import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./style/reset.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManagerLogin from "./page/manager/ManagerLogin";
import MainManager from "./page/manager/MainManager";
import ReferenceInfo from "./page/manager/ReferenceInfo";
import SafetyEducationMain from "./page/manager/SafetyEducationMain";
import SafetyInspection from "./page/manager/SafetyInspection";
import Error from "./page/error";
import SafetyEduReg from "./page/manager/SafetyEduReg";
import UserSafetyEduAttendance from "./page/user/UserSafetyEduAttendance";
import SafetyEduDetails from "./page/manager/SafetyEduDetails";
import UserSelectInspection from "./page/user/UserSelectInspection";
import Userfrequent from "./page/user/Userfrequent";
import UserfrequentReg from "./page/user/UserfrequentReg";
import UserfrequentCompleteReg from "./page/user/UserfrequentCompleteReg";
import EduStatics from "./page/manager/EduStatics"
import EduAttenStatics from "./page/manager/EduAttenStatics"
import FrequentIns from "./page/manager/SafetyFrequentInspection";
import AttenStatus from "./page/manager/AttendanceStatus";
import UserFrequentDetails from "./page/user/UserFrequentDetails/UserFrequentDetails";
import FrequentDetails from "./page/manager/FrequentDetails/FrequentDetails"
import TrainingReport from "./components/TrainingReport";
import SafetyManagerInspection from "./page/manager/SafetyManagerInspection";
import RegularMain from "./page/user/RegularMain";

import UserRegularReg from "./page/user/UserRegularReg/UserRegularReg";
import UserRegularDetails from "./page/user/UserRegularDetails/UserRegularDetails";

import SafetyInspectionStatisticsYear from "./page/manager/SafetyInspectionStatisticsYear";
import SafetySpecialInspectionStatisticsMonth from "./page/manager/SafetySpecialInspectionStatisticsMonth";
import SafetyRegularInspectionStatisticsMonth from "./page/manager/SafetyRegularInspectionStatisticsMonth";
import UserRegularInspectionStatus from "./page/user/UserRegularInspectionStatus/UserRegularInspectionStatus";


function App() {
  console.log(`

   %c███████╗ █████╗ ██╗   ██╗ ██████╗ 
   %c██╔════╝██╔══██╗██║   ██║██╔════╝ 
   %c███████╗███████║██║   ██║██║  ███╗
   %c╚════██║██╔══██║╚██╗ ██╔╝██║   ██║
   %c███████║██║  ██║ ╚████╔╝ ╚██████╔╝
   %c╚══════╝╚═╝  ╚═╝  ╚═══╝   ╚═════╝ 
  `,"color:#F84c0b","color:#f5652f","color:#fd8153","color:#fa936d","color:#fda787","color:#fda787",)

  const adminOnly = sessionStorage.getItem("adminOnly") === "adminOnly";


  return (
      <Router>
        <Routes>
          {/* 관리자 */}
          <Route path="/" element={<ManagerLogin/>}></Route> {/* 관리자 로그인페이지 */}
          <Route path="/manager" element={<MainManager/>}></Route> {/* 관리자 메인페이지 */}
          <Route path="/eduMain" element={<SafetyEducationMain/>}></Route>{/* 관리자 안전교육페이지 */}
          <Route path="/edudetails/:eduId" element={<SafetyEduDetails />} />{/* 관리자 안전교육상세*/}
          <Route path="/edureg" element={<SafetyEduReg />} />{/* 관리자 안전교육 등록페이지 */}
          <Route path="/edureg/:eduId" element={<SafetyEduReg /> }/>{/* 관리자 안전교육 등록페이지 */}
          <Route path="/managerinspection" element={adminOnly ? <SafetyManagerInspection /> : <Navigate to="/" replace />} />{/* 관리자 안점점검 페이지 */}
          <Route path="/inspection" element={adminOnly ? <SafetyInspection /> : <Navigate to="/" replace />} />{/* 관리자 안점점검 페이지 */}
          <Route path="/attenstatus/:eduId" element={adminOnly ? <AttenStatus /> : <Navigate to="/" replace />} />{/* 관리자 출석현황 */}
          <Route path="/training/:eduId" element={adminOnly ? <TrainingReport /> : <Navigate to="/" replace />} />{/* 관리자 출석현황 */}
          <Route path="/reginfo" element={adminOnly ? <ReferenceInfo /> : <Navigate to="/" replace />} />{/* 관리자 기준정보페이지 */}
          <Route path="/edustatistics" element={adminOnly ? <EduStatics /> : <Navigate to="/" replace />} />{/* 관리자 안전교육통계*/}
          <Route path="/edustatistics/atten" element={adminOnly ? <EduAttenStatics /> : <Navigate to="/" replace />} />{/* 관리자 안전교육통계*/}
          <Route path="/inspection/statistics/year" element={adminOnly ? <SafetyInspectionStatisticsYear /> : <Navigate to="/" replace />} />{/* 관리자 연간분석(정기점검/수시점검) 통계 대시보드*/}
          <Route path="/inspection/statistics/month/special" element={adminOnly ? <SafetySpecialInspectionStatisticsMonth /> : <Navigate to="/" replace />} />{/* 관리자 월간분석(수시점검) 대시보드*/}
          <Route path="/inspection/statistics/month/regular" element={adminOnly ? <SafetyRegularInspectionStatisticsMonth /> : <Navigate to="/" replace />} />{/* 관리자 월간분석(정기점검) 대시보드*/}

        {/* 공통 */}
        <Route path="/regular" element={<RegularMain/>}></Route>{/* 관리자,사용자 정기점검 목록 */}
        <Route path="/regulardetails" element={<UserRegularDetails/>}></Route>{/* 관리자,사용자 정기점검 상세페이지 */}
        <Route path="/frequentinspection" element={<FrequentIns/>}></Route>{/* 공통 수시점검 현황*/}
        <Route path="/all/special/detail/:speId" element={<FrequentDetails/>}></Route>{/* 공통 수시점검 상세페이지 */}
        <Route path="/regularinsstatus" element={<UserRegularInspectionStatus/>}></Route>{/* 정기점검 현황 */}

        {/* 사용자  */}
        <Route path="/userattendance/register/:eduId" element={<UserSafetyEduAttendance/>}></Route>{/* 사용자 사원출석페이지 */}


        {/* 사용자 수시점검 */}
        <Route path="/special/:masterdataPart/:masterdataId" element={<UserSelectInspection/>}></Route>  {/* 사용자 점검선택페이지*/}
        <Route path="/special/list/:masterdataPart/:masterdataId" element={<Userfrequent/>}></Route>  {/* 사용자 수시점검 설비별 리스트페이지*/}
        <Route path="/special/new/:masterdataPart/:masterdataId" element={<UserfrequentReg/>}></Route>{/* 사용자 수시점검등록 / 수정페이지 */}
        <Route path="/special/complete/:masterdataPart/:masterdataId" element={<UserfrequentCompleteReg/>}></Route>{/* 사용자 수시점검 완료등록 페이지 */}

        <Route path="/userfrequentreg" element={<UserfrequentReg/>}></Route>{/* 수시점검 등록페이지 */}
        <Route path="/special/detail/:speId" element={<UserFrequentDetails/>}></Route>{/* 수시점검 상세페이지 */}

        {/* 정기점검 */}
        <Route path="/regular" element={<RegularMain/>}></Route>{/* 관리자,사용자 정기점검 목록 */}
        <Route path="/regulardetails/:regularId" element={<UserRegularDetails/>}></Route>{/* 관리자,사용자 정기점검 목록 */}


        {/* 사용자 정기점검 */}
        <Route path="/regularreg" element={<UserRegularReg/>}></Route>{/* 정기점검 등록페이지 */}


        <Route path="/404" element={<Error/>}></Route> {/* 에러 */}
      </Routes>
      <ToastContainer/>
    </Router>
    
  );
}

export default App;