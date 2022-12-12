import React, {useEffect, useState} from 'react';
import AddStaff from './AddStaff';
import Loading from './Loading';
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
    // add a cross that deletes the staff from the list

    const [staffDetails, setStaffDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const colRef = collection(db, "staff");
    if (loading) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    useEffect( () => {
        setTimeout( () => {
            getDocs(colRef).then((querySnapshot) => {
                console.log(querySnapshot.size)
                querySnapshot.forEach((doc) => {
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
            // use this then to catch when data is fetched**
            .then( () => setLoading(false))
            console.log(staffDetails)
        }, 500)
    }, [])

    const staff = staffDetails.map((person) => {
        return (
        <>
        <tr key={Math.random}>
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

    return (
        <>
        {loading && <Loading />}
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
        </div>
        </>
    )
}

export default Home;