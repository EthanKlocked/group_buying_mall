//------------------------------ MODULE -------------------------------------
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { Title, ReviewListGoods } from "component";

//------------------------------ CSS ----------------------------------------
const StyledReview = styled.div`
    height:100%;
    overflow:hidden;
`;
const StyledContent = styled.div`
    padding-top:4em;
    overflow:auto;
    height:100%;
`;
const StyledEmpty = styled.div`
    height:8em;
`;

//------------------------------ COMPONENT ----------------------------------
const Review = () => {
    //init
    const { state } = useLocation();

    //render
    return (
        <StyledReview>
            <Title text={`구매 후기 ${state.reviewCnt}건`}  />
            <StyledContent>
                <ReviewListGoods limit={7} infiniteScroll={true} goodsId={state.goodsId} size={9}/>
                <StyledEmpty />
            </StyledContent>
        </StyledReview>
    )
}

export default Review;