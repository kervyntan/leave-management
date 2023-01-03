import React, { useEffect, useRef, useState } from 'react';
import Button from "./Button"
import Loading from './Loading';
import { compareNames } from "../compareNames";
import { Checkbox, Paper, Input, Text, Modal } from '@mantine/core';
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
    const [openSaveModal, setOpenSaveModal] = useState(false);
    const [openAddLeaveModal, setOpenAddLeaveModal] = useState(false);
    const [openErrorModal, setOpenErrorModal] = useState(false);
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

    const handleAddLeaveType = () => {
        if (leaveToBeAdded.current.value === "") {
            setOpenErrorModal(true);
        }
        setDoc(docShowLeaveTypesRef, {
            [leaveToBeAdded.current.value] : true
        }, { merge: true })
            .then(() => {
                setOpenAddLeaveModal(true);
                window.location.reload();
            })
            .catch((error) => {
                alert(error)
            })
    }

    const updateShowLeaveTypes = () => {
        setOpenSaveModal(true);
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
        if (checkbox === "NoPay") {
            return <Checkbox checked={checked[checkbox]} label="No Pay"
            // toggle between true and false on click of the checkbox
                onClick={() => setChecked({ ...checked, [checkbox]: !checked[checkbox] })}
            />
        } else {
            return <Checkbox checked={checked[checkbox]} label={checkbox.charAt(0).toUpperCase() + checkbox.slice(1)}
            // toggle between true and false on click of the checkbox
                onClick={() => setChecked({ ...checked, [checkbox]: !checked[checkbox] })}
            />
        }
    })
    // Loop through the checkboxes and each should have the prop of checked.leaveType
    // 
    return (
        <div className="settings">
            <h2 class="page-heading"> Settings </h2>

            <Modal
                centered
                opened={openErrorModal}
                onClose={() => setOpenErrorModal(false)}
                title="Error adding leave type."
            >
                Input cannot be empty.
            </Modal>

            <Modal
                centered
                opened={openSaveModal}
                onClose={() => setOpenSaveModal(false)}
                title="Settings saved."
            >
                Click away to continue.
            </Modal>

            <Modal
                centered
                opened={openAddLeaveModal}
                onClose={() => setOpenAddLeaveModal(false)}
                title="Leave Type Added."
            >
                Please wait for the page to reload.
            </Modal>
            {loading 
            ? <Loading /> 
            : <div className="settings-section">
            {/* <Button onClick={addLeave} text="I test" /> */}
            <Paper shadow="xl" p="md" m="md" style={{ backgroundColor: "#F7F8FC" }}>
                <Text fz={16} style={{color : "#4458A7", fontWeight : "bold", marginBottom : "20px"}}> Leave Types </Text>
                {checkboxList}
                <Button onClick={updateShowLeaveTypes} text="Save" class="btn settings-btn" />
            </Paper>
            <Paper shadow="xl" p="md" m="md" style={{ backgroundColor: "#F7F8FC" }}>
                <Input.Wrapper p="xs" label="Add Leave Type: eg. Annual">
                    <Input placeholder="Type of leave to add:" ref={leaveToBeAdded} style={{marginBottom : "20px"}} />
                    <Button onClick={handleAddLeaveType} text="Add Leave Type" class="btn settings-btn" />
                </Input.Wrapper>
            </Paper>
            </div>
            }
        </div>
    )
}

export default Settings;