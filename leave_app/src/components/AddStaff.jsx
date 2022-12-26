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
    no_pay: 14,
    maternity: 14,
    paternity: "",
  });

  const handleAddStaff = (e) => {
    e.preventDefault();
    // ID is the name of staff
    // ${formValues.name}
    setDoc(doc(db, "staff", `${formValues.name}`), {
      name: formValues.name,
      annual_leave: formValues.annual,
      compassionate_leave: formValues.compassionate,
      no_pay_leave: formValues.no_pay,
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
        <label htmlFor="name"> Name: </label>
        <input
          id="name"
          name="name"
          placeholder="Name: "
          onChange={changeHandler}
          value={formValues.name}
          required
        />

        <label htmlFor="annual"> Annual Leave: </label>
        <input
          id="annual"
          name="annual"
          placeholder="Number of Days: "
          onChange={changeHandler}
          value={formValues.annual}
          required
        />

        <label htmlFor="compassionate"> Compassionate Leave: </label>
        <input
          id="compassionate"
          name="compassionate"
          placeholder="Number of Days: "
          type="text"
          onChange={changeHandler}
          value={formValues.compassionate}
          required
        />

        <label htmlFor="no_pay"> No Pay Leave: </label>
        <input
          id="no_pay"
          name="no_pay"
          type="text"
          placeholder="Number of Days: "
          onChange={changeHandler}
          value={formValues.no_pay}
          required
        />

        <label htmlFor="maternity"> Maternity Leave: </label>
        <input
          id="maternity"
          name="maternity"
          type="text"
          placeholder="Number of Days: "
          onChange={changeHandler}
          value={formValues.maternity}
          required
        />


        <label htmlFor="paternity"> Paternity Leave: </label>
        <input
          id="paternity"
          name="paternity"
          type="text"
          placeholder="Number of Days: "
          onChange={changeHandler}
          value={formValues.paternity}
          required
        />

        <label htmlFor="other"> Other Leave: </label>
        <input
          id="other"
          name="other"
          type="text"
          placeholder="Number of Days: "
          onChange={changeHandler}
          required
        />
        <Button class="form-btn" text="Add Staff" onClick={handleAddStaff} />
      </form>
    </div>
  );
};

export default AddStaff;
