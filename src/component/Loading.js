//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { ImSpinner3 } from "react-icons/im";
import React from "react";

//------------------------------ CSS ----------------------------------------
const StyledLoadingBox = styled.div`        
    display:grid;
    justify-content:center;
    margin-top:50%;
    font-size:500%;
    color:#bbb;
`;

//------------------------------ COMPONENT ----------------------------------
const Loading = React.memo(() => {
    //render
    return (
        <>
            <StyledLoadingBox><ImSpinner3 className="icon-spin"/></StyledLoadingBox>
        </>
    );     
});

export default Loading;