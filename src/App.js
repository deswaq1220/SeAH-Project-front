import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./style/reset.css";
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

function App() {
  return (
    <Router>
      <Routes>
        {/* 관리자 */}
        <Route path="/" element={<ManagerLogin/>}></Route> {/* 관리자 로그인페이지 */}
        <Route path="/manager" element={<MainManager/>}></Route> {/* 관리자 메인페이지 */}
        <Route path="/eduMain" element={<SafetyEducationMain/>}></Route>{/* 관리자 안전교육페이지 */}
        <Route path="/edudetails" element={<SafetyEduDetails/>}></Route>{/* 관리자 안전교육상세*/}
        <Route path="/edureg" element={<SafetyEduReg/>}></Route>{/* 관리자 안전교육 등록페이지 */}
        <Route path="/inspection" element={<SafetyInspection/>}></Route>{/* 관리자 안점점검 페이지 */}
        <Route path="/reinfo" element={<ReferenceInfo/>}></Route> {/* 관리자 기준정보페이지 */}

        {/* 사용자  */}
        <Route path="/user" element={<UserMain/>}></Route>  {/* 사용자 메인페이지*/}
        <Route path="/usereduatten" element={<UserSafetyEduAttendance/>}></Route>{/* 사용자 사원출석페이지 */}
        
        <Route path="/404" element={<Error/>}></Route> {/* 에러 */}
      </Routes>
    </Router>
    
  );
}

export default App;
