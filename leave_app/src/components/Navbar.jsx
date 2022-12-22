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
    checkStaffLeave : false,
    settings : false
  })

  // const indicateCurrentPage = (page) => {
  //   const currPath = page.split("/")[1];
  //   for (let key in selectedTab) {
  //     selectedTab[key] = false;
  //   }

  //   if (currPath === "/") {
  //     console.log(selectedTab["home"])
  //     selectedTab["home"] = true;
  //   } else {
  //     console.log(selectedTab[currPath])
  //     console.log(currPath)
  //     selectedTab[currPath] = true;
  //     console.log(selectedTab)
  //   }
  // }
  useEffect(() => {
    // indicateCurrentPage(location.pathname)
    // for (let key in selectedTab) {
    //   selectedTab[key] = false;
    // }

    if (location.pathname === "/") {
        setSelectedTab({
            home : true,
            applyLeave : false,
            addStaff : false,
            checkStaffLeave : false,
            settings : false
        })
    } else if (location.pathname === "/applyleave") {
        setSelectedTab({
            home : false,
            applyLeave : true,
            addStaff : false,
            checkStaffLeave : false,
            settings : false
        })
    } else if (location.pathname === "/addstaff") {
        setSelectedTab({
            home : false,
            applyLeave : false,
            addStaff : true,
            checkStaffLeave : false,
            settings : false
        })
    } else if (location.pathname === "/checkstaffleave") {
        setSelectedTab({
            home : false,
            applyLeave : false,
            addStaff : false,
            checkStaffLeave : true,
            settings : false
        })
    } else if (location.pathname === "/settings") {
        setSelectedTab({
            home : false,
            applyLeave : false,
            addStaff : false,
            checkStaffLeave : false,
            settings : true
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
      <Link to="/settings" className={selectedTab.settings ?  "selected" : "" }>
        Settings
      </Link>
    </div>
  );
};

export default Navbar;
