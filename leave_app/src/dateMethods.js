const dateCalculatorExcludeWeekend = (startDate, endDate, currentMonth) => {
    let holidays = [
        "2022-01-01",
        "2023-01-23",
        "2023-01-24",
        "2023-04-07",
        "2023-04-24",
        "2023-05-01",
        "2023-06-05",
        "2023-06-29",
        "2023-08-09",
        "2023-11-13",
        "2023-12-25"
    ]
    let daysInBetween = [];
    // Loop through range of days
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        // Only add date to array if it is NOT a Saturday or Sunday
        const dateISO = date.toISOString().split("T")[0];
        const isHoliday = holidays.find( (item) => item === dateISO );

        // If the current date's month is not the same as the currentMonth passed in
        // currentMonth is the one that has been selected in the input
        // Then go to the next iteration i.e. next date in the loop
        if (date.getMonth() !== currentMonth) {
            continue;
        } else {
        // To do getDay(), need to be in new Date() format (RFC)
        if(date.getDay() !== 6 && date.getDay() !== 0) {
            // As long as not holiday, push to the array
            if (!isHoliday) {
                daysInBetween.push(new Date(date));
            }
        } 
        }
    }
    // Add .length to the end of the function call to get number of days instead of array
    return daysInBetween;
}

// Pass a default value to month parameter
const getFirstAndLastDay = (month = 0) => {
    // Need to be able to pass in the month and use that info in the function
    const firstAndLast = []
    const currentMoment = new Date();
    // Dates in ISO Format processed to YYYY-MM-DD
    const fullStringFirstDay = new Date(currentMoment.getFullYear(), month, 1);
    const currentMonthFirstDay = new Date(fullStringFirstDay.getTime() - (fullStringFirstDay.getTimezoneOffset() * 60000)).toISOString().split("T")[0];

    const fullStringLastDay = new Date(currentMoment.getFullYear(), month + 1, 0);
    const currentMonthLastDay = new Date(fullStringLastDay.getTime() - (fullStringLastDay.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
    firstAndLast.push(currentMonthFirstDay);
    firstAndLast.push(currentMonthLastDay);
    
    return firstAndLast;
}
export {dateCalculatorExcludeWeekend, getFirstAndLastDay}