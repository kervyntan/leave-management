import React, { useEffect, useState } from "react";
import AddStaff from "./AddStaff";
import Loading from "./Loading";
import Button from "./Button";
import { Modal } from "@mantine/core";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { gapi, CLIENT_ID, API_KEY, DISCOVERY_DOC, SCOPES } from "../gapi";

const Home = () => {
  // add a cross that deletes the staff from the list
  const [opened, setOpened] = useState(true);
  const [staffDetails, setStaffDetails] = useState([]);
  const [staffOnLeave, setStaffOnLeave] = useState([]);
  const [result, setResult] = useState([{ result: { items: [] } }]);
  const [loading, setLoading] = useState(true);
  const colRef = collection(db, "staff");
  const numberOfStaff = staffDetails.length;
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

        //   gapi.load("client:auth2", () => {
        //     // init with credentials
        //     gapi.client.init({
        //       apiKey: API_KEY,
        //       clientId: CLIENT_ID,
        //       discoveryDocs: DISCOVERY_DOC,
        //       scope: SCOPES,
        //       plugin_name: "leave-management-371308",
        //     });

        //     gapi.client.load("calendar", "v3", () => {
        //       // console.log("added!")
        //     });
        //     // triggers popup to sign in to google
        //     gapi.auth2
        //       .getAuthInstance()
        //       .signIn()
        //       .then(() => {
        //         let request = gapi.client.calendar.events.list({
        //           calendarId: "kervyntan@gmail.com",
        //           timeMax: "2022-12-20T00:00:00+08:00",
        //           maxResults: 2,
        //         });

        //         request.execute((event, res) => {
        //           // window.open(event.htmlLink)
        //           // must parse the JSON response otherwise cannot access array
        //           setResult(JSON.parse(res));
        //         });
        //       });
        //   });
        })
        // use this then to catch when data is fetched**
        .then(() => {
          setLoading(false);
        });
    }, 500);
  }, []);
  // need to only fetch those who are on leave from today onwards
  const onLeave = result[0].result.items.map((person) => {
    return (
      <>
        <tr key={Math.random}>
          <td className="name">
            <p className="name_para">{person.summary}</p>
          </td>
          <td className="name">
            <p className="name_para">
              {person.start.dateTime.split("T")[0]} -{" "}
              {person.end.dateTime.split("T")[0]}
            </p>
          </td>
        </tr>
      </>
    );
  });

  const staff = staffDetails.map((person) => {
    return (
      <>
        <tr key={Math.random}>
          <td className="name">
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
        </tr>
      </>
    );
  });

  console.log(numberOfStaff)
  console.log(staffDetails)

  const handleDeleteStaff = () => {

  }

  return (
    <>
      {loading && <Loading />}
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        title="Introduce Yourself!"
      >
        Are you sure you want to delete this staff?
        <br />
        <Button class="delete-staff-btn btn" text="Delete Staff" onClick={handleDeleteStaff} />
      </Modal>
      <div className="container">
        <table className="staff">
          <tbody>
            <tr>
              <th> Name </th>
              <th> Annual </th>
              <th> Compassionate </th>
              <th> No Pay </th>
              <th> Paternity </th>
              <th> Maternity </th>
            </tr>
            {staff}
          </tbody>
        </table>

        <table className="on-leave">
          <tbody>
            <tr>
              <th> Name </th>
              <th> Duration </th>
            </tr>
            {onLeave}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Home;
