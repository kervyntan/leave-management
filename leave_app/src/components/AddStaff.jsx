import React, { useState } from "react";
import Button from "./Button";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
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
  const colRef = collection(db, "staff");

  const addStaffHandler = (e) => {
    e.preventDefault();
    addDoc(colRef, {
      name: formValues.name,
      annual_leave: formValues.annual,
      compassionate_leave: formValues.compassionate,
      no_pay_leave: formValues.no_pay,
      paternity_leave: formValues.paternity,
      maternity_leave: formValues.maternity,
    });
  };

  const changeHandler = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const test = [{"id":"gapiRpc","result":{"kind":"calendar#events","etag":"\"p33sct1fgqrpvm0g\"","summary":"kervyntan@gmail.com","updated":"2022-12-12T08:38:38.043Z","timeZone":"Asia/Singapore","accessRole":"owner","defaultReminders":[{"method":"popup","minutes":30}],"nextPageToken":"CkgKOjY4cmo2b2IyYzRyNjRiYjJjZ3AzMGI5a2Nvb2ppYmIyY29vM2FiYjQ3MHIzZXAzNTZrcm1hY3BtY2sYASCAgMCKnKehnxcaDwgAEgAY-M6F8Nbz-wIgASIHCAIQsNqwLA==","items":[{"kind":"calendar#event","etag":"\"3194661320746000\"","id":"68rj6ob2c4r64bb2cgp30b9kcoojibb2coo3abb470r3ep356krmacpmck","status":"confirmed","htmlLink":"https://www.google.com/calendar/event?eid=NjhyajZvYjJjNHI2NGJiMmNncDMwYjlrY29vamliYjJjb28zYWJiNDcwcjNlcDM1NmtybWFjcG1jayBrZXJ2eW50YW5AbQ","created":"2020-08-13T14:57:40.000Z","updated":"2020-08-13T14:57:40.373Z","summary":"No Walk-ins for counter services.  By Appointment only. (ComfortDelGro Driving Centre)","description":"View/Change Appointment:\nhttps://app.acuityscheduling.com/schedule.php?owner=20159891&id%5B%5D=8f1a249a189c1e73ac04939bb1bf23b1&action=appt\n\n(created by Acuity Scheduling)\nAcuityID=422431859\nGoogle","creator":{"email":"kervyntan@gmail.com","self":true},"organizer":{"email":"kervyntan@gmail.com","self":true},"start":{"dateTime":"2020-09-06T09:30:00+08:00","timeZone":"Asia/Singapore"},"end":{"dateTime":"2020-09-06T10:00:00+08:00","timeZone":"Asia/Singapore"},"iCalUID":"68rj6ob2c4r64bb2cgp30b9kcoojibb2coo3abb470r3ep356krmacpmck@google.com","sequence":0,"reminders":{"useDefault":true},"eventType":"default"}]}}]

  console.log(test[0].result.items[0].summary)

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
        <Button class="form-btn" text="Add Staff" onClick={addStaffHandler} />
      </form>
    </div>
  );
};

export default AddStaff;
