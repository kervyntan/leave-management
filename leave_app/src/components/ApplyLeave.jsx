import React, { useRef, useEffect, useState } from "react";
import Button from "./Button";
import Loading from "./Loading";
import { db } from "../firebase";
import { collection, getDocs, query, updateDoc, doc, getDoc } from "firebase/firestore";
import { gapi, CLIENT_ID, API_KEY, DISCOVERY_DOC, SCOPES } from "../gapi";

const ApplyLeave = () => {
  const startDate = useRef("startDate");
  const endDate = useRef("endDate");
  const reason = useRef("reason");
  const name = useRef("name");
  const leave = useRef("leave");
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);

  if (loading) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }

  useEffect(() => {
    getDocs(query(collection(db, "staff")))
    .then((items) => {
      items.forEach((doc) => {
        setStaffList([...staffList, doc.id]);
      });
    })
    .then( () => {
        setLoading(false)
    })
  }, []);

  const handleAddLeave = (e) => {
    e.preventDefault();
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
          let event = {
            summary: `${name.current.value} - ${reason.current.value}`,
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
        .then( () => {
            // Deducts the leave from the specific staff

            // staff name
            const staffName = name.current.value;

            // the type of leave they took
            const leaveType = (leave.current.value +"_leave").toLowerCase();
            const docRef = doc(db, "staff", staffName);

            // Calculation of leave duration
            let start = new Date(startDate.current.value);
            let end = new Date(endDate.current.value);
            let diff_in_time = end.getTime() - start.getTime();
            let diff_in_days = diff_in_time / (1000 * 3600 * 24);

            // fetch the specific document about the staff
            getDoc(docRef)
            .then( (item) => {
                // Find the current amount of leave the person has
                let currentLeave = parseInt(item.data()[leaveType]);
                // Store leave to be changed in new object
                const docData = {}
                docData[leaveType] = currentLeave - diff_in_days + 1;
                updateDoc(docRef, docData)
                .then ( () => {
                    console.log("Successful update of document.")
                })
                .catch ( (error) => {
                    console.log(`Failed to update document. ${error}`)
                })
            })
        })
    });
  };

  const staffNames = staffList.map((staff) => {
    return <option value={staff}> {staff} </option>;
  });

  return (
    <div className="container">
      {loading && <Loading />}
      <p> Need to double check duration of leave value on line 110</p>
      <p> End Date must be greater than Start Date</p>
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
            <select ref={name} id="name" name="name" placeholder="Name of Staff">
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
        <input ref={endDate} id="end" name="duration" type="date" />
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
