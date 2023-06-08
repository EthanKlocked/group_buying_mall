//------------------------------ MODULE -------------------------------------
import React, {useState} from 'react';
import styled from "styled-components";
import { BsStarFill } from "react-icons/bs";

//------------------------------ CSS ----------------------------------------
const StyledStarRow = styled.div`
    text-align:start;
    font-size:${(props) => props.size ? props.size : "1em"};
    svg{
        margin-right:0.5%;
        cursor:pointer;
    }
    .scorePoint{
        margin-left:2%;
        color:#aaa;
        font-weight:550;   
        vertical-align:middle;
    }
    .extraInfo{
        margin-left:2%;
        color:#aaa;
        font-size:0.8em;
        vertical-align:middle;
    }
`;

//------------------------------ COMPONENT ----------------------------------
const StarScore = ({ size=null, nick, score = 0, scoreHandler=()=>{}, scoreDisplay=false, extraInfo=null, activeChk = false }) => { //each nick shoud be different
    return (
        <>
        <StyledStarRow size={size}>
        {[...Array(parseInt(5))].map((item, index) => (
            <span key={index} style={{verticalAlign:'middle'}}>
                {
                    !activeChk ? (
                        <>
                        <svg width="0" height="0">
                        <linearGradient id={`gradient${index}${nick}`} x1="0%" x2="100%">
                            <stop stopColor="#FFD228" offset={index+1 <= score ? "100%" : (index+1 == Math.ceil(score) ? "50%" : "0%")} />
                            <stop stopColor="#ddd" offset="0%" />
                        </linearGradient>
                        </svg>
                        <BsStarFill style={{ fill: `url(#gradient${index}${nick})`}} onClick={() => scoreHandler(index+1)}/>    
                        </>
                    ) : ( //only for IOS safari issue...
                        <BsStarFill color={index+1 <= score ? "#FFD228" : "#ddd"} onClick={() => scoreHandler(index+1)}/>    
                    )
                }
            </span>  
        ))}
        {scoreDisplay ? <span className="scorePoint">{Number.isInteger(score) ? `${score}.0` : score}</span> : null}
        {extraInfo ? <span className="extraInfo">{extraInfo}</span> : null}
        </StyledStarRow>        
        </>
    );
};

export default StarScore;