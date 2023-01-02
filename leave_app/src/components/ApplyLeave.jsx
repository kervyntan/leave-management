import React, { useRef, useEffect, useState } from "react";
import Button from "./Button";
import Loading from "./Loading";
import { compareNames } from "../compareNames";
import { Card, Modal, Text, Checkbox } from "@mantine/core";
import { RangeCalendar } from '@mantine/dates';
import { dateCalculatorExcludeWeekendNoCurrentMonth } from "../dateMethods";
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
  // Allow for person to take one leave only (so scan the 1st index of the array)**
  // If it is null upon submission, then assume that end Date and start Date is the same
  // 8.30am - 12.35pm
  // 1.30pm - 5.35pm
  const reason = useRef("reason");
  const name = useRef("name");
  const leave = useRef("leave");
  const leave_structure = useRef("");
  let currentMonth = new Date().getMonth();
  let currentLeave = "";
  // let dates = {}
  const [datesObj, setDatesObj] = useState({}) 
  const colRefStaff = collection(db, "staff");
  const docRefLeaveTypes = doc(db, "showLeaveTypes", "showLeaveTypes");
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [canTakeLeave, setCanTakeLeave] = useState(true);
  const [invalidDuration, setInvalidDuration] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([])
  const [showHalfDayApplication, setShowHalfDayApplication] = useState(false);
  const [errorModal, setErrorModal] = useState(false);  
  // pass in predefined date (null dates)
  const [leaveDuration, setLeaveDuration] = useState([ null, null ]);
  // Dates in ISO Format eg. YYYY-MM-DD
  let startDate = "";
  let endDate = "";
  let halfDays = "";
  if (leaveDuration.find(val => val === null) === undefined) {
    const daysChosen = []
    // Create new date instances to prevent overwriting values in leaveDuration array
    // When setDate method is used
    daysChosen[0] = new Date(leaveDuration[0]);
    daysChosen[1] = new Date(leaveDuration[1]);
    daysChosen[0].setDate(daysChosen[0].getDate() + 1)
    daysChosen[1].setDate(daysChosen[1].getDate() + 1)
    // Assign startDate and endDate new values of chosen dates
    startDate = daysChosen[0].toISOString().split("T")[0];
    endDate = daysChosen[1].toISOString().split("T")[0];
    const datesArr = dateCalculatorExcludeWeekendNoCurrentMonth(new Date(startDate), new Date(endDate))
    datesArr.forEach((day, index) => {
      // Get date in terms of 1,2,... 28, 29, 30, 31
      const dayToDate = day.getDate()
      // Create object of options for the checkboxes
      // dates = {...dates, [dayToDate] : false }
      // if (index === datesArr.length - 1) {
      //   setDatesObj(dates);
      // }
    })
  
    halfDays = datesArr.map((day) => {
        const date = day.getDate();
        return (
          <Checkbox label={date} checked={datesObj[date]} 
          onClick={() => { 
            setDatesObj({...datesObj, [date] : !datesObj[date] })
          }}
          />
        )
    })
  }

  if (loading) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }

  useEffect( () => {
    console.log(datesObj)
  }, [datesObj])
   
  useEffect(() => {
    setTimeout(() => {
      getDocs(colRefStaff)
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
  
  useEffect( () => {
    setTimeout( () => {
      getDoc(docRefLeaveTypes)
      .then( (doc) => {
        const keys = Object.keys(doc.data());
        keys.forEach( (leaveType) => {
          if (doc.data()[leaveType]) {
            setLeaveTypes((leaveTypes) => [...leaveTypes, leaveType])
          }
        })
        // sort types of leaves lexicographically
      })
      .then( () => {
        setLoading(false);
      })
    }, 500)
  }, []);

  const handleLeaveStructure = (e) => {
    if (e.target.value === "Half Day Leave") {
      setShowHalfDayApplication(true);
    } else {
      setShowHalfDayApplication(false);
    }
  }

  const handleAddLeave = (e) => {
    e.preventDefault();
    const formValues = [
      name.current.value,
      reason.current.value,
      leave.current.value
    ]
    if (formValues.find(val => val === "" ) === "") {
      setErrorModal(true);
   } else {
      const inputEndDate = new Date(endDate);
      const inputStartDate = new Date(startDate);
      currentMonth = new Date(startDate).getMonth();
      if (inputEndDate < inputStartDate) {
        setInvalidDuration(true);
      } else {
    // staff name

    // Allows person to take leave on 1 day
      if (leaveDuration[1] === null) {
        const day_taken = []
        day_taken[0] = leaveDuration[0];
        day_taken[0].setDate(day_taken[0].getDate() + 1);
        startDate = day_taken[0].toISOString().split("T")[0];
        endDate = startDate;
      }
      // keys for half day selection
      const keysHalfDays = Object.keys(datesObj);
      const numberOfHalfDays = [];
      keysHalfDays.forEach( (date) => {
        if (datesObj[date]) {
          numberOfHalfDays.push(date);
        }
      })
      const staffName = name.current.value;
      const docRef = doc(db, "staff", staffName);
      // the type of leave they took
      const leaveType = (leave.current.value + "_leave").toLowerCase();
      // number of days taken/selected by the staff 
      let days_taken = 
      dateCalculatorExcludeWeekendNoCurrentMonth(new Date(startDate), new Date(endDate)).length 
      - (numberOfHalfDays.length * 0.5);

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
                  let whichHalfDays = "";
                  if (keysHalfDays.length > 0) {
                    keysHalfDays.forEach( (date, index) => {
                      if (datesObj[date] && whichHalfDays === "") {
                        whichHalfDays = whichHalfDays + `${date}`;
                      } else if (datesObj[date]) {
                        whichHalfDays = whichHalfDays + `,${date}`;
                      }

                      if (index === keysHalfDays.length - 1) {
                        whichHalfDays = "- " + whichHalfDays + " on Half Day";
                      }
                    })
                  }
                  let event = {
                    summary: `${name.current.value}${leaveTxt}${whichHalfDays}`,
                    description: `${leave.current.value}`,
                    start: {
                      dateTime: `${startDate}T00:00:00+08:00`,
                      timeZone: "Asia/Singapore",
                    },
                    end: {
                      dateTime: `${endDate}T23:59:59+08:00`,
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
  }
  };

  const staffNames = staffList.map((staff) => {
    return <option value={staff}> {staff} </option>;
  });

  const typesOfLeave = leaveTypes.sort(compareNames).map( (leave) => {
    return <option value={leave}> {leave} </option>
  })

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

      <Modal
        centered
        opened={errorModal}
        onClose={() => setErrorModal(false)}
        title="Error adding staff."
      >
        Please ensure none of the fields are empty.
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

        <label htmlFor="leave_structure"> Leave Structure: </label>
        <select ref={leave_structure} id="leave_structure" name="leave_structure" onChange={handleLeaveStructure} required>
          <option value="Full Day Leave"> Full Day Leave </option>
          <option value="Half Day Leave"> Half Day Leave </option>
        </select>

        <label htmlFor="type"> Type of Leave: </label>
        <select
          ref={leave}
          id="type"
          name="type"
          placeholder="Type of Leave: "
          required
        >
          {/* Cannot hardcode */}
          {typesOfLeave}
        </select>

        <label htmlFor="leave_duration"> Leave Duration: </label>
        <RangeCalendar value={leaveDuration} onChange={setLeaveDuration} />

        {showHalfDayApplication && 
        <div className="grid grid-template-4fr">  
          {halfDays}
        </div>
        }
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
