//------------------------------ MODULE -------------------------------------
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Title, GoodsQaList } from "component";

//------------------------------ CSS ----------------------------------------
const StyledGoodsQa = styled.div`
    overflow:hidden;
    height:100%;
`;
const StyledContent = styled.div`
    margin:3.5em 0;
    overflow-y:auto;
    height:calc(100% - 7em);
`;
const StyledFooter = styled.div`
    width:100%;
    position:fixed;
    background:#f5f5f5;
    bottom:0;
    height:3em;
`;
const StyledAddButton = styled.div`
    width:93%;
    height:2.5em;
    line-height:2.5em;
    background:crimson;
    font-size:0.9em;
    color:white;
    margin:0.5em auto;
    border-radius:0.3em;
    cursor:pointer;
`;

//------------------------------ COMPONENT ----------------------------------
const GoodsQa = () => {
    //init
    const { state } = useLocation();
    const navigate = useNavigate();

    //render
    return (
        <StyledGoodsQa>
            <Title text='상품문의'/>
            <StyledContent>
                <GoodsQaList limit={10} goodsId={state.goodsId}/>
            </StyledContent>
            <StyledFooter>
                <StyledAddButton onClick={() => navigate('/GoodsQaAdd', { state: { goodsId: state.goodsId } })}>문의하기</StyledAddButton>
            </StyledFooter>
        </StyledGoodsQa>
    )
}

export default GoodsQa;