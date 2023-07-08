import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./style/reset.css";
import ManagerLogin from "./page/ManagerLogin";
import Main from "./page/Main";
import ReferenceInfo from "./page/ReferenceInfo";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main/>}></Route>
        <Route path="/managerlogin" element={<ManagerLogin/>}></Route>
        <Route path="/reinfo" element={<ReferenceInfo/>}></Route>
      </Routes>
    </Router>
    
  );
}

export default App;
