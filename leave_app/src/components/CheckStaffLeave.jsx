import React, { useState, useRef, useEffect, useMemo } from "react";
import Loading from "./Loading";
import { dateCalculatorExcludeWeekend, getFirstAndLastDay } from "../dateMethods";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { gapi, CLIENT_ID, API_KEY, DISCOVERY_DOC, SCOPES } from "../gapi";

const CheckStaffLeave = () => {
  // neeed to fix Ache cannot see the leave
  const colRef = collection(db, "staff");
  // Selected staff from options
  const select = useRef("select");
  const [counterStaff, setCounterStaff] = useState(0)
  const [numberOfLeaves, setNumberOfLeaves] = useState([
    { name: "test", numberOfLeave: 1, whichDays: "" },
  ]);
  const [staffArr, setStaffArr] = useState([]);
  const [loading, setLoading] = useState(true);
  // On load of page, fill staffArr with list of staffs from DB
  useEffect( () => {
    getDocs(colRef)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setStaffArr((staffArr) => [...staffArr, doc.data().name]);
          });
          setLoading(false)
        })
  }, []);

  // Loads only when user has selected a new staff member from dropdown
  useEffect( () => {
        staffArr.forEach((staff) => {
          setNumberOfLeaves((numberOfLeaves) => [
            ...numberOfLeaves,
            {
              name: staff,
              numberOfLeave: 0,
              whichDays : "None"
            },
          ]);
        });    
        // use loading dependency here to ensure that data in numberOfLeaves is loaded when DOM is loaded
        // use counterStaff dependency here to ensure that when this value changes, 
        // data is loaded in haveTakenLeave
  }, [counterStaff, loading])

  // Display the content upon change in counterStaff value
  // Change in counterStaff value signifies data is changed in numberOfLeave object
  const haveTakenLeave = useMemo( () => {
    // find specific staff that has been selected
    const staff = numberOfLeaves.find((obj) => obj.name === select.current.value);
    if (staff) {
    return (
        <>  
            <tr>
                <td> {staff.numberOfLeave} </td>
                <td> {staff.whichDays} </td>
            </tr>
        </>
        
    )
    }
    else {
        return (
            <>
                <tr>
                </tr>
            </>
        )
    }
  }, [counterStaff])

  const handleGoogle = (e) => {
    e.preventDefault();

    gapi.load("client:auth2", () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOC,
        scope: SCOPES,
        plugin_name: "leave-management-371308",
      });

      gapi.client.load("calendar", "v3", () => {
        console.log("Added");
      });

      gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(() => {
          // Get all the events in a month

          // First and last day of the current month
          const firstDate = getFirstAndLastDay()[0];
          const lastDate = getFirstAndLastDay()[1];
          let request = gapi.client.calendar.events.list({
            calendarId: "primary",
            timeMin: `${firstDate}T00:00:00+08:00`,
            timeMax: `${lastDate}T23:59:59+08:00`,
          });

          request.execute((event, res) => {
            // Array containing all events in the month
            const resArr = JSON.parse(res)[0].result.items;
            resArr.forEach((item) => {
              // Name of the staff
              const staff = item.summary.split("(")[0];
              // Start and end Date
              const startDate = (item.start.dateTime.split("T")[0].split(":"))[0];
              const endDate = (item.end.dateTime.split("T")[0].split(":"))[0];

              // Calculate the number of days from the two given dates
              const days_taken = dateCalculatorExcludeWeekend(new Date(startDate), new Date(endDate));

              // Start and end day eg. 10/11/12
              let startDay = parseInt(startDate.split("-")[2]);
              let endDay = parseInt(endDate.split("-")[2]);

              // Number of days between endDay and startDay
              // let number_of_days = endDay - startDay;
              let whichDays = "";

              days_taken.forEach((item) => {
                if (whichDays === "") {
                  whichDays = `${whichDays} ${item.getDate()}`
                } else {
                  whichDays = `${whichDays}, ${item.getDate()}`;
                }
              })

              // Check if the selected staff is equal to the one in the loop/check whether staff exists

              const number_of_days_taken = days_taken.length;
              if (select.current.value === staff) {
                if (numberOfLeaves.find((obj) => obj.name === select.current.value)) {
                  // Assign values to the object containing the staff information
                  numberOfLeaves.find( (obj) => obj.name === select.current.value).numberOfLeave = number_of_days_taken;
                  numberOfLeaves.find( (obj) => obj.name === select.current.value).whichDays = whichDays;
                  // Trigger data to be shown (haveTakenLeave)
                  setCounterStaff(counterStaff + 1);
                } else {
                  console.log("Error loading staff leaves.");
                }
              } else {
                setCounterStaff(counterStaff + 1);
              }
            });

          });
        });
    });
  };

  const staffList = staffArr.map((staff, index) => {
    return <option key={index} value={staff}> {staff} </option>;
  });

  const handleChangeMonthViewLeave = () => {
    // need to pass the current selected month as a parameter to the getFirstAndLastDay function
    // handleGoogle()
  }

  return (
    <div className="container">
      {loading && <Loading />}
      <p> Add a dropdown selection to allow change of month to view the leave</p>
      <h2 className="page-heading"> Leave Overview: </h2>
      <label name="staff" htmlFor="staff">
        <select
          name="staff"
          id="staff"
          ref={select}
          onChange={handleGoogle}
        >
        <option defaultValue=""></option>
          {staffList}
        </select>
      </label>

      <label name="month" htmlFor="month">
        <select
          name="month"
          id="month"
          ref={select}
          onChange={handleChangeMonthViewLeave}
        >
        <option defaultValue=""></option>
          {staffList}
        </select>
      </label>

      <table className="staff-table">
        <tbody>
          <tr>
            <th> Number of leave(s) taken</th>
            <th> Dates taken </th>
          </tr>
          {haveTakenLeave}
        </tbody>
      </table>
    </div>
  );
};

export default CheckStaffLeave;
