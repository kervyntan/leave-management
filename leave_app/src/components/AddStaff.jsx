import React from 'react';
import Button from "./Button";

const AddStaff = () => {
    return (
        <div className="container">
            <form>
            <label htmlFor='name'> Name: </label>
                <input id="name" name="name" placeholder="Name: "/>

                <label htmlFor='annual'> Annual Leave: </label>
                <input id="annual" name="annual" placeholder="Reason for Leave: "/>
                
                <label htmlFor="compassionate"> Compassionate Leave: </label>
                <input id="compassionate" name="compassionate" type="date"/>

                <label htmlFor="no-pay"> No Pay Leave: </label>
                <input id="no-pay" name="no-pay" type="date"/>

                <label htmlFor="paternity"> Paternity Leave: </label>
                <input id="paternity" name="paternity" type="date"/>

                <label htmlFor="maternity"> Maternity Leave: </label>
                <input id="maternity" name="maternity" type="date"/>

                <label htmlFor="other"> Other Leave: </label>
                <input id="other" name="other" type="date"/>
                <Button class="form-btn" />
            </form>
        </div>
    )
}

export default AddStaff;