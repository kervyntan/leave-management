import React, { useEffect, useState, useRef } from 'react';
import { Checkbox } from '@mantine/core';
import Loading from "./Loading";
import { db } from '../firebase';
import {
    collection,
    deleteDoc,
    getDocs,
    doc,
    getDoc
  } from "firebase/firestore";
import { compareNames, compareStaff } from "../compareNames";

const EditStaff = () => {
    // Show one staff
    // Show multiple staff
    const [staff, setStaff] = useState("");
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [staffList, setStaffList] = useState([])
    const [staffKeys, setStaffKeys] = useState()
    const [staffInput, setStaffInput] = useState([])
    const [currentEditedStaff, setCurrentEditedStaff] = useState([])
    const colRef = collection(db, "staff");
    if (loading) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    
    useEffect( () => {
        getDocs(colRef)
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // fetch staff data 
                setStaffList((staffList) => [...staffList, doc.data()]);
                setStaffInput((staffInput) => [...staffInput, doc.data()])
            })
        })
        .then( () => {
            setLoading(false);
        })
    }, [])

    useEffect( () => {
        console.log(staff)
    }, [staff])

    const handleChangeLeave = (e) => {
        // setStaffInput()
    }
    // need to come up with an object to store each individual staff values?
    // Then eventually editing those values will setState to the above object
    // Upon hitting save, those values will be saved to db
    const allStaff = staffList.sort(compareStaff).map((staff) => {
        const keys = Object.keys(staff);
        const indexName = keys.indexOf("name");
        // Get rid of name key
        const editedKeys = keys.slice(0, indexName).concat(keys.slice(indexName + 1))
        const staffData = editedKeys.sort(compareNames).map((attribute) => {
            return (
                <>
                <label htmlFor={attribute}> {attribute} </label>
                <input type="number" name={staff.name} value={staffInput.find(val => val.name === staff.name)[attribute]}
                onChange={handleChangeLeave} />
                </>
            )
        })
        return (
            <div className="d-flex">
                <label htmlFor="name"> {staff.name} </label>
                <div className="staff-info grid">
                    {staffData}
                </div>
            </div>
        )
    })
    const singleStaff = staffList.sort(compareStaff).map( (staff) => {
        const keys = Object.keys(staff);
        const indexName = keys.indexOf("name");
        // Get rid of name key
        const editedKeys = keys.slice(0, indexName).concat(keys.slice(indexName + 1))
        const staffData = editedKeys.sort(compareNames).map((attribute) => {
            return (
                <>
                <label htmlFor={attribute}> {attribute} </label>
                <input type="number" name={staff.name} value={staffInput.find(val => val.name === staff.name)[attribute]}
                onChange={handleChangeLeave} />
                </>
            )
        })
        return (
            <>
                <option value={staff.name}> {staff.name} </option>
            </>
        )
    })

    const singleStaffData = staffList.sort(compareStaff).map((person) => {
        if (person.name === staff) {
        const keys = Object.keys(person);
        const indexName = keys.indexOf("name");
        // Get rid of name key
        console.log(keys)
        const editedKeys = keys.slice(0, indexName).concat(keys.slice(indexName + 1))
        console.log(editedKeys)
        console.log(staffList.find(val => val.name === staff))
        const staffData = editedKeys.sort(compareNames).map((attribute) => {
            console.log(attribute)
            console.log(staffList.find(val => val.name === staff)[attribute])
            return (
                <>
                <label htmlFor={attribute}> {attribute} </label>
                <input type="number" name={staff} value={staffInput.find(val => val.name === staff)[attribute]}
                onChange={handleChangeLeave} />
                </>
            )
        })

        return (
            <>
                {staffData}
            </>
        )
    } else {
        return "";
    }
    })

    // const singleStaffData = staffList.sort(compareStaff).map( (person) => {
    //     const singleStaffKeys = Object.keys(staffList.find(val => val.name === staff))
    //     const staffData = singleStaffKeys.sort(compareStaff).map( (attribute) => {
    //         return (
    //             <>
    //             <label htmlFor={attribute}> {attribute} </label>
    //             <input type="number" name={staff} value={staffInput.find(val => val.name === staff)[attribute]}
    //             onChange={handleChangeLeave} />
    //             </>
    //         )
    //     })
    //     return (
    //         <>
    //             {staffData}
    //         </>
    //     )
    // })
    return (
        <div className="edit-staff">
        {loading 
        ? <Loading />
        : <>
        <h2 className="page-heading"> Edit Staff: </h2>
            <div className="edit-staff-section">
                <Checkbox checked={checked} label="See All Staff" 
                onClick={() => setChecked(!checked)}
                />

                {checked
                ? <div className="all-staff">
                    {allStaff}
                </div>
                : <>
                  <select onChange={(e) => setStaff(e.target.value)} className="single-staff">
                    <option value="" defaultValue></option>
                    {singleStaff}
                  </select>
                  {singleStaffData}
                  </>
                }
            </div>
            </>
        }
        </div>
    )
}

export default EditStaff