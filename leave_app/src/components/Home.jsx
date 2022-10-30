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
    const [staffDetails, setStaffDetails] = useState([{
        name : "",
        annual_leave : "",
        compassionate_leave : "",
        no_pay_leave : "",
        paternity_leave : "",
        maternity_leave : ""
    }]);
    let arr = [];
    const colRef = collection(db, "staff");
    // setStaffDetails(db.collection('staff').get());
    // console.log(staffDetails);
    useEffect( () => {
        getDocs(colRef).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // setStaffDetails(...staffDetails, 
                //     doc.data()
                // )
                // arr.push(doc.data());
                setStaffDetails([...staffDetails, {
                    name : doc.data().name,
                    annual_leave : doc.data().annual_leave,
                    compassionate_leave : doc.data().compassionate_leave,
                    no_pay_leave : doc.data().no_pay_leave,
                    paternity_leave : doc.data().paternity_leave,
                    maternity_leave : doc.data().maternity_leave
                }])
            })
        })
    }, [])
    // loop through staffDetails and output the name of each and the
    // different leaves

        // setStaffDetails(arr);

    console.log(staffDetails);
    return (
        <div className="container">
            <div className="staff">
                <div className="name">
                <h1 className="name_heading">Name</h1>
                <p className="name_para">Name</p>
                </div>
                <div className="annual_leave">
                <h1 className="annual_leave_heading">Annual:</h1>
                <p className="annual_leave_para">Name</p>
                </div>
                <div className="compassionate_leave">
                <h1 className="compassionate_leave_heading">Compassionate: </h1>
                <p className="compassionate_leave_para">Name</p>
                </div>
                <div className="no_pay_leave">
                <h1 className="no_pay_leave_heading">No Pay: </h1>
                <p className="no_pay_leave_para">Name</p>
                </div>
                <div className="paternity_leave">
                <h1 className="paternity_leave_heading">Paternity: </h1>
                <p className="paternity_leave_para">Name</p>
                </div>
                <div className="maternity_leave">
                <h1 className="maternity_leave_heading">Maternity: </h1>
                <p className="maternity_leave_para">Name</p>
                </div>
            </div>
        </div>
    )
}

export default Home;