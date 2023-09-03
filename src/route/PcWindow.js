//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { CustomLoading } from "component";
import React, { useState, useEffect, useContext } from 'react';
import webBackground from 'data/img/webBackground3.jpg';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { BaseContext } from "context";

//------------------------------ CSS ----------------------------------------
const StyledContainer = styled.div`
    height:100%;
    overflow:hidden;
    position:relative;
    background:url(${webBackground});
    background-size:cover;
    /*background: radial-gradient(coral, transparent);*/
`;
const StyledWindow = styled.div`
    position:absolute;
    top:5%;
    right:21%;
    width:372px;
    height:85%;
    border:solid 0.1em #eee;
    border-radius:1em;
    overflow:hidden;
    background:white;
`;
const StyledIframe = styled.iframe`
    border:none;
    width:100%;
    height:100%;
`;
const StyledFooterBusinessInfo = styled.div`
    text-align:start;
    padding:1em 2.5em;
    font-size:0.7em;
    background:transparent;
    position:absolute;
    bottom:1em;
    color:#555;
`;

//------------------------------ COMPONENT ----------------------------------
const PcWindow = () => {
    console.log(window.location.href);
    console.log(window.location.pathname);
    //context
    const { base } = useContext(BaseContext);
    
    //state
    const [loading, setLoading] = useState(true);

    //function
    const takeMessage = e => {
        // check the origin of the message to make sure it's coming from the correct domain
        if (e.origin !== `${process.env.REACT_APP_HOST}`) return;
        console.log("Received message from iframe:", e.data);

        if(e.data.type=="toss") tossOrderFromIframe(e.data);
        if(e.data.type=="kakao") kakaoLoginFromIframe(e.data);
        return;
    }

    const tossOrderFromIframe = (orderData) => {
        return loadTossPayments(orderData.clientKey).then(tossPayments => {
            tossPayments.requestPayment(`카드`, orderData.orderObject);
        }).catch((error) => {
            console.log(error);
        });
    }

    const kakaoLoginFromIframe = (loginData) => {
        window.location.replace(loginData.loginUrl);
    }

    //effect
    useEffect(() => {
        //loading
        setTimeout(() => setLoading(false), 1500);

        //add event to get message from iframe
        window.addEventListener("message", takeMessage);        

        //cleanup
        return () => window.removeEventListener("message", takeMessage);        
    }, []);

    useEffect(() => {
        if(loading) return;
        //url fixed to PublicNone
        if(typeof (window.history.pushState) != "undefined") { 
            window.history.pushState(null, null, 'PublicNone'); 
        }else{ 
            //브라우저가 지원하지 않는 경우 처리
        }
    }, [loading]);

    //render
    return (
        <StyledContainer>
            <StyledWindow>
                {loading ? <CustomLoading opacity="0.3" position="absolute" size="30px"/> : null}
                <StyledIframe id="iframeContainer" scrolling="no" src={`${window.location.href}`}>
                    점검 중 입니다.
                </StyledIframe>
            </StyledWindow>
            <StyledFooterBusinessInfo>
                <br />                
                법인명 : {base.companyName} /
                대표자 : {base.companyOwner} /
                사업자 등록번호 : {base.saupjaNo} /
                통신판매업 신고번호 : {base.tolsinNo} <br/>
                주소 : {base.companyAddr} /
                이메일 : {base.companyEmail} <br/>
                Copyright©alldeal Corp.All right reserved.
                <br />                
            </StyledFooterBusinessInfo>                        
        </StyledContainer>
    )
}

export default PcWindow;