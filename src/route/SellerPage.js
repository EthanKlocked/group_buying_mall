//------------------------------ MODULE -------------------------------------
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { Title, SellerGoodsList } from "component";

//------------------------------ CSS ----------------------------------------
const StyledSellerPage = styled.div`
    height:100%;
    overflow:hidden;
`;
const StyledContent = styled.div`
    margin-top:4em;
    overflow:auto;
    height:100%;
    &::-webkit-scrollbar {
        display: none;
    }
`;
const StyledEmpty = styled.div`
    height:8em;
`;

//------------------------------ COMPONENT ----------------------------------
const SellerPage = () => {
    //init
    const { state } = useLocation();

    //render
    return (
        <StyledSellerPage>
            <Title text={state.name}  />
            <StyledContent id="upstreamTarget">
                <SellerGoodsList sellerId={state.id} limit={8}/>
                <StyledEmpty />
            </StyledContent>
        </StyledSellerPage>
    )
}

export default SellerPage;