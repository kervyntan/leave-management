const compareNames = (a,b) => {
    return a.localeCompare(b);
}

const compareStaff = (a,b) => {
    if ( a.name < b.name ) {
      return -1;
    }
    if ( a.name > b.name ) {
      return 1;
    }
    return 0;
}

export {compareNames, compareStaff}