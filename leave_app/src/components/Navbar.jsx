import React from 'react';
// import {Link} from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="nav">
            {/* <Link to="/"> Home </Link>
            <Link to="/"> Apply Leave </Link>
            <Link to="/"> Add Staff </Link> */}
            <a href="/">Home</a>
            <a href="/">Apply Leave</a>
            <a href="/">Add Staff</a>
            
        </div>
    )
}

export default Navbar;