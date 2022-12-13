import React, { useState } from "react";
import Button from "./Button";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit
} from "firebase/firestore";

const AddStaff = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    annual: "",
    compassionate: "",
    no_pay: "",
    paternity: "",
    maternity: "",
  });
  const [latestDocID, setLatestDocID] = useState(0);
  const colRef = collection(db, "staff");
  
  const handleAddStaff = (e) => {
    e.preventDefault();
    // console.log(getDoc(colRef).id);
    getDocs(query(collection(db, "staff"), orderBy("name"), limit(1)))
    .then( (items) => {
      items.forEach((doc) => {
        setLatestDocID(doc.id)
        console.log(doc.id)
        console.log(latestDocID)
      })
    })
    .then( () => {
      console.log(latestDocID)
      setDoc(doc(db, "staff", `${latestDocID + 1}`), {
        name: formValues.name,
        annual_leave: formValues.annual,
        compassionate_leave: formValues.compassionate,
        no_pay_leave: formValues.no_pay,
        paternity_leave: formValues.paternity,
        maternity_leave: formValues.maternity,
      });
    })

  };

  const changeHandler = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container">
      <form className="add-staff-form">
        <label htmlFor="name"> Name: </label>
        <input
          id="name"
          name="name"
          placeholder="Name: "
          onChange={changeHandler}
        />

        <label htmlFor="annual"> Annual Leave: </label>
        <input
          id="annual"
          name="annual"
          placeholder="Number of Days: "
          onChange={changeHandler}
        />

        <label htmlFor="compassionate"> Compassionate Leave: </label>
        <input
          id="compassionate"
          name="compassionate"
          placeholder="Number of Days: "
          type="text"
          onChange={changeHandler}
        />

        <label htmlFor="no_pay"> No Pay Leave: </label>
        <input
          id="no_pay"
          name="no_pay"
          type="text"
          placeholder="Number of Days: "
          onChange={changeHandler}
        />

        <label htmlFor="paternity"> Paternity Leave: </label>
        <input
          id="paternity"
          name="paternity"
          type="text"
          placeholder="Number of Days: "
          onChange={changeHandler}
        />

        <label htmlFor="maternity"> Maternity Leave: </label>
        <input
          id="maternity"
          name="maternity"
          type="text"
          placeholder="Number of Days: "
          onChange={changeHandler}
        />

        <label htmlFor="other"> Other Leave: </label>
        <input
          id="other"
          name="other"
          type="text"
          placeholder="Number of Days: "
          onChange={changeHandler}
        />
        <Button class="form-btn" text="Add Staff" onClick={handleAddStaff} />
      </form>
    </div>
  );
};

export default AddStaff;
