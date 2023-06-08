//------------------------------ MODULE -------------------------------------
import React, { useContext } from 'react';
import styled from "styled-components";
import { TbCircleNumber1, TbCircleNumber2, TbCircleNumber3, TbCircleNumber4 } from "react-icons/tb";
import { BaseContext } from "context";

//------------------------------ CSS ----------------------------------------
const StyledPointInfo = styled.div`
`;
const StyledTitle = styled.div`
    font-size:7em;
    font-weight:bold;
`;
const StyledContent = styled.div`
    margin-top:2em;
    font-size: 5em;
`;
const StyledContentList = styled.div`
    margin: 1em 0;
    display:grid;
    grid-template-columns: 1fr auto;
`;
const StyledContentTitle = styled.span`
    font-weight:bold;
    font-size: 1.5em;
    vertical-align:sub;
    margin-right: 0.3em;
`;
const StyledContentDesc = styled.span`
    font-size: 0.9em;
    line-height:2em;
    text-align:start;
`;
const StyledContentBold = styled.span`
    color:crimson;
    font-weight:bold;
`;


//------------------------------ COMPONENT ----------------------------------
const PointInfo = () => {
    //context
    const { base } = useContext(BaseContext);
    const minPoint = base.minPoint || base.default.minPoint;
    const maxPoint = base.maxPoint || base.default.maxPoint;

    //render
    return (
        <StyledPointInfo>
            <StyledTitle>포인트 사용 안내</StyledTitle>
            <StyledContent>
                <StyledContentList>
                    <StyledContentTitle><TbCircleNumber1/></StyledContentTitle>
                    <StyledContentDesc>사용 가능 포인트 <StyledContentBold>{minPoint.toLocaleString()}</StyledContentBold> 포인트 이상일 때 현금처럼 사용 가능합니다.</StyledContentDesc>
                </StyledContentList>
                <StyledContentList>
                    <StyledContentTitle><TbCircleNumber2/></StyledContentTitle>
                    <StyledContentDesc>구매 1회에 한하여 최종결제금액의 <StyledContentBold>10%</StyledContentBold> 까지 사용 가능하며, 최대 <StyledContentBold>{maxPoint.toLocaleString()}</StyledContentBold> 포인트를 초과하여 사용할 수 없습니다.</StyledContentDesc>
                </StyledContentList>
                <StyledContentList>
                    <StyledContentTitle><TbCircleNumber3/></StyledContentTitle>
                    <StyledContentDesc>포인트 유효기간은 적립일로부터 <StyledContentBold>180일</StyledContentBold> 까지이며, 
                    알림설정이 되어 있을 경우 만료 <StyledContentBold>30일</StyledContentBold> 전 설정에따라 1회에 한하여 안내 됩니다.</StyledContentDesc>
                </StyledContentList>
                <StyledContentList>
                    <StyledContentTitle><TbCircleNumber4/></StyledContentTitle>
                    <StyledContentDesc>포인트 적립 상품 구매결제 시 포인트를 사용할 경우, 포인트 사용 금액을 제외한 지불 금액에 대해 포인트가 적립됩니다.</StyledContentDesc>
                </StyledContentList>                                                
            </StyledContent>
        </StyledPointInfo>        
    );
};

export default PointInfo;