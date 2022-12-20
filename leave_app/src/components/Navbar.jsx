import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();  
  const [selectedTab, setSelectedTab] = useState({
    home : false,
    applyLeave : false,
    addStaff : false,
    checkStaffLeave : false
  })
  useEffect(() => {
    console.log(location.pathname)
    if (location.pathname === "/") {
        setSelectedTab({
            home : true,
            applyLeave : false,
            addStaff : false,
            checkStaffLeave : false
        })
    } else if (location.pathname === "/applyleave") {
        setSelectedTab({
            home : false,
            applyLeave : true,
            addStaff : false,
            checkStaffLeave : false
        })
    } else if (location.pathname === "/addstaff") {
        setSelectedTab({
            home : false,
            applyLeave : false,
            addStaff : true,
            checkStaffLeave : false
        })
    } else if (location.pathname === "/checkstaffleave") {
        setSelectedTab({
            home : false,
            applyLeave : false,
            addStaff : false,
            checkStaffLeave : true
        })
    }
  }, [location.pathname]);
  return (
    <div className="nav">
      <Link to="/" className={selectedTab.home ?  "selected" : "" }>
        Home
      </Link>
      <Link to="/applyleave" className={selectedTab.applyLeave ?  "selected" : "" }>
        Apply Leave
      </Link>
      <Link to="/addstaff" className={selectedTab.addStaff ?  "selected" : "" }>
        Add Staff
      </Link>
      <Link to="/checkstaffleave" className={selectedTab.checkStaffLeave ?  "selected" : "" }>
        Check Staff
      </Link>
    </div>
  );
};

export default Navbar;
