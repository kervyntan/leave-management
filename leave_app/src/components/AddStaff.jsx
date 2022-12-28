import React, { useEffect, useState } from "react";
import Button from "./Button";
import Loading from "./Loading";
import { compareNames } from "../compareNames";
import { useNavigate } from "react-router-dom";
import { filterProps, Modal } from "@mantine/core";
import { db } from "../firebase";
import { collection, doc, setDoc, addDoc, getDoc } from "firebase/firestore";

const AddStaff = () => {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorModal, setErrorModal] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [leaveSubmission, setLeaveSubmission] = useState({})
  const docShowLeaveTypesRef = doc(db, "showLeaveTypes", "showLeaveTypes")

  useEffect ( () => {
    getDoc(docShowLeaveTypesRef)
    .then( (doc) => {
      const keys = Object.keys(doc.data());
      let obj = {}
      keys.forEach( (field) => {
        // If the leave in db returns as true,
        // leave is in use
        // otherwise don't let users add that particular leave type to staff
        if (doc.data()[field]) {
        Object.assign(obj, {
          [field.toLowerCase() + "_leave"] : ""
        })
      }
      })

      // form values holds the fields to be populated
      setFormValues(obj);
      // leaveSubmission stores values to be sent to db
      setLeaveSubmission({...obj, "name" : ""})
    })
    .then(() => {
      setLoading(false);
    })
  }, [])

  const handleAddStaff = (e) => {
    e.preventDefault();
    // check if any of the input fields are empty
    if (Object.values(leaveSubmission).find((val) => val === "") === "") {
       setErrorModal(true);
    } else {
      // ID of the document is the name of staff
      // ${formValues.name}
      setDoc(doc(db, "staff", `${leaveSubmission.name}`), leaveSubmission);
      setOpened(true);
      // navigate("/");
    }
  };

  const changeHandler = (e) => {
      // setFormValues({
      //   ...formValues,
      //   [e.target.name]: e.target.value,
      // });
    if (e.target.name === "name") {
      setLeaveSubmission({
        ...leaveSubmission,
        "name" : e.target.value
      })
    } else {      
      setLeaveSubmission({
        ...leaveSubmission,
        [e.target.name] : e.target.value
      })
    }
  };

  const formFields = Object.keys(formValues).sort(compareNames).map((field) => {
    // const formatFieldName = field.split("_")[0].charAt(0).toUpperCase() + field.split("_").slice(1);
    return (
      <>
        <label htmlFor={field}> {field}: </label>
        {/* condition to show placeholder */}
        <input id={field} name={field} placeholder={"No. of leave eg. 14"} onChange={changeHandler} value={leaveSubmission[field]} required />
      </>
    )
  })

  return (
    // Reflect the leave that is fetch from db
    // And add/remove the inputs
    <div className="container">
      {loading 
      ? <Loading />
      : <>
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        title="Successfully added staff!"
      >
        Staff has been added successfully.
        <br />
        Click away to continue.
      </Modal>
      <Modal
        centered
        opened={errorModal}
        onClose={() => setErrorModal(false)}
        title="Error adding staff."
      >
        Please ensure none of the fields are empty.
        <br />
        Click away to continue.
      </Modal>
      <form className="add-staff-form">
      <label htmlFor="name"> Name: </label>
        {/* condition to show placeholder */}
        <input id="name" name="name" placeholder="Name: " onChange={changeHandler} value={formValues.name} required />

        {formFields}
        <Button class="form-btn" text="Add Staff" onClick={handleAddStaff} />
      </form>
      </> 
      }
    </div>
  );
};

export default AddStaff;
