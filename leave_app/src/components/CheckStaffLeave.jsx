import React, { useState } from 'react'
import Loading from './Loading'
import { db } from '../firebase';
import { collection, getDocs, query, updateDoc, doc, getDoc } from "firebase/firestore";
import { useEffect } from 'react';

const CheckStaffLeave = () => {
    const colRef = collection(db, "staff");
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

    const staffList = staffArr.map((staff) => {
        return <option value={staff}> {staff} </option>
    })
    return (
        <div className="container">
            {loading && <Loading />}
            <h2 className="page-heading"> Enquire Staff: </h2>
            <label name="staff" htmlFor="staff">
                <select name="staff" id="staff">
                    {staffList}
                </select>
            </label>
        </div>
    )
}

export default CheckStaffLeave