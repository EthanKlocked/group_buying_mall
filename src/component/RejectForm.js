//------------------------------ MODULE -------------------------------------
import React, { useState } from 'react';
import styled from "styled-components";
import { apiCall, nameCut, priceForm } from "lib";

//------------------------------ CSS ----------------------------------------

const StyledRejectForm = styled.div`
    height:100%;
`;
const StyledSection = styled.div`
    padding:0.5em 0;
    text-align:start;
`;
const StyledContent = styled.div`
    height:4em;
`;
const StyledImage = styled.span`
    display:inline-block;
    width:30%;
    img{
        height:4em;
    }
    margin-right:1em;
`;
const StyledInfo = styled.span`
    width:60%;
    display:inline-block;
    font-size:0.8em;
    height:4em;
    vertical-align:top;
`;
const StyledInfoStatus = styled.div`
    text-align:start;
    padding-bottom:0.1em;
    font-weight:550;
`;
const StyledInfoGoods = styled.div`
    text-align:start;
`;
const StyledInfoCnt = styled.div`
    text-align:start;
    color:#888;
`;
const StyledInfoAmount = styled.div`
    text-align:start;
    color:red;
`;
const StyledSemiTitle = styled.div`
    text-align:start;
    font-size:0.8em;
    font-weight:550;
    padding-bottom:0.3em;
    position:relative;
`;
const StyledSemiSubtitle = styled.span`
    position:absolute;
    right:0;
    top:0.1em;
    font-size:0.5em;
    color:crimson;
`;
const StyledTextarea = styled.textarea`
    width:100%;
    height:6em;
    resize:none;
    border-radius:0.3em;
    text-align:start;
    padding:0.5em;
    &:focus{
        outline:none;
    }
`;
const StyledRadioInfo = styled.div`
    width:100%;
    display:grid;
    grid-template-columns: 2fr 2fr 4fr;
    justify-items:start;
    align-content:center;
    align-items:center;
    height:2em;
    text-align:start;
    font-size:0.8em;
    input[type="radio"]:checked {   
        position: relative;
        border-color: crimson;
        color: white;
        background: crimson;
    }
    input[type="radio"] {
        -webkit-appearance: none;
        position: relative;
        width: 1.5em;
        height:1.5em;
        border-radius:50%;
        border: solid 1px #aaa;
        cursor: pointer;
    }
`;
const StyledRadioSet = styled.div`
    display:grid;
    grid-template-columns: 1fr 2fr;
    align-items:center;
`;
const StyledCustomRadio = styled.input`
`;
const StyledLabel = styled.label`
    color:#aaa;
    cursor:pointer;
`;
const StyledSubmit = styled.div`
    height:2.5em;
    background:crimson;
    color:white;
    font-size:0.8em;
    border-radius:0.5em;
    line-height:2.5em;
    cursor:pointer;
`

//------------------------------ COMPONENT ----------------------------------
const RejectForm = React.memo(({dt, selfHandler, resultHandler}) => {
    //state
    const [type, setType] = useState('exchange');
    const [text, setText] = useState(null);

    //function
    const send = async() => {
        if(text == null || text== '') return setText(false);

        const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
        const params = { 'orderNum' : dt.odNo };
        if(type == 'exchange'){
            params.orderStatus = '21';
            params.changeMessage = text;
        }else if(type == 'refund'){
            params.orderStatus = '31';
            params.returnReason = text;
        }
        const orderUpdateResult = await apiCall.put("/order", {params}, {headers}); 
        if(orderUpdateResult){
            selfHandler(null);
            resultHandler(type=='exchange' ? '교환 신청이 완료되었습니다.' : '반품 신청이 완료되었습니다.');
        }else{
            selfHandler(null);
            resultHandler('문제가 발생하였습니다. 고객센터로 문의 해 주세요.');
        }
    }

    //render
    return (
        <StyledRejectForm>
            <StyledSection>
                <StyledContent>
                    <StyledImage>
                        <img src={`${process.env.REACT_APP_SERVER_URL}${dt.goodsInfo.simg1}`}/>
                    </StyledImage>
                    <StyledInfo>
                        <StyledInfoStatus>{dt.invoiceDate.substr(0, 10)} 배송 완료</StyledInfoStatus>
                        <StyledInfoGoods>{nameCut(dt.goodsInfo.goodsName, 15)}</StyledInfoGoods>
                        <StyledInfoCnt>주문수량 : {dt.qty}개</StyledInfoCnt>
                        <StyledInfoAmount>{priceForm(dt.amount)}</StyledInfoAmount>
                    </StyledInfo>
                </StyledContent>
            </StyledSection>
            <StyledSection>
                <StyledSemiTitle>
                    반품/교환
                </StyledSemiTitle>  
                <StyledRadioInfo>
                    <StyledRadioSet onClick={() => setType("exchange")}>
                        <StyledCustomRadio id="exchange" type="radio" name="reject" defaultChecked={true}/>
                        <StyledLabel htmlFor="exchange" >교환</StyledLabel>
                    </StyledRadioSet>
                    <StyledRadioSet onClick={() => setType("refund")}>
                        <StyledCustomRadio id="refund" type="radio" name="reject"/>
                        <StyledLabel htmlFor="refund" >반품</StyledLabel>
                    </StyledRadioSet>
                </StyledRadioInfo>
            </StyledSection>
            <StyledSection>
                <StyledSemiTitle>
                    상세 사유 입력
                    {text===false ? <StyledSemiSubtitle>신청 사유를 입력 해 주세요.</StyledSemiSubtitle> : null}
                </StyledSemiTitle>  
                <StyledTextarea onChange={(e) => setText(e.target.value)} placeholder="교환 및 반품 사유를 작성 해 주세요."></StyledTextarea>
            </StyledSection>
            <StyledSubmit onClick={send}>신청하기</StyledSubmit>
        </StyledRejectForm>
    );
});

export default RejectForm;

