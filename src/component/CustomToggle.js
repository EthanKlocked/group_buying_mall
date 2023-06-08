//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import React from "react";
import Toggle from 'react-toggle';
import "react-toggle/style.css";

//------------------------------ CSS ----------------------------------------
const StyledSpan = styled.span`
    .react-toggle-screenreader-only{
        display:none;
    } 
    .react-toggle--checked .react-toggle-track {
        background-color: crimson;
    }
    .react-toggle--checked .react-toggle-thumb{
        border-color: crimson;   
    }
    .react-toggle--checked:hover:not(.react-toggle--disabled) .react-toggle-track {
        background-color: crimson;
    } 
`;

//------------------------------ COMPONENT ----------------------------------
const CustomToggle = React.memo(({defaultValue=false, pro=() => {}, cons=() => {}}) => {
    //function
    const test = (e) => {
        if(e.target.checked){
            pro();
        }else{
            cons();
        }
    }

    //render
    return (
        <>
        <StyledSpan>
            <Toggle
                defaultChecked={defaultValue}
                onChange={test} 
            />
        </StyledSpan>     
        </>
    )    
});

export default CustomToggle;