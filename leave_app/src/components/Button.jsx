import React from 'react';

const Button = (props) => {
    return (
        <button className={props.class} type="submit" onClick={props.onClick}></button> 
    )
}

export default Button;