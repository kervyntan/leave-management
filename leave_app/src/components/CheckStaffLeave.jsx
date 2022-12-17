import React, { useState, useEffect } from 'react'
import Button from './Button'
import Loading from './Loading'
import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";
import { gapi, CLIENT_ID, API_KEY, DISCOVERY_DOC, SCOPES } from "../gapi";

const CheckStaffLeave = () => {
    const colRef = collection(db, "staff");
    let selectedStaff = "";
    const [staffArr, setStaffArr] = useState([])
    const [loading, setLoading] = useState(true);
    useEffect( () => {
        setTimeout(() => {
            getDocs(colRef)
              .then((querySnapshot) => {
                // console.log(querySnapshot.size)
                querySnapshot.forEach((doc) => {
                  setStaffArr((staffArr) => [...staffArr, [doc.data().name]]);
                });
              })
              // use this then to catch when data is fetched**
              .then(() => {
                setLoading(false);
              });
          }, 500);
    }, [])

    const handleGoogle = (e) => {
        e.preventDefault();

        gapi.load("client:auth2", () => {
            gapi.client.init({
                apiKey : API_KEY,
                clientId : CLIENT_ID,
                discoveryDocs : DISCOVERY_DOC,
                scope : SCOPES,
                plugin_name : "leave-management-371308"
            });

            gapi.client.load("calendar", "v3", () => {  
                console.log("Added")
            })

            gapi.auth2.getAuthInstance().signIn()
            .then( () => {
                // Get all the events in a month
            let request = gapi.client.calendar.events.list({
                calendarId : "primary",
                timeMin: "2022-12-01T00:00:00+08:00",
                timeMax: "2022-12-31T23:59:59+08:00"
            });
            
            request.execute((event, res) => {
                // Need to loop through all the items, then gather all those that match the person's name
                console.log((JSON.parse(res)))
                // Get the start time
                const len = (JSON.parse(res))[0].result.items.length;
                const resArr = (JSON.parse(res))[0].result.items;
                resArr.forEach( (item) => {

                })
                console.log("Start time is: " + (JSON.parse(res))[0].result.items[len - 1].start.dateTime)
                console.log("End time is: " + (JSON.parse(res))[0].result.items[len- 1].end.dateTime)
                // The staff's name
                const startDate = (JSON.parse(res))[0].result.items[len - 1].start.dateTime
                const endDate = (JSON.parse(res))[0].result.items[len- 1].end.dateTime
                // const staffName = (JSON.parse(res))[0].result.items[len- 1].summary.split("(")[0]
                const staffName = 
                console.log((JSON.parse(res))[0].result.items[len- 1].summary.split("(")[0])
            })
            })
        })
    }

    const staffList = staffArr.map((staff) => {
        return <option value={staff}> {staff} </option>
    })

    const handleSelectStaff = (e) => {
        // console.log(e.target.value)
        selectedStaff = e.target.value;
        console.log(selectedStaff)
    }

    const haveTakenLeave = "";

    return (
        <div className="container">
            {loading && <Loading />}
            <Button onClick={handleGoogle} text="Test Google"/>
            <h2 className="page-heading"> Enquire Staff: </h2>
            <label name="staff" htmlFor="staff">
                <select name="staff" id="staff" onChange={handleSelectStaff}>
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
    )
}

export default CheckStaffLeave