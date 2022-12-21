import React, { useEffect, useState, useRef } from "react";
import Loading from "./Loading";
import Button from "./Button";
import JsPDF from 'jspdf';
import close from "../assets/close_icon.png"
import { Modal } from "@mantine/core";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  getDocs,
  doc
} from "firebase/firestore";

const Home = () => {
  // Edit individual values of the leaves in case user keys in wrongly
  // Edit staff button
  // turn all the td values into editable inputs
  let tableExport = require('table-export');
  const name = useRef("");
  const [opened, setOpened] = useState(false);
  const [staffDetails, setStaffDetails] = useState([]);
  const [staffToDelete, setStaffToDelete] = useState();
  const [loading, setLoading] = useState(true);
  const [showDeleteText, setShowDeleteText] = useState(false);
  const colRef = collection(db, "staff");
  if (loading) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }

  useEffect(() => {
    console.log("This has changed.")
  }, [name])

  useEffect(() => {
    setTimeout(() => {
      getDocs(colRef)
        .then((querySnapshot) => {
          // console.log(querySnapshot.size)
          querySnapshot.forEach((doc) => {
            setStaffDetails((staffDetails) => [
              ...staffDetails,
              {
                name: doc.data().name,
                annual_leave: doc.data().annual_leave,
                compassionate_leave: doc.data().compassionate_leave,
                no_pay_leave: doc.data().no_pay_leave,
                paternity_leave: doc.data().paternity_leave,
                maternity_leave: doc.data().maternity_leave,
              },
            ]);
          });
        })
        // use this then to catch when data is fetched**
        .then(() => {
          setLoading(false);

        });
    }, 500);
  }, []);

  const toggleDeleteStaff = (e) => {
    setOpened(true);
    setStaffToDelete(e.target.className.split("+")[0]);
  }
  
  const compareNames = (a,b) => {
    if ( a.name < b.name ) {
      return -1;
    }
    if ( a.name > b.name ) {
      return 1;
    }
    return 0;
  }

  const staff = staffDetails.sort(compareNames).map((person) => {
    return (
      <>
        <tr key={Math.random}>
          <td className="name column-1">
            <div contentEditable suppressContentEditableWarning={true}>
              <p ref={name} className="name_para">{person.name}</p>
            </div>
          </td>
          <td className="annual_leave">
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
          <td className="no_pay_leave">
            <div contentEditable suppressContentEditableWarning={true}>
              <p className="no_pay_leave_para">{person.no_pay_leave}</p>
            </div>
          </td>
          <td className="paternity_leave">
            <div contentEditable suppressContentEditableWarning={true}>
              <p className="paternity_leave_para">{person.paternity_leave}</p>
            </div>
          </td>
          <td className="maternity_leave">
            <div contentEditable suppressContentEditableWarning={true}>
              <p className="maternity_leave_para">{person.maternity_leave}</p>
            </div>
          </td>
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
        console.log("Staff Deleted.")
        setShowDeleteText(false);
        window.location.reload();
      })
  }

  const generateExcel = () => {
    tableExport('table-staff', 'test', 'xls')
  }

  const generatePDF = () => {
    const report = new JsPDF('portrait', 'pt', 'a3');
    report.html(document.querySelector('#table-staff'))
    .then( () => {
      report.save('report.pdf');
    })
  }

  return (
    <>
      {loading && <Loading />}
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
      <Button class="generate-excel-btn btn" text="Export as Excel" onClick={generateExcel} />
      <Button class="generate-pdf-btn btn" text="Export as PDF" onClick={generatePDF} />
      <h2 className="page-heading"> List of Staff: </h2>
      <table className="staff" id="table-staff">
        <tbody>
          <tr>
            <th className="column-1"> Name </th>
            <th> Annual </th>
            <th> Compassionate </th>
            <th> No Pay </th>
            <th> Paternity </th>
            <th> Maternity </th>
          </tr>
          {staff}
        </tbody>
      </table>
    </>
  );
};

export default Home;
