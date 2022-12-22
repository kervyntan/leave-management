const dateCalculatorExcludeWeekend = (startDate, endDate) => {
    let daysInBetween = [];
    // Loop through range of days
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        // Only add date to array if it is NOT a Saturday or Sunday
        if(date.getDay() !== 6 && date.getDay() !== 0) {
            daysInBetween.push(new Date(date));
        } 
    }

    return daysInBetween.length;
}


export {dateCalculatorExcludeWeekend}