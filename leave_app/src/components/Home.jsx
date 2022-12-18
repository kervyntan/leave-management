import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import Button from "./Button";
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
  // Edit individual values
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

  // store the values of the fetched data into localStorage
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

  const staff = staffDetails.map((person) => {
    return (
      <>
        <tr key={Math.random}>
          <td className="name column-1">
            <p className="name_para">{person.name}</p>
          </td>
          <td className="annual_leave">
            <p className="annual_leave_para">{person.annual_leave}</p>
          </td>
          <td className="compassionate_leave">
            <p className="compassionate_leave_para">
              {person.compassionate_leave}
            </p>
          </td>
          <td className="no_pay_leave">
            <p className="no_pay_leave_para">{person.no_pay_leave}</p>
          </td>
          <td className="paternity_leave">
            <p className="paternity_leave_para">{person.paternity_leave}</p>
          </td>
          <td className="maternity_leave">
            <p className="maternity_leave_para">{person.maternity_leave}</p>
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
    .then( () => {
      console.log("Staff Deleted.")
      setShowDeleteText(false);
      window.location.reload();
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
        <h2 className="page-heading"> List of Staff: </h2>
        <table className="staff">
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
