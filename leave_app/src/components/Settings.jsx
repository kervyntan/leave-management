import React, {useEffect, useRef, useState} from 'react';
import Button from "./Button"
import { Checkbox } from '@mantine/core';

const Settings = () => {

    // What should the user be able to edit 
    // Edit what types of leave should be shown to the user (Checkbox style, so if checked then true)
    // Need a log in page for this?
    const checkbox = useRef("")
    useEffect (() => {
        setChecked({...checked, annual : true })
    }, [])
    const [checked, setChecked] = useState(
        {
            annual : false
        }
    );
    const [counter, setCounter] = useState(0);
    useEffect( () => {
        console.log(checked)
    }, [checked])


    const addLeave = () => {
        setCounter(counter + 1)
        setChecked({...checked, counter : ""})
    }
    return (
        <div className="settings">
            <p> Which leaves should be shown to the user? </p>
            <Button onClick={addLeave} />
            <Checkbox checked={checked.annual} ref={checkbox} label="I agree to sell my privacy"/>
        </div>
    )
}

export default Settings;