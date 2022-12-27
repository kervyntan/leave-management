import React, { useState } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { Modal } from "@mantine/core";
import { db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";

const AddStaff = () => {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    annual: 14,
    compassionate: 3,
    noPay: 14,
    maternity: 14,
    paternity: "",
  });
  const [leaveSubmission, setLeaveSubmission] = useState({})

  const handleAddStaff = (e) => {
    e.preventDefault();
    // ID is the name of staff
    // ${formValues.name}
    setDoc(doc(db, "staff", `${formValues.name}`), {
      name: formValues.name,
      annual_leave: formValues.annual,
      compassionate_leave: formValues.compassionate,
      no_pay_leave: formValues.noPay,
      paternity_leave: formValues.paternity,
      maternity_leave: formValues.maternity,
    });
    setOpened(true);
    // navigate("/");
  };

  const changeHandler = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
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
      <form className="add-staff-form">
        {formFields}
        <Button class="form-btn" text="Add Staff" onClick={handleAddStaff} />
      </form>
    </div>
  );
};

export default AddStaff;
