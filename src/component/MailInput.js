//------------------------------ MODULE -------------------------------------
import React, { useState } from 'react';
import styled from "styled-components";

//------------------------------ CSS ----------------------------------------
const StyledBox = styled.div`
    display:grid;
    grid-template-columns: 2.7fr 0.7fr 3.3fr;
    align-items:center;
    height:2em;
`;
const StyledInput = styled.input`
    background:#eee;
    padding:0.7em 0 0.7em 0.7em;
    border-radius:0.7em;  
    font-size:1em;
`;
const StyledSelect = styled.input`
    text-align:left;
    background:#eee;
    padding:0.7em;
    border-radius:0.7em;  
    font-size:1em;
`;

//------------------------------ COMPONENT ----------------------------------
const MailInput = React.memo(({changeHandler = null}) => {
    //state
    const [inputValue, setInputValue] = useState('');
    const options = [
        "",
        "gmail.com",
        "hanmail.net",
        "naver.com",
        "daum.net",
        "yahoo.co.kr",
    ]

    //func
    const handlePress = (e) => {
        setInputValue(e.target.value.replace(/[^a-z0-9_-]/gi,''));
    }

    return (
            <StyledBox>
                <StyledInput type="text" onChange={handlePress} value={inputValue}/>
                <span style={{"fontSize" : "150%"}}>@</span>
                <StyledSelect type="text" name="mail" list="mailName" />
                <datalist id="mailName">
                    { options.map((val, index) => <option key={index} value={val} />) }
                </datalist>
            </StyledBox>
    );
});

export default MailInput;

