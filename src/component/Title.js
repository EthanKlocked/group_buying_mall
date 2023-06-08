//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import React from 'react';

//------------------------------ CSS ----------------------------------------
const StyledTitle = styled.div`    
    display:block;
    width:100%;
    position:fixed;
    top:0;
    border-bottom:solid 0.1em #eee;
    height:3.5em;
    background:white;
    z-index:1;
`;
const StyledTitleIcon = styled.span`
    float:left;
    margin-top: 0.8em;
    width:0;
    cursor:pointer;
`;
const StyledTitleText = styled.span`
    line-height:3.5em;
    float:center;
`;
//------------------------------ COMPONENT ----------------------------------
const Title = React.memo(({ text, url=null, sendData=null, windowClose=false }) => {
    //init
    const navigate = useNavigate();

    //render
    return (
        <>
            <StyledTitle id="webTitle">
                <StyledTitleIcon>
                    <IoIosArrowBack size="2em" onClick={() => !windowClose ? navigate(url ? url : -1, { state: sendData }) : window.close()}/>
                </StyledTitleIcon>
                <StyledTitleText>
                    {text}
                </StyledTitleText>
                <div />
            </StyledTitle>
        </>
    );     
});

export default Title;