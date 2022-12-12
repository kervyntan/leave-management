import "./assets/main.css";
import Home from "./components/Home";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Navbar from "./components/Navbar";
import AddStaff from "./components/AddStaff";
import ApplyLeave from "./components/ApplyLeave";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <div className="container">
      <Routes>
        <Route index element={<Home />} />
        <Route path="/addstaff" element={<AddStaff />} />
        <Route path="/applyleave" element={<ApplyLeave />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
