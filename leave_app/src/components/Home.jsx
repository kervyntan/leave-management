import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import Button from "./Button";
import JsPDF from 'jspdf';
import { compareNames } from "../compareNames";
import close from "../assets/close_icon.png"
import { Modal } from "@mantine/core";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";

const Home = () => {
  // Edit individual values of the leaves in case user keys in wrongly
  // Need to populate all the diff kinds of leave first
  // then populate for each type of leave, how many does each staff have
  // When populating a new type of leave, need to make it 0 first
  // can make the amount of leave you want to populate by default be editable also
  let tableExport = require('table-export');
  const [opened, setOpened] = useState(false);
  const [staffDetails, setStaffDetails] = useState([]);
  const [staffToDelete, setStaffToDelete] = useState();
  const [loading, setLoading] = useState(true);
  const [showDeleteText, setShowDeleteText] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([])
  const [staffKeys, setStaffKeys] = useState([])
  const docShowLeaveTypesRef = doc(db, "showLeaveTypes", "showLeaveTypes")
  const colRef = collection(db, "staff");
  if (loading) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }

  useEffect(() => {
    setTimeout(() => {
      getDocs(colRef)
        .then((querySnapshot) => {
          // console.log(querySnapshot.size)
          querySnapshot.forEach((doc) => {
            console.log(doc.data())
            console.log(Object.keys(doc.data()))
            // Get all keys except the name key of the staffDetails (alredy hardcoded)
            setStaffKeys(Object.keys(doc.data()).filter((item) => item !== "name").sort(compareNames))
            setStaffDetails((staffDetails) => [
              // doc.data() contains all the information about each staff
              // each document represents one staff
              ...staffDetails, doc.data()
            ]); 
          });
          // console.log(Object.keys(staffDetails[0]))
          // setStaffKeys(Object.keys(staffDetails[0]))
        })
        // use this then to catch when data is fetched**
        .then(() => {
          // setStaffKeys(Object.keys(staffDetails[0]))
          setLoading(false);
        });
    }, 500);
  }, [])

  useEffect( () => {
    getDoc(docShowLeaveTypesRef)
    .then( (doc) => {
      // Array of leaves
      const keys = Object.keys(doc.data());
      const obj = {}
      keys.forEach ((leave) => {
        if (doc.data()[leave]) {
           setLeaveTypes((leaveType) => [...leaveType, leave]);
        }
      })
    })
    .then (() => {
      setLoading(false);
    })
  }, [])

  const toggleDeleteStaff = (e) => {
    setOpened(true);
    setStaffToDelete(e.target.className.split("+")[0]);
  }
  const compareStaff = (a,b) => {
    if ( a.name < b.name ) {
      return -1;
    }
    if ( a.name > b.name ) {
      return 1;
    }
    return 0;
  }
  // const staffTest = staffKeys.map((item) => {
  //   if (item === "name") {
  //     return (
  //       <>
  //         <td className={item}>
  //           <p className={`${item} + "_para"`}> {person[item]} </p>
  //         </td>
  //       </>
  //     )
  //   }
  // })
console.log(staffKeys)
// Find a way to fetch data without hitting this error
  const staff = staffDetails.sort(compareStaff).map((person) => {
    const staffTest = staffKeys.map((item) => {
        return (
          <>
            <td className={item}>
              <p className={`${item} + "_para"`}> {person[item]} </p>
            </td>
          </>
        )
    })
    // console.log(staffTest)
    return (
      <>
        <tr key={Math.random}>
          <td className="name column-1">
            <div contentEditable suppressContentEditableWarning={true}>
              <p className="name_para">{person.name}</p>
            </div>
          </td>
          {staffTest}
          {/* <td className="annual_leave">
            <div contentEditable suppressContentEditableWarning={true}>
              <p className="annual_leave_para">{person.annual_leave}</p>
            </div>
          </td>
          <td className="compassionate_leave">
            <div contentEditable suppressContentEditableWarning={true}>
              <p className="compassionate_leave_para">
                {person.compassionate_leave}
              </p>
            </div>
          </td>
          <td className="maternity_leave">
            <div contentEditable suppressContentEditableWarning={true}>
              <p className="maternity_leave_para">{person.maternity_leave}</p>
            </div>
          </td>
          <td className="no_pay_leave">
            <div contentEditable suppressContentEditableWarning={true}>
              <p className="no_pay_leave_para">{person.no_pay_leave}</p>
            </div>
          </td>
          <td className="paternity_leave">
            <div contentEditable suppressContentEditableWarning={true}>
              <p className="paternity_leave_para">{person.paternity_leave}</p>
            </div>
          </td> */}
          <td className="delete">
            <img src={close} className={`${person.name}+ close`} onClick={toggleDeleteStaff} alt="Delete Staff" />
          </td>
        </tr>
      </>
    );
  });

  // each staff object
  // name : 
  // ..._leave
  const handleDeleteStaff = () => {
    setShowDeleteText(true);
    deleteDoc(doc(db, "staff", staffToDelete))
      .then(() => {
        console.log("Staff Deleted.")
        setShowDeleteText(false);
        window.location.reload();
      })
  }

  const tableHeaders = leaveTypes.sort(compareNames).map( (leave) => {
    return (
      <th> {leave} </th>
    )
  })
  
  // Need to dynamically show the leave 

  const generateExcel = () => {
    tableExport('table-staff', 'test', 'xls')
  }

  const generatePDF = () => {
    const report = new JsPDF('portrait', 'pt', 'a3');
    report.html(document.querySelector('#table-staff'))
    .then( () => {
      report.save('staff.pdf');
    })
  }
  console.log(staffDetails)
  return (
    // Reflect the leave that is fetch from db
    <>
    <Button class="generate-excel-btn btn" text="Export as Excel" onClick={generateExcel} />
    <Button class="generate-pdf-btn btn" text="Export as PDF" onClick={generatePDF} />
    <h2 className="page-heading"> List of Staff: </h2>
    {loading 
      ? <Loading />
      : <>
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        title="Delete Staff"
      >
        Are you sure you want to delete this staff?
        <br />
        <Button class="delete-staff-btn btn" text="Delete Staff" onClick={handleDeleteStaff} />
        {showDeleteText && <p> Entry is being deleted. Please wait for the page to reload. </p>}
      </Modal>
      <table className="staff" id="table-staff">
        <tbody>
          <tr>
            <th className="column-1"> Name </th>
            {tableHeaders}
          </tr>
          {staff}
        </tbody>
      </table>
    </>
    }
    </>
  );
};

export default Home;
