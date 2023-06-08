//------------------------------ MODULE -------------------------------------
import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import styled from "styled-components";
import { Title, ReviewListSeller, CustomLoading } from "component";

//------------------------------ CSS ----------------------------------------
const StyledSellerReview = styled.div`
    height:100%;
    overflow:hidden;
`;
const StyledContent = styled.div`
    margin-top:4em;
    overflow:auto;
    height:100%;
`;
const StyledEmpty = styled.div`
    height:8em;
`;

//------------------------------ COMPONENT ----------------------------------
const SellerReview = () => {
    //init
    const { state } = useLocation();

    //state
    const [loading, setLoading] = useState(false);

    //render
    return (
        <StyledSellerReview>
            {loading ? <CustomLoading opacity={0.5}/> : null}
            <Title text={state.name}  />
            <StyledContent>
                <ReviewListSeller sellerId={state.id} limit={8} loadingHandler={setLoading}/>
                <StyledEmpty />
            </StyledContent>
        </StyledSellerReview>
    )
}

export default SellerReview;