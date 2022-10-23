import React from 'react';
import Button from "./Button";

const AddStaff = () => {
    return (
        <div className="container">
            <form>
            <label htmlFor='name'> Name: </label>
                <input id="name" name="name" placeholder="Name: "/>

                <label htmlFor='leave-1'> Leave 1: </label>
                <input id="leave-1" name="leave-1" placeholder="Reason for Leave: "/>
                
                <label htmlFor="leave-2"> Leave 2: </label>
                <input id="leave-2" name="leave-2" type="date"/>

                <label htmlFor="leave-3"> Leave 3: </label>
                <input id="leave-3" name="leave-3" type="date"/>
                <Button class="form-btn" />
            </form>
        </div>
    )
}

export default AddStaff;