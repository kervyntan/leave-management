import React from 'react';
import Button from "./Button";

const ApplyLeave = () => {
    return (
        <div className="container">
        <form>
        <label htmlFor='name'> Name: </label>
            <input id="name" name="name" placeholder="Name: "/>

            <label htmlFor='reason'> Name: </label>
            <input id="reason" name="reason" placeholder="Reason for Leave: "/>
            
            <label htmlFor="start"> Start Date </label>
            <input id="start" name="duration" type="date"/>

            <label htmlFor="end"> End Date </label>
            <input id="end" name="duration" type="date"/>
            <Button class="form-btn" />
        </form>
    </div>
    )
}

export default ApplyLeave;