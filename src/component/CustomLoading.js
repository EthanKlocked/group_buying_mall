//------------------------------ MODULE -------------------------------------
import styled, { keyframes } from "styled-components";
import React from "react";

//------------------------------ CSS ----------------------------------------
const bounce = keyframes`
    100% {
        opacity: 0.1;
        transform: translateY(-16px);
    }
`;
const StyledContainer = styled.div`
    display:grid;
    background:white;
    opacity: 1;
    height:100%;
    width:100%;
    position:${(props) => props.position};
    z-index:5;
    ${(props) => props.opacity ? `background-color:#000; opacity: ${props.opacity};` : null}
    ${(props) => props.cover? `top:${props.coverTop};` : null}
`;
const StyledLoader = styled.div`
    display: flex;
    justify-content: center;
    align-items:center;
    margin-bottom:${(props) => props.marginB};
    & div {
        width: ${(props) => props.size};
        height: ${(props) => props.size};
        margin: 3px 6px;
        border-radius: 50%;
        background-color: ${(props) => props.color};
        opacity: 1;
        animation: ${bounce} 0.6s infinite alternate;        
    } 
    & div:nth-child(2) {
        animation-delay: 0.2s;
    }
    & div:nth-child(3) {
        animation-delay: 0.4s;
    }
`;

//------------------------------ COMPONENT ----------------------------------
const CustomLoading = React.memo(({opacity=null, color="red", size="20px", marginB="30%", cover=false, coverTop=0, position="fixed"}) => {
  return (
    <StyledContainer position={position} opacity={opacity || null} cover={cover} coverTop={coverTop}>
        <StyledLoader color={color} size={size} marginB={marginB}>
        <div></div>
        <div></div>
        <div></div>
        </StyledLoader>
    </StyledContainer>
  );
});

export default CustomLoading;