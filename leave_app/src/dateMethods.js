const dateCalculatorExcludeWeekend = (startDate, endDate) => {
    let daysInBetween = [];
    // Loop through range of days
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        // Only add date to array if it is NOT a Saturday or Sunday
        if(date.getDay() !== 6 && date.getDay() !== 0) {
            daysInBetween.push(new Date(date));
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