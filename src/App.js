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
        <Route path="/inspection" element={<SafetyInspection/>}></Route>{/* 관리자 안점점검 페이지 */}
        <Route path="/reinfo" element={<ReferenceInfo/>}></Route> {/* 관리자 기준정보페이지 */}
        <Route path="/sendEmail" element={<EmailForm/>}></Route> {/* 이메일 */}



        {/* 사용자  */}
        <Route path="/user" element={<UserMain/>}></Route>  {/* 사용자 메인페이지*/}
        {/*<Route path="/userfrequent" element={<Userfrequent/>}></Route>  /!* 사용자 메인페이지*!/*/}
        <Route path="/special/list/:masterdataPart/:masterdataFacility" element={<Userfrequent/>}></Route>  {/* 사용자 메인페이지*/}
        <Route path="/userselectInspection" element={<UserSelectInspection/>}></Route>  {/* 사용자 점검선택페이지*/}
        <Route path="/userattendance/register/:eduId" element={<UserSafetyEduAttendance/>}></Route>{/* 사용자 사원출석페이지 */}
        <Route path="/userfrequentreg" element={<UserfrequentReg/>}></Route>{/* 사용자 사원출석페이지 */}

        
        <Route path="/404" element={<Error/>}></Route> {/* 에러 */}
      </Routes>
      <ToastContainer/>
    </Router>
    
  );
}

export default App;
