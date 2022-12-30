import React, { useEffect, useRef, useState } from 'react';
import Button from "./Button"
import Loading from './Loading';
import { compareNames } from "../compareNames";
import { Checkbox, Paper, Input } from '@mantine/core';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const Settings = () => {

    // What should the user be able to edit 
    // Edit what types of leave should be shown to the user (Checkbox style, so if checked then true)
    // Need a log in page for this?
    const leaveToBeAdded = useRef("")
    // const colLeaveTypeRef = collection(db, "leaveTypes")
    const docShowLeaveTypesRef = doc(db, "showLeaveTypes", "showLeaveTypes")
    const [loading, setLoading] = useState(true);
    const [checked, setChecked] = useState({});
    if (loading) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "unset";
    }

    useEffect ( () => {
        getDoc(docShowLeaveTypesRef)
            .then((doc) => {
                setChecked(doc.data());
            })
            // use this then to catch when data is fetched**
            .then(() => {
                setLoading(false);
            });
    }, [])

    useEffect ( () => {
        console.log(checked)
    }, [checked])

    const handleAddLeaveType = () => {
        setDoc(docShowLeaveTypesRef, {
            [leaveToBeAdded.current.value] : true
        }, { merge: true })
            .then(() => {
                console.log("Success")
                window.location.reload()
            })
            .catch((error) => {
                alert(error)
            })
    }

    const updateShowLeaveTypes = () => {
        setDoc(docShowLeaveTypesRef, checked)
        .then( () => {
            console.log("Success")
        })
        .catch( (error) => {
            alert(error);
        })
    }

    const checkboxKeys = Object.keys(checked);
    const checkboxList = checkboxKeys.sort(compareNames).map((checkbox) => {
        return <Checkbox checked={checked[checkbox]} label={checkbox.toUpperCase()}
        // toggle between true and false on click of the checkbox
            onClick={() => setChecked({ ...checked, [checkbox]: !checked[checkbox] })}
        />
    })
    // Loop through the checkboxes and each should have the prop of checked.leaveType
    // 
    return (
        <div className="settings">
            {loading 
            ? <Loading /> 
            : <>
            {/* <Button onClick={addLeave} text="I test" /> */}
            <Paper shadow="xl" p="md" m="md" style={{ backgroundColor: "#4059AD" }}>
                {checkboxList}
                <Button onClick={updateShowLeaveTypes} text="Save" className="btn" />
            </Paper>
            <Paper shadow="xl" p="md" m="md" style={{ backgroundColor: "#4059AD" }}>
                <Input.Wrapper p="xs" label="Add Leave Type: eg. Annual">
                    <Input placeholder="Type of leave to add:" ref={leaveToBeAdded} style={{marginBottom : "20px"}} />
                    <Button onClick={handleAddLeaveType} text="Add Leave Type" className="btn" />
                </Input.Wrapper>
            </Paper>
            </>
            }
        </div>
    )
}

export default Settings;