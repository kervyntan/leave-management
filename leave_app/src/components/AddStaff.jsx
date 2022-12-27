import React, { useEffect, useState } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { Modal } from "@mantine/core";
import { db } from "../firebase";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";

const AddStaff = () => {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    annual: 14,
    compassionate: 3,
    noPay: 14,
    maternity: 14,
    paternity: "",
  });
  const [leaveSubmission, setLeaveSubmission] = useState({})
  useEffect ( () => {
    console.log(leaveSubmission)
  }, [leaveSubmission])
  const handleAddStaff = (e) => {
    e.preventDefault();
    // check if any of the input fields are empty
    if (Object.values(leaveSubmission).find((val) => val === "") === "") {
       setErrorModal(true);
    } else {
      // ID of the document is the name of staff
      // ${formValues.name}
      setDoc(doc(db, "staff", `${formValues.name}`), leaveSubmission);
      setOpened(true);
      // navigate("/");
    }
  };

  const changeHandler = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "name") {
      setLeaveSubmission({
        ...leaveSubmission,
        [e.target.name] : e.target.value
      })
    } else {
      setLeaveSubmission({
        ...leaveSubmission,
        [e.target.name + "_leave"] : e.target.value
      })
    }
  };

  const formFields = Object.keys(formValues).map((field) => {
    const formatFieldName = field.charAt(0).toUpperCase() + field.slice(1);
    return (
      <>
        <label htmlFor={field}> {formatFieldName}: </label>
        <input id={field} name={field} placeholder={formValues[field]} onChange={changeHandler} value={formValues[field]} required />
      </>
    )
  })
  console.log(leaveSubmission)
  console.log(Object.values(leaveSubmission))
  console.log(Object.values(leaveSubmission).find((val) => val === ""))

  return (
    // Reflect the leave that is fetch from db
    // And add/remove the inputs
    <div className="container">
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
        {formFields}
        <Button class="form-btn" text="Add Staff" onClick={handleAddStaff} />
      </form>
    </div>
  );
};

export default AddStaff;
