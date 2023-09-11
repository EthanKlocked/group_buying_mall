//------------------------------ MODULE -------------------------------------
import React, { useState, useEffect } from 'react';
import styled from "styled-components";

//------------------------------ CSS ----------------------------------------
const StyledInput = styled.input``;

//------------------------------ COMPONENT ----------------------------------
const PriceInput = React.memo(({changeHandler = null, max = null}) => {
    //state
    const [inputValue, setInputValue] = useState(0);
    const [inputDisplay, setInputDisplay] = useState('0');

    //func
    const handlePress = (e) => {
        try{
            const val = e.target.value;
            const removedCommaVal = Number(val.replaceAll(",", ""));
            if(isNaN(removedCommaVal)) setInputValue(0);
            else setInputValue(max < removedCommaVal ? max : removedCommaVal);
        }catch(e){
            setInputValue(0);
        }
    }

    //effect
    useEffect(() => {
        setInputDisplay(inputValue.toLocaleString());
        if(changeHandler) changeHandler(inputValue);
    }, [inputValue])
    

    //render
    return (
        <StyledInput type="text" onChange={handlePress} value={inputDisplay}/>
    );
});

export default PriceInput;

