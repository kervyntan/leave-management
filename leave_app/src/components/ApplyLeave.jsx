import React, { useRef, useEffect, useState } from "react";
import Button from "./Button";
import Loading from "./Loading";
import { Modal } from "@mantine/core";
import { dateCalculatorExcludeWeekend } from "../dateMethods";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { gapi, CLIENT_ID, API_KEY, DISCOVERY_DOC, SCOPES } from "../gapi";

const ApplyLeave = () => {
  const startDate = useRef("startDate");
  const endDate = useRef("endDate");
  const reason = useRef("reason");
  const name = useRef("name");
  const leave = useRef("leave");
  let currentLeave = "";
  const colRef = collection(db, "staff");
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [canTakeLeave, setCanTakeLeave] = useState(true);
  const [invalidDuration, setInvalidDuration] = useState(false);

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
            setStaffList((staffList) => [...staffList, [doc.data().name]]);
          });
        })
        // use this then to catch when data is fetched**
        .then(() => {
          setLoading(false);
        });
    }, 500);
  }, []);

  const handleAddLeave = (e) => {
    e.preventDefault();
    const inputEndDate = new Date(endDate.current.value);
    const inputStartDate = new Date(startDate.current.value);
    if (inputEndDate < inputStartDate) {
      setInvalidDuration(true);
    } else {
    // staff name
    const staffName = name.current.value;
    const docRef = doc(db, "staff", staffName);
    // the type of leave they took
    const leaveType = (leave.current.value + "_leave").toLowerCase();
    // number of days taken/selected by the staff 
    let days_taken = dateCalculatorExcludeWeekend(new Date(startDate.current.value), new Date(endDate.current.value)).length;
    getDoc(docRef).then((item) => {
      // Find the current amount of leave the person has
      currentLeave = parseInt(item.data()[leaveType])
    })
      .then(() => {
        if (days_taken > currentLeave) {
          setCanTakeLeave(false);
        } else {
          // load the auth
          gapi.load("client:auth2", () => {
            console.log("Client loaded");

            // init with credentials
            gapi.client.init({
              apiKey: API_KEY,
              clientId: CLIENT_ID,
              discoveryDocs: DISCOVERY_DOC,
              scope: SCOPES,
              plugin_name: "leave-management-371308",
            });

            gapi.client.load("calendar", "v3", () => {
              console.log("added!");
            });
            // triggers popup to sign in to google
            gapi.auth2
              .getAuthInstance()
              .signIn()
              .then(() => {
                const leaveTxt = "(Leave)"
                let event = {
                  summary: `${name.current.value}${leaveTxt} - ${reason.current.value}`,
                  description: `${leave.current.value}`,
                  start: {
                    dateTime: `${startDate.current.value}T00:00:00+08:00`,
                    timeZone: "Asia/Singapore",
                  },
                  end: {
                    dateTime: `${endDate.current.value}T23:59:59+08:00`,
                    timeZone: "Asia/Singapore",
                  },
                  reminders: {
                    useDefault: false,
                    overrides: [
                      { method: "email", minutes: 24 * 60 },
                      { method: "popup", minutes: 10 },
                    ],
                  },
                };
                let request = gapi.client.calendar.events.insert({
                  calendarId: "primary",
                  resource: event,
                });

                request.execute((event, res) => {
                  window.open(event.htmlLink);
                  console.log(res);
                });
              })
              .then(() => {
                // Deducts the leave from the specific staff

                // fetch the specific document about the staff
                getDoc(docRef).then((item) => {
                  // Store the type of leave that has been taken in new object
                  const docData = {};
                  docData[leaveType] = currentLeave - days_taken;
                  updateDoc(docRef, docData)
                    .then(() => {
                      console.log("Successful update of document.");
                    })
                    .catch((error) => {
                      console.log(`Failed to update document. ${error}`);
                    });
                });
              });
          })
        }
      })
    }
  };

  const staffNames = staffList.map((staff) => {
    return <option value={staff}> {staff} </option>;
  });

  console.log(staffNames);

  return (
    <div className="container">
      {loading && <Loading />}
      <Modal
        centered
        opened={!canTakeLeave}
        onClose={() => setCanTakeLeave(true)}
        title="Error adding staff."
      >
        The staff you selected has 0 of this leave left. Please try again with another type of leave.
        <br />
        Click away to continue.
      </Modal>

      <Modal
        centered
        opened={invalidDuration}
        onClose={() => setInvalidDuration(false)}
        title="Error in applying leave."
      >
        End Date must be after Start Date (vice-versa).
        <br />
        Click away to continue.
      </Modal>
      <form className="apply-leave-form">
        {staffList.length === 0 && (
          <>
            <label htmlFor="name"> Name: </label>
            <input ref={name} id="name" name="name" placeholder="Name: " />
          </>
        )}

        {staffList.length > 0 && (
          <>
            <label htmlFor="name"> Name: </label>
            <select ref={name} id="name" name="name">
              {staffNames}
            </select>
          </>
        )}
        <label htmlFor="reason"> Reason for Leave: </label>
        <input
          ref={reason}
          id="reason"
          name="reason"
          placeholder="Reason for Leave: "
          required
        />

        <label htmlFor="type"> Type of Leave: </label>
        <select
          ref={leave}
          id="type"
          name="type"
          placeholder="Type of Leave: "
          required
        >
          {/* Cannot hardcode */}
          <option value="Annual"> Annual </option>
          <option value="Compassionate"> Compassionate </option>
          <option value="No_Pay"> No Pay </option>
          <option value="Paternity"> Paternity </option>
          <option value="Maternity"> Maternity </option>
        </select>

        <label htmlFor="start"> Start Date </label>
        <input
          ref={startDate}
          id="start"
          name="duration"
          type="date"
          required
        />

        <label htmlFor="end"> End Date </label>
        <input ref={endDate} id="end" name="duration" type="date" required/>
        <Button
          onClick={handleAddLeave}
          class="form-btn"
          text="Apply Leave"
          required
        />
      </form>
    </div>
  );
};

export default ApplyLeave;
