import "./assets/main.css";
import Home from "./components/Home";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Navbar from "./components/Navbar";
import AddStaff from "./components/AddStaff";
import ApplyLeave from "./components/ApplyLeave";
import CheckStaffLeave from "./components/CheckStaffLeave";

function App() {
  
    // need to have a home dashboard
    // form available to add the person's leaves
    // Form -> fields for each type of leave, name of the person
    // Another form that will allow for application of leave
    // 2nd form -> how many days leave (need a date picker), reason for leave, name of the person
    // Upon submission, that name will be affected in the leave, and the subsequent leave 
    // will be deducted 
    // need to count the number of days between start date and end date of date picker** (for deduction)
    // if person has 0 days of that leave, cannot allow them to submit the form'
  return (
    <BrowserRouter>
    <Navbar />
    <div className="container">
      <Routes>
        <Route index element={<Home />} />
        <Route path="/addstaff" element={<AddStaff />} />
        <Route path="/applyleave" element={<ApplyLeave />} />
        <Route path="/checkleavestaff" element={<CheckStaffLeave />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
