//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import React, { useState, useEffect } from "react";

//------------------------------ CSS ----------------------------------------
const StyledInput = styled.input`
    width:95%;
    letter-spacing:0.5em;
    margin-left:3%;
    font-size:1.1em;
    font-weight:550;
    background:#eee;
    ::placeholder{
        font-size:0.85em;
        letter-spacing:0.2em;
        font-weight:normal;
        color:#aaa;
    }
`;

//------------------------------ COMPONENT ----------------------------------
const NumberInput = React.memo(({number, changeHandler, expression }) => {
    //state
    const [inputValue, setInputValue] = useState('');

    //func
    const handlePress = (e) => {
        let intValue = e.target.value.replace(/[^0-9]/g, '')
        if (intValue.length <= number){
            setInputValue(intValue);
        }
    }

    //effect
    useEffect(() => {
        if(changeHandler) changeHandler(inputValue);
    }, [inputValue]);

    return (
        <StyledInput placeholder={expression} type="number" pattern="[0-9]*" onChange={handlePress} value={inputValue} />
    );
});

export default NumberInput;

