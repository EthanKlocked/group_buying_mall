//------------------------------ MODULE -------------------------------------
import React, { useState, useEffect } from 'react';
import styled from "styled-components";

//------------------------------ CSS ----------------------------------------
const StyledInput = styled.input`
    text-align:left;
    margin-left:0.5em;
    background:#eee;
    font-size:1.05em;
    *{
        background:#eee;
    }
`;

//------------------------------ COMPONENT ----------------------------------
const MobileInput = React.memo(({changeHandler = null, defaultNumber=''}) => {
    //state
    const [inputValue, setInputValue] = useState(defaultNumber == '없음' ? '' : defaultNumber);

    //func
    const handlePress = (e) => {
        const regex = /^[0-9\b -]{0,13}$/;
        if (regex.test(e.target.value)) {
            setInputValue(e.target.value);
        }
    }

    const handlePaste = (e) => {
        e.stopPropagation();
        e.preventDefault();

        const paste = (e.clipboardData || window.clipboardData).getData('text');
        const regex = /^[0-9\b -]{0,13}$/;
        if (regex.test(paste)) {
            setInputValue(paste);
        }
    }

    //effect
    useEffect(() => {
        const barCnt = inputValue.split('-').length - 1;
        if (inputValue.length === 10) {
            setInputValue(inputValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
        }
        if (inputValue.length === 11) { //when whole number set pasted 
            setInputValue(inputValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
        }        
        if ( (inputValue.length === 12 && barCnt<2) || inputValue.length === 13) {
            setInputValue(inputValue.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
        }
        if(changeHandler) changeHandler(inputValue);
    }, [inputValue]);

    return (
        <StyledInput type="tel" pattern="[0-9]*" onChange={handlePress} onPaste={handlePaste} value={inputValue} autoComplete="tel"/>
    );
});

export default MobileInput;

