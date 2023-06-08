//------------------------------ MODULE -------------------------------------
import { useLocation, } from "react-router-dom";
import styled from "styled-components";
import { Title } from "component";

//------------------------------ CSS ----------------------------------------
const StyledSellerInfo = styled.div`
    overflow:hidden;
    height:100%;
    p{
        text-align:start;
    }
`;
const StyledContent = styled.div`
    margin:4.5em 1em;
    overflow-y:auto;
    height:calc(100% - 6em);
    font-size:0.8em;
`;
const StyledInfo = styled.div`
    padding:0.5em;
    border-bottom: solid 1px #555;
`;
const StyledInfoTitle = styled.span`
    display:inline-block;
    font-weight:bold;
    width:35%;
    text-align:start;
    vertical-align:middle;
`;
const StyledInfoContent = styled.span`
    display:inline-block;
    width:65%;
    text-align:start;
    vertical-align:middle;
`;

//------------------------------ COMPONENT ----------------------------------
const SellerInfo = () => {
    //init
    const { state } = useLocation();
    console.log(state.data)

    //render
    return (
        <>
        <StyledSellerInfo>
            <Title text='판매자 정보'/>
            <StyledContent>
                <StyledInfo>
                    <StyledInfoTitle>상호 / 대표</StyledInfoTitle>
                    <StyledInfoContent>{state.data.sl_company_name} / {state.data.sl_company_owner}</StyledInfoContent>
                </StyledInfo>
                <StyledInfo>
                    <StyledInfoTitle>전화번호</StyledInfoTitle>
                    <StyledInfoContent>{state.data.sl_company_tel}</StyledInfoContent>
                </StyledInfo>
                <StyledInfo>
                    <StyledInfoTitle>이메일</StyledInfoTitle>
                    <StyledInfoContent>{state.data.sl_company_email}</StyledInfoContent>
                </StyledInfo>
                <StyledInfo>
                    <StyledInfoTitle>주소</StyledInfoTitle>
                    <StyledInfoContent>{state.data.sl_company_addr}</StyledInfoContent>
                </StyledInfo>
                <StyledInfo>
                    <StyledInfoTitle>통신판매업 신고</StyledInfoTitle>
                    <StyledInfoContent>{state.data.sl_company_tolsin_no}</StyledInfoContent>
                </StyledInfo>                       
                <StyledInfo>
                    <StyledInfoTitle>사업자 번호</StyledInfoTitle>
                    <StyledInfoContent>{state.data.sl_company_saupja_no}</StyledInfoContent>
                </StyledInfo>                                                                
            </StyledContent>
        </StyledSellerInfo>
        </>
    )
}

export default SellerInfo;