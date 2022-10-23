import React from 'react';
import {Link} from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="nav">
            {/* <Link to="/"> Home </Link>
            <Link to="/"> Apply Leave </Link>
            <Link to="/"> Add Staff </Link> */}
            <Link to="/">Home</Link>
            <Link to="/applyleave">Apply Leave</Link>
            <Link to="/addstaff">Add Staff</Link>
            {/* <Link to="/"></Link>             */}
        </div>
    )
}

export default Navbar;