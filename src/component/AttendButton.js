//------------------------------ MODULE -------------------------------------
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { apiCall, numberForm } from 'lib';
import { msgData } from "static";
import { Modal } from 'component';

//------------------------------ COMPONENT ----------------------------------
const AttendButton = () => {
    //init
    const token = localStorage.getItem("token");    

    //state
    const [alertMsg, setAlertMsg] = useState(null);
    const [alertTitle, setAlertTitle] = useState(null);

    //function
    const attendanceChk = async() => {
        const pointRequest = await apiCall.put("/member/any/point", { type : 'attend' }); 
        const result = pointRequest?.data?.res;
        const amount = pointRequest?.data?.amount;

        if(result === "success") {
            setAlertTitle("출석체크 완료");
            return setAlertMsg(
                <StyledAlertText>
                    <StyledAlertTextHighLight>{numberForm(amount)}</StyledAlertTextHighLight> 포인트가 지급 되었습니다!
                </StyledAlertText>
            );
        }
        setAlertTitle(null);
        if(result === "not") return setAlertMsg(msgData["needLogin"]);
        if(result === "already") return setAlertMsg(msgData["attendAlready"]);
        return setAlertMsg(msgData["error"]);        
    }

    //memo
    const buttonGear = useMemo(() => (
        <StyledContainer onClick = {attendanceChk}>
            <StyledImage src="https://www.popsockets.com/dw/image/v2/BFSM_PRD/on/demandware.static/-/Sites-popsockets-master-catalog/default/dw308e2a5e/images/hi-res/PopOuts_Stitch_01_Top-View.png?sw=800&sh=800"/>
            <StyledSub>출 첵 !!</StyledSub>
        </StyledContainer>        
    ), []);

    const alertGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "70%", 
                    height : "8em", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "0.8em", 
                    buttonName : ["확인"]
                }} 
                type={1} 
                data={{title: alertTitle, desc : alertMsg}}
                state={alertMsg} 
                closeEvent={() => {
                    setAlertMsg(false);
                    return true;    
                }}
            />     
        )        
    }, [alertMsg, alertTitle]);    

    //render
    return !token ? null : (
        <>
        {buttonGear}
        {alertGear}
        </>
    )
};

export default AttendButton;

//------------------------------ CSS ----------------------------------------
const StyledContainer = styled.span`
    position:fixed;
    z-index:3;
    top:20%;
    right:5%;
    background:#F08080;
    border-radius:20px;
    height:80px;
    cursor:pointer;
`;
const StyledImage = styled.img`
    width:60px;
    height:60px;
    border-radius:50%;
`;
const StyledSub = styled.div`
    color:white;
    font-weight:600;
    font-size:0.8em;
    text-align:center;
    position:absolute;
    bottom:10px;
    width:100%;
`;
const StyledAlertText = styled.span`
    font-weight:500;
`;
const StyledAlertTextHighLight = styled.span`
    color:crimson;
    font-weight:600;
    font-size:1.4em;
`;