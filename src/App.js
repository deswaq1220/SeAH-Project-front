import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./style/reset.css";
import ManagerLogin from "./page/ManagerLogin";
import MainManager from "./page/MainManager";
import ReferenceInfo from "./page/ReferenceInfo";
import UserMain from "./page/UserMain";
import SafetyEducationMain from "./page/SafetyEducationMain";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/manager" element={<MainManager/>}></Route>
        <Route path="/user" element={<UserMain/>}></Route>
        <Route path="/eduMain" element={<SafetyEducationMain/>}></Route>
        <Route path="/managerlogin" element={<ManagerLogin/>}></Route>
        <Route path="/reinfo" element={<ReferenceInfo/>}></Route>
      </Routes>
    </Router>
    
  );
}

export default App;
