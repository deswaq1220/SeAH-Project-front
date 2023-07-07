import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./style/reset.css";
import ManagerLogin from "./page/ManagerLogin";
import Main from "./page/Main";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/managerlogin" element={<ManagerLogin/>}></Route>
        <Route path="/" element={<Main/>}></Route>
      </Routes>
    </Router>
    
  );
}

export default App;
