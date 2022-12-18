const dateCalculator = (date1, date2) => {
    let start= new Date(date1);
    let end = new Date(date2);
    let diff_in_time = end.getTime() - start.getTime();
    return 1 + (diff_in_time / (1000 * 3600 * 24));
}

export {dateCalculator}