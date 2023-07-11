import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./style/reset.css";
import ManagerLogin from "./page/ManagerLogin";
import MainManager from "./page/MainManager";
import ReferenceInfo from "./page/ReferenceInfo";
import UserMain from "./page/UserMain";
import SafetyEducationMain from "./page/SafetyEducationMain";
import SafetyInspection from "./page/SafetyInspection";
import Error from "./page/error";
import SafetyEduReg from "./page/SafetyEduReg";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/manager" element={<MainManager/>}></Route> 
        <Route path="/user" element={<UserMain/>}></Route>
        <Route path="/eduMain" element={<SafetyEducationMain/>}></Route>
        <Route path="/edureg" element={<SafetyEduReg/>}></Route>
        <Route path="/inspection" element={<SafetyInspection/>}></Route>
        <Route path="/" element={<ManagerLogin/>}></Route>
        <Route path="/reinfo" element={<ReferenceInfo/>}></Route>
        <Route path="/404" element={<Error/>}></Route>
      </Routes>
    </Router>
    
  );
}

export default App;
