import React, {useEffect, useState} from 'react';
import AddStaff from './AddStaff';
import {db} from "../firebase";
import {
    collection,
    addDoc,
    serverTimestamp,
    updateDoc,
    doc,
    getDocs
  } from "firebase/firestore"

const Home = () => {
    // need to have a home dashboard
    // form available to add the person's leaves
    // Form -> fields for each type of leave, name of the person
    // Another form that will allow for application of leave
    // 2nd form -> how many days leave (need a date picker), reason for leave, name of the person
    // Upon submission, that name will be affected in the leave, and the subsequent leave 
    // will be deducted 
    // need to count the number of days between start date and end date of date picker** (for deduction)
    // if person has 0 days of that leave, cannot allow them to submit the form'
    const [staffDetails, setStaffDetails] = useState([{}]);
    const colRef = collection(db, "staff");
    // setStaffDetails(db.collection('staff').get());
    // console.log(staffDetails);
    useEffect( () => {
        setTimeout( () => {
            getDocs(colRef).then((querySnapshot) => {
                console.log(querySnapshot.size)
                querySnapshot.forEach((doc) => {
                    // setStaffDetails(...staffDetails, 
                    //     doc.data()
                    // )
                    // arr.push(doc.data());
                    console.log("Hello")
                    setStaffDetails(staffDetails => [...staffDetails, {
                        name : doc.data().name,
                        annual_leave : doc.data().annual_leave,
                        compassionate_leave : doc.data().compassionate_leave,
                        no_pay_leave : doc.data().no_pay_leave,
                        paternity_leave : doc.data().paternity_leave,
                        maternity_leave : doc.data().maternity_leave
                    }])
                })
            })
            console.log(staffDetails)
        }, 500)
    }, [])

    console.log(staffDetails)

    // loop through staffDetails and output the name of each and the
    // different leaves
    // Make a new <p> under each div whenever there's a new entry

    const loopField = (col) => {
        let field = document.querySelector("." + col);
        // console.log(field);
        staffDetails.map((person) => {
            const val = person[col]; // access using variable string name
            return <p className={col}> {val} </p>;
        }) 
    }

    const staff = staffDetails.map((person) => {
        return (
        <>
        <tr>
                <td className="name">
                <p className="name_para">
                {person.name}
                </p>
                </td>
                <td className="annual_leave">
                <p className="annual_leave_para">
                {person.annual_leave}
                </p>
                </td>
                <td className="compassionate_leave">
                <p className="compassionate_leave_para">
                {person.compassionate_leave}   
                </p>
                </td>
                <td className="no_pay_leave">
                <p className="no_pay_leave_para">
                {person.no_pay_leave}   
                </p>
                </td>
                <td className="paternity_leave">
                <p className="paternity_leave_para">
                {person.paternity_leave}   
                </p>
                </td>
                <td className="maternity_leave">
                <p className="maternity_leave_para">
                {person.maternity_leave}      
                </p>
                </td>
         </tr>
        </>
        )
    })

    // loopField("fun");

        // setStaffDetails(arr);

    // see how many on leave that day

    return (
        <div className="container">
            <table className="staff">
            <tr>
                <th> Name </th>
                <th> Annual </th>
                <th> Compassionate </th>
                <th> No Pay </th>
                <th> Paternity </th>
                <th> Maternity </th>
            </tr>
                {staff}
            </table>
        </div>
    )
}

export default Home;