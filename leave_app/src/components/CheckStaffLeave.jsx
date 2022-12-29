import React, { useState, useRef, useEffect, useMemo } from "react";
import Loading from "./Loading";
import { dateCalculatorExcludeWeekend, getFirstAndLastDay } from "../dateMethods";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { gapi, CLIENT_ID, API_KEY, DISCOVERY_DOC, SCOPES } from "../gapi";
import { GoogleAuthProvider } from "firebase/auth";

const CheckStaffLeave = () => {
  // Need to fix dates shown static
  // Need to see th
  const colRef = collection(db, "staff");
  // Selected staff from options
  const selectRef = useRef("select");
  const monthRef = useRef("")
  let counter = 0;
  // Current Date
  const current = new Date();
  // First and last day of the current month
  let firstDate = getFirstAndLastDay()[0];
  let firstDateISO = new Date(firstDate).toISOString();
  let lastDate = getFirstAndLastDay()[1];
  let lastDateISO = new Date(lastDate).toISOString();
  const allMonths = [
    {
      0: "January"
    },
    {
      1: "February",
    },
    {
      2: "March",
    },
    {
      3: "April",
    },
    {
      4: "May",
    },
    {
      5: "June",
    },
    {
      6: "July",
    },
    {
      7: "August",
    },
    {
      8: "September",
    },
    {
      9: "October",
    },
    {
      10: "November",
    },
    {
      11: "December"
    },
  ]
  const [counterStaff, setCounterStaff] = useState(0)
  const [numberOfLeaves, setNumberOfLeaves] = useState([
    { name: "test", numberOfLeave: 1, whichDays: "" },
  ]);
  const [staffArr, setStaffArr] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMonthSelection, setShowMonthSelection] = useState(false);
  // On load of page, fill staffArr with list of staffs from DB
  useEffect(() => {
    getDocs(colRef)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setStaffArr((staffArr) => [...staffArr, doc.data().name]);
        });
        setLoading(false)
      })
  }, []);

  // Loads only when user has selected a new staff member from dropdown
  useEffect(() => {
    staffArr.forEach((staff) => {
      setNumberOfLeaves((numberOfLeaves) => [
        ...numberOfLeaves,
        {
          name: staff,
          numberOfLeave: 0,
          whichDays: "None"
        },
      ]);
    });
    // use loading dependency here to ensure that data in numberOfLeaves is loaded when DOM is loaded
    // use counterStaff dependency here to ensure that when this value changes, 
    // data is loaded in haveTakenLeave
  }, [counterStaff, loading])

  // Display the content upon change in counterStaff value
  // Change in counterStaff value signifies data is changed in numberOfLeave object
  const haveTakenLeave = useMemo(() => {
    // find specific staff that has been selected
    const staff = numberOfLeaves.find((obj) => obj.name === selectRef.current.value);
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

  const handleGoogle = () => {
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

      gapi.auth2.getAuthInstance().signIn()
        .then(() => {
          // Get all the events in a month
          let request = gapi.client.calendar.events.list({
            calendarId: "primary",
            singleEvents : true,
            timeMin: `${firstDate}T00:00:00+08:00`,
            timeMax: `${lastDate}T23:59:59+08:00`,
          });

          request.execute((event, res) => {
            // Array containing all events in the month
            const resArr = JSON.parse(res)[0].result.items;
            // If there are no events in the month
            if (resArr.length === 0) {
              numberOfLeaves.find((obj) => obj.name === selectRef.current.value).numberOfLeave = 0;
              numberOfLeaves.find((obj) => obj.name === selectRef.current.value).whichDays = "None Taken";
              setCounterStaff(counterStaff + 1);
            } else {
              resArr.forEach( (item) => {
                // Staff if they have taken leave
                console.log(resArr)
                // Staff name
                let staff = "";
                let isStaff = -1;
                // In case expired event doesn't contain summary key in the event object                
                if (item.summary) {
                  staff = item.summary.split("(")[0]

                // check if the staff constant above is a part of current team/event crawled is not a leave event
                // Returns -1 if false
                  isStaff = item.summary.search("Leave")
                }
                // If staff event/leave doesn't exist
                if(isStaff !== -1) {
                  // Can use break and continue 

                  // Start and end Date
                  const startDate = (item.start.dateTime.split("T")[0].split(":"))[0];
                  const endDate = (item.end.dateTime.split("T")[0].split(":"))[0];
                  // Calculate the number of days from the two given dates
                  const days_taken = dateCalculatorExcludeWeekend(new Date(startDate), new Date(endDate), new Date(firstDate).getMonth());
    
                  // let number_of_days = endDay - startDay;
                  let whichDays = "";
    
                  days_taken.forEach((item) => {
                    if (whichDays === "") {
                      whichDays = `${whichDays} ${item.getDate()}`
                    } else {
                      whichDays = `${whichDays}, ${item.getDate()}`;
                    }
                  })
                  // Number of days between endDay and startDay (excl weekends)
                  const number_of_days_taken = days_taken.length;
    
                  // Check if the selected staff is equal to the one in the loop/check whether staff exists
                  if (selectRef.current.value === staff) {
                    if (numberOfLeaves.find((obj) => obj.name === selectRef.current.value)) {
                      // Assign values to the object containing the staff information
                      numberOfLeaves.find((obj) => obj.name === selectRef.current.value).numberOfLeave = number_of_days_taken;
                      numberOfLeaves.find((obj) => obj.name === selectRef.current.value).whichDays = whichDays;
                      // Trigger data to be shown (haveTakenLeave)
                      setCounterStaff(counterStaff + 1);
                    } else {
                      alert("Error loading staff leaves.");
                    }
                  } else {
                    setCounterStaff(counterStaff + 1);
                  }
                } else {
                  numberOfLeaves.find((obj) => obj.name === selectRef.current.value).numberOfLeave = 0;
                  numberOfLeaves.find((obj) => obj.name === selectRef.current.value).whichDays = "None Taken";
                  setCounterStaff(counterStaff + 1);
                }
                })
              }
            })
        })
    })
  };

  const staffList = staffArr.map((staff, index) => {
    return <option key={index} value={staff}> {staff} </option>;
  });

  
  const months = allMonths.map((month, index) => {
      return <option key={index} value={month[index]}> {month[index]} </option>;
  })

  const handleChangeMonthViewLeave = () => {
    let key = ""
    allMonths.forEach( (month, index) => {
      console.log(month)
      if (month[index] === monthRef.current.value) {
        key = index;
      }
    })
    firstDate = getFirstAndLastDay(key)[0]
    lastDate = getFirstAndLastDay(key)[1]
    console.log(firstDate)
    console.log(lastDate)
    if (firstDate && lastDate) {
      handleGoogle()
    } else {
      alert("Please select a month")
    }
  }

  const handleShowMonths = (e) => {
    if (e.target.value) {
      setShowMonthSelection(true)
    } else {
      setShowMonthSelection(false)
    }

    if (monthRef.current.value) {
      handleChangeMonthViewLeave();
    }
  }

  return (
    <div className="container leave-overview">
      {loading && <Loading />}
      <h2 className="page-heading"> Leave Overview: </h2>
      <label name="staff" htmlFor="staff">
        Staff: 
        <select
          name="staff"
          id="staff"
          ref={selectRef}
          onChange={handleShowMonths}
        >
          <option defaultValue=""></option>
          {staffList}
        </select>
      </label>

{showMonthSelection &&
      <label name="month" htmlFor="month">
        Month:
        <select
          name="month"
          id="month"
          ref={monthRef}
          onChange={handleChangeMonthViewLeave}
        >
          <option defaultValue=""></option>
          {months}
        </select>
      </label>
}

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
