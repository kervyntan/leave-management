import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import Button from "./Button";
import JsPDF from 'jspdf';
import { compareNames, compareStaff } from "../compareNames";
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
  // const [leaveTypesFormatted, setLeaveTypesFormatted] = useState([])
  let leaveTypesFormatted = []
  const [staffKeys, setStaffKeys] = useState([])
  const docShowLeaveTypesRef = doc(db, "showLeaveTypes", "showLeaveTypes")
  const colRef = collection(db, "staff");
  if (loading) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }
  // Fix bug where less than the 5 standard leaves are chosen

  useEffect( () => {
    getDoc(docShowLeaveTypesRef)
    .then( (doc) => {
      // Array of leaves
      const keys = Object.keys(doc.data());
      keys.forEach ((leave) => {
        // If the leave is set to True, add it to the array
        if (doc.data()[leave]) {
           setLeaveTypes((leaveType) => [...leaveType, leave]);
          //  setLeaveTypesFormatted((leaveType) => [...leaveType, leave.toLowerCase() + "_leave"])
           leaveTypesFormatted = [...leaveTypesFormatted, leave.toLowerCase() + "_leave"]
        }
      })
  
    })
    .then (() => {
      getDocs(colRef)
        .then((querySnapshot) => {
          // Make sure each staff has every type of leave in the object
          // somehow populate all doc.data() with all the true leave types

          // console.log(querySnapshot.size)
          querySnapshot.forEach((doc) => {
            // Compare keys of each doc.data() with those of the full list of leaveTypes
            // whichever ones are missing
            const keys = Object.keys(doc.data());
            // Compare keys of all the staff info fetched
            const uniqueLeaves = keys.filter( (item) => leaveTypesFormatted.indexOf(item) === -1)
            const uniqueLeaves2 = leaveTypesFormatted.filter( (item) => keys.indexOf(item) === -1)
            // Contains all the types of leaves that the specific person doesn't have in their object
            const totalUniqueLeaves = uniqueLeaves.concat(uniqueLeaves2);

            let appendObj = doc.data();
            if (totalUniqueLeaves.length !== 1) { 
              totalUniqueLeaves.forEach( (item) => {
                // If item is a type of leave, assign it 0   
                console.log(item)
                console.log(leaveTypes)
              //  if ((leaveTypes.find(val => val === item)) === true) {
              // if (leaveTypes.find(val => val === item)) {           
                if (item !== "name") {
                  appendObj = {...appendObj, 
                    [item] : 0
                  }}
              })
          }
            console.log(appendObj)
            setStaffKeys(Object.keys(appendObj).filter((item) => item !== "name").sort(compareNames))
            setStaffDetails((staffDetails) => [
              // doc.data() contains all the information about each staff
              // each document represents one staff
              ...staffDetails, appendObj
            ]); 
          });
        })
    })
        .then( () => {
          setLoading(false);
        })
        .catch( (error) => {
          alert(error)
        })
  }, [])

  const toggleDeleteStaff = (e) => {
    setOpened(true);
    setStaffToDelete(e.target.className.split("+")[0]);
  }

  const staff = staffDetails.sort(compareStaff).map((person) => {
    // Creates the table data
    const staffData = staffKeys.map((item) => {
        return (
          <>
            <td className={item}>
              <p className={`${item}_para`}> {person[item]} </p>
            </td>
          </>
        )
    })
    return (
      <>
        <tr key={Math.random}>
          <td className="name column-1">
            <div>
              <p className="name_para">{person.name}</p>
            </div>
          </td>
          {staffData}
          <td className="delete">
            <img src={close} className={`${person.name}+ close`} onClick={toggleDeleteStaff} alt="Delete Staff" />
          </td>
        </tr>
      </>
    );
  });

  const handleDeleteStaff = () => {
    setShowDeleteText(true);
    deleteDoc(doc(db, "staff", staffToDelete))
      .then(() => {
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
  return (
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
