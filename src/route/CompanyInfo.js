//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { Title } from "component";
import { useContext } from "react";
import { BaseContext } from "context";

//------------------------------ CSS ----------------------------------------
const StyledCompanyInfo = styled.div`
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
const CompanyInfo = () => {
    //context
    const { base } = useContext(BaseContext);

    //render
    return (
        <>
        <StyledCompanyInfo>
            <Title text='사업자 정보'/>
            <StyledContent>
                <StyledInfo>
                    <StyledInfoTitle>상호 / 대표</StyledInfoTitle>
                    <StyledInfoContent>{base.companyName} / {base.companyOwner}</StyledInfoContent>
                </StyledInfo>
                <StyledInfo>
                    <StyledInfoTitle>전화번호</StyledInfoTitle>
                    <StyledInfoContent>{base.companyTel}</StyledInfoContent>
                </StyledInfo>
                <StyledInfo>
                    <StyledInfoTitle>이메일</StyledInfoTitle>
                    <StyledInfoContent>{base.companyEmail}</StyledInfoContent>
                </StyledInfo>
                <StyledInfo>
                    <StyledInfoTitle>주소</StyledInfoTitle>
                    <StyledInfoContent>{base.companyAddr}</StyledInfoContent>
                </StyledInfo>
                <StyledInfo>
                    <StyledInfoTitle>통신판매업 신고</StyledInfoTitle>
                    <StyledInfoContent>{base.tolsinNo}</StyledInfoContent>
                </StyledInfo>                       
                <StyledInfo>
                    <StyledInfoTitle>사업자 번호</StyledInfoTitle>
                    <StyledInfoContent>{base.saupjaNo}</StyledInfoContent>
                </StyledInfo>                                                                
            </StyledContent>
        </StyledCompanyInfo>
        </>
    )
}

export default CompanyInfo;