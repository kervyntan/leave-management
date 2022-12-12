import React, {useRef} from 'react';
import Button from "./Button";
import {gapi, CLIENT_ID, API_KEY, DISCOVERY_DOC, SCOPES} from '../gapi'

const ApplyLeave = () => {
    // separate the app into client and server
    // apply leave, need to minus one from existing leave
    // apply leave, need to add the type of leave
    const startDate = useRef("startDate")
    const endDate = useRef("endDate")
    const reason = useRef("reason")
    const name = useRef("name")
    const leave = useRef("leave")

    const handleAddLeave = (e) => {
        e.preventDefault()
        // load the auth
        gapi.load('client:auth2', () => {
            console.log("Client loaded")
            
            // init with credentials
            gapi.client.init({
                apiKey : API_KEY,
                clientId : CLIENT_ID,
                discoveryDocs : DISCOVERY_DOC,
                scope : SCOPES,
                plugin_name : 'leave-management-371308'
            })

            gapi.client.load('calendar', 'v3', () => {
                console.log("added!")
            })
            // triggers popup to sign in to google
            gapi.auth2.getAuthInstance().signIn()
            .then( () => {
                let event = {
                    'summary': `${name.current.value} - ${reason.current.value}`,
                    'description': `${leave.current.value}`,
                    'start': {
                        'dateTime' : `${startDate.current.value}T00:00:00+08:00`,
                        'timeZone' : 'Asia/Singapore'
                    },
                    'end': {
                      'dateTime': `${endDate.current.value}T00:00:00+08:00`,
                      'timeZone': 'Asia/Singapore'
                    },
                    'recurrence': [
                      'RRULE:FREQ=DAILY;COUNT=2'
                    ],
                    'reminders': {
                      'useDefault': false,
                      'overrides': [
                        {'method': 'email', 'minutes': 24 * 60},
                        {'method': 'popup', 'minutes': 10}
                      ]
                    }
                  };
                let request = gapi.client.calendar.events.insert({
                    'calendarId' : 'kervyntan@gmail.com',
                    'resource' : event,
                })

                request.execute(event => {
                    window.open(event.htmlLink)
                })
            })

        })
    }
    return (
        <div className="container">
        <form className="apply-leave-form">
        <label htmlFor='name'> Name: </label>
            <input ref={name} id="name" name="name" placeholder="Name: "/>

            <label htmlFor='reason'> Reason for Leave: </label>
            <input ref={reason} id="reason" name="reason" placeholder="Reason for Leave: "/>

            <label htmlFor='type'> Type of Leave: </label>
            <select ref={leave} id="type" name="type" placeholder="Type of Leave: ">
            <option value="Annual"> Annual </option>
            <option value="Compassionate"> Compassionate </option>
            <option value="No_Pay"> No Pay </option>
            <option value="Paternity"> Paternity </option>
            <option value="Maternity"> Maternity </option>
            </select>

            
            <label htmlFor="start"> Start Date </label>
            <input ref={startDate} id="start" name="duration" type="date" />

            <label htmlFor="end"> End Date </label>
            <input ref={endDate} id="end" name="duration" type="date"/>
            <Button onClick={handleAddLeave} class="form-btn" text="Apply Leave" />
        </form>
    </div>
    )
}

export default ApplyLeave;