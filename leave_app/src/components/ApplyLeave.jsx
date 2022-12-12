import React from 'react';
import Button from "./Button";
import {gapi, CLIENT_ID, API_KEY, DISCOVERY_DOC, SCOPES} from '../gapi'

const ApplyLeave = () => {
    // apply leave, need to minus one from existing leave
    // apply leave, need to add the type of leave
    const handleAddLeave = (e) => {
        e.preventDefault()
        gapi.load('client:auth2', () => {
            console.log("Client loaded")
            
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

            gapi.auth2.getAuthInstance().signIn()
            .then( () => {
                let event = {
                    'summary': 'Google I/O 2015',
                    'location': '800 Howard St., San Francisco, CA 94103',
                    'description': 'A chance to hear more about Google\'s developer products.',
                    'start': {
                      'dateTime': '2022-12-12T09:00:00-07:00',
                      'timeZone': 'America/Los_Angeles'
                    },
                    'end': {
                      'dateTime': '2022-12-13T17:00:00-07:00',
                      'timeZone': 'America/Los_Angeles'
                    },
                    'recurrence': [
                      'RRULE:FREQ=DAILY;COUNT=2'
                    ],
                    'attendees': [
                      {'email': 'lpage@example.com'},
                      {'email': 'sbrin@example.com'}
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
            <input id="name" name="name" placeholder="Name: "/>

            <label htmlFor='reason'> Reason for Leave: </label>
            <input id="reason" name="reason" placeholder="Reason for Leave: "/>
            
            <label htmlFor="start"> Start Date </label>
            <input id="start" name="duration" type="date"/>

            <label htmlFor="end"> End Date </label>
            <input id="end" name="duration" type="date"/>
            <Button onClick={handleAddLeave} class="form-btn" text="Apply Leave" />
        </form>
    </div>
    )
}

export default ApplyLeave;