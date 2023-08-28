import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./style/reset.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManagerLogin from "./page/manager/ManagerLogin";
import MainManager from "./page/manager/MainManager";
import ReferenceInfo from "./page/manager/ReferenceInfo";
import UserMain from "./page/user/UserMain";
import SafetyEducationMain from "./page/manager/SafetyEducationMain";
import SafetyInspection from "./page/manager/SafetyInspection";
import Error from "./page/error";
import SafetyEduReg from "./page/manager/SafetyEduReg";
import UserSafetyEduAttendance from "./page/user/UserSafetyEduAttendance";
import SafetyEduDetails from "./page/manager/SafetyEduDetails";
import EmailForm from "./Email";
import UserSelectInspection from "./page/user/UserSelectInspection";
import Userfrequent from "./page/user/Userfrequent";
import UserfrequentReg from "./page/user/UserfrequentReg";
import EduStatics from "./page/manager/EduStatics"
import EduAttenStatics from "./page/manager/EduAttenStatics"
import FrequentIns from "./page/manager/SafetyFrequentInspection";
import AttenStatus from "./page/manager/AttendanceStatus";
import UserFrequentDetails from "./page/user/UserFrequentDetails/UserFrequentDetails";
import UserRegularReg from "./page/user/UserRegularReg";
import TrainingReport from "./components/TrainingReport";
import SafetyManagerInspection from "./page/manager/SafetyManagerInspection";
import RegularMain from "./page/user/RegularMain";

//다인 씀
import SafetyInspectionStatisticsYearImg from "./page/manager/SafetyInspectionStatisticsYearImg";
import SafetyInspectionStatisticsMonthImg from "./page/manager/SafetyInspectionStatisticsMonthImg";


function App() {
  console.log(`

   %c███████╗ █████╗ ██╗   ██╗ ██████╗ 
   %c██╔════╝██╔══██╗██║   ██║██╔════╝ 
   %c███████╗███████║██║   ██║██║  ███╗
   %c╚════██║██╔══██║╚██╗ ██╔╝██║   ██║
   %c███████║██║  ██║ ╚████╔╝ ╚██████╔╝
   %c╚══════╝╚═╝  ╚═╝  ╚═══╝   ╚═════╝ 
  `,"color:#F84c0b","color:#f5652f","color:#fd8153","color:#fa936d","color:#fda787","color:#fda787",)
  return (
    <Router>
      <Routes>
        {/* 관리자 */}
        <Route path="/" element={<ManagerLogin/>}></Route> {/* 관리자 로그인페이지 */}
        <Route path="/manager" element={<MainManager/>}></Route> {/* 관리자 메인페이지 */}
        <Route path="/eduMain" element={<SafetyEducationMain/>}></Route>{/* 관리자 안전교육페이지 */}
        <Route path="/edudetails/:eduId" element={<SafetyEduDetails/>}></Route>{/* 관리자 안전교육상세*/}
        <Route path="/edureg" element={<SafetyEduReg/>}></Route>{/* 관리자 안전교육 등록페이지 */}
        <Route path="/edureg/:eduId" element={<SafetyEduReg/>}></Route>{/* 관리자 안전교육 등록페이지 */}
        <Route path="/managerinspection" element={<SafetyManagerInspection/>}></Route>{/* 관리자 안점점검 페이지 */}
        <Route path="/inspection" element={<SafetyInspection/>}></Route>{/* 관리자 안점점검 페이지 */}
        <Route path="/attenstatus/:eduId" element={<AttenStatus/>}></Route>{/* 관리자 출석현황 */}
        <Route path="/training/:eduId" element={<TrainingReport/>}></Route>{/* 관리자 출석현황 */}

        <Route path="/reginfo" element={<ReferenceInfo/>}></Route> {/* 관리자 기준정보페이지 */}

        <Route path="/sendEmail" element={<EmailForm/>}></Route> {/* 이메일 */}
        <Route path="/edustatistics" element={<EduStatics/>}></Route>{/* 관리자 안전교육통계*/}
        <Route path="/edustatistics/atten" element={<EduAttenStatics/>}></Route>{/* 관리자 안전교육 참가자통계*/}
        <Route path="/frequentinspection" element={<FrequentIns/>}></Route>{/* 관리자 수시점검 현황*/}

        
        
        

        {/*다인 추가함 */}
        <Route path="/inspection/statistics/yearimg" element={<SafetyInspectionStatisticsYearImg/>}></Route>{/* 관리자 수시점검 연도 상세 분석 통계 대시보드*/}
        <Route path="/inspection/statistics/monthimg" element={<SafetyInspectionStatisticsMonthImg/>}></Route>{/* 관리자 수시점검 월별통계 대시보드*/}


        {/* 사용자  */}
        <Route path="/user" element={<UserMain/>}></Route>  {/* 사용자 메인페이지*/}
        <Route path="/userattendance/register/:eduId" element={<UserSafetyEduAttendance/>}></Route>{/* 사용자 사원출석페이지 */}


        {/* 사용자 수시점검 */}
        <Route path="/special/:masterdataPart/:masterdataFacility" element={<UserSelectInspection/>}></Route>  {/* 사용자 점검선택페이지*/}
        <Route path="/special/list/:masterdataPart/:masterdataFacility" element={<Userfrequent/>}></Route>  {/* 사용자 수시점검 설비별 리스트페이지*/}
        <Route path="/special/new/:masterdataPart/:masterdataFacility" element={<UserfrequentReg/>}></Route>{/* 사용자 수시점검등록페이지 */}
        <Route path="/userfrequentreg" element={<UserfrequentReg/>}></Route>{/* 수시점검 등록페이지 */}
        <Route path="/special/detail/:speId" element={<UserFrequentDetails/>}></Route>{/* 수시점검 상세페이지 */}

        {/* 정기점검 */}
        <Route path="/regular/new" element={<UserRegularReg/>}></Route>{/* 정기점검 등록 */}
        <Route path="/regular" element={<RegularMain/>}></Route>{/* 관리자,사용자 정기점검 목록 */}




        <Route path="/404" element={<Error/>}></Route> {/* 에러 */}
      </Routes>
      <ToastContainer/>
    </Router>
    
  );
}

export default App;