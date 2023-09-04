//------------------------------ MODULE -------------------------------------
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Logo, Modal, SimpleMotion } from "component";
import { RiKakaoTalkFill, RiAppleFill } from "react-icons/ri";
import { GoDeviceMobile } from "react-icons/go";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { OrderContext, SelfContext } from "context";
import { msgData } from "static";
import {isIOS, isMobile} from "react-device-detect";
import AppleLogin from 'react-apple-login';
const {Kakao} = window;

//------------------------------ CSS ----------------------------------------
const StyledContainer = styled.div`
    display:grid;
    height:100%;
    grid-template-rows: repeat(3, 1fr);
`;
const StyledHeader = styled.div`
    display:grid;
    height: 100%;
    justify-content:center;
    align-content:center;
`;
const StyledHeaderSub = styled.div`
    display:grid;
    font-weight:600;
    margin-top:5%;
`;
const StyledContent = styled.div`
    display:grid;
    width: 100%;
    height: 100%;
`;
const StyledContentTitle = styled.div`
    display:grid;
    font-size:0.8em;
    font-weight:600;
    align-content:center;
`;
const StyledButton = styled.div`
    display:grid;
    font-size:0.8em;
    height: 90%;
    width: 85%;
    background:${props => props.color ? props.color : `white`};
    grid-template-columns: 1fr 3fr 1fr;
    justify-items:center;
    align-items: center;
    margin:0.1em auto ;
    border:${props => props.color ? `solid 0.1em ${props.color}` : `solid 0.1em #ccc`};
    cursor:pointer;
`;
const StyledExtra = styled.div`
    display:grid;
    width: 85%;
    margin:0.5em auto;
    grid-template-columns: 1fr 1fr;  
`;
const StyledExtraLink = styled.div`
    display:grid;
    width:100%;
    height:80%;
    align-items:center;
    text-align:left;
    font-size:0.6em;
`;
const StyledExtraButton = styled.div`
    display:grid;
    width:70%;
    color:white;
    align-items:center;
    background: #E73737; 
    justify-self:end;
    height:80%;
    font-size:0.7em;
    cursor:pointer;
`;
const StyledFooter = styled.div`
    display:grid;
    height: 65%;
    align-content:center;
    font-size:0.8em;
    div > span{
        &:first-child{
            font-weight:bold;
        }
        margin:5px;
    }
`;

//------------------------------ COMPONENT ----------------------------------
const Login = React.memo(() => {
    //context
    const { order, setOrderHandler } = useContext(OrderContext);
    const { setSelfHandler } = useContext(SelfContext);

    //init
    const KAKAO_API_KEY = process.env.REACT_APP_KAKAO_KEY;
    const KAKAO_REDIRECT = process.env.REACT_APP_KAKAO_REDIRECT;
    const APPLE_CLIENT = process.env.REACT_APP_APPLE_CLIENT;
    const APPLE_REDIRECT = process.env.REACT_APP_APPLE_REDIRECT;
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const SearchParams = new URLSearchParams(useLocation().search);
    const appleError = SearchParams.get('applelogin');    
    
    //state
    const [loginAlert, setLoginAlert] = useState(false);
    const [iframeAlert, setIframeAlert] = useState(false);

    //function
    const kakaoAuth = async() => {
        //use sdk for mobile only
        if(isMobile) return Kakao.Auth.authorize({redirectUri: `${KAKAO_REDIRECT}`});
        
        //setting
        const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_API_KEY}&redirect_uri=${KAKAO_REDIRECT}`;

        //iframe ban
        //if(window.self != window.top/*IFRAME CHK*/) return setIframeAlert({desc:"카카오톡 로그인은 모바일 기기를 통해 alldeal.kr로 접속하여 이용 해 주세요.", title:"모바일을 통해 접속 해 주세요!"});        

        //order set
        if(order && order.set) window.localStorage.setItem('orderSet', JSON.stringify(order.set));

        //kakao login open [iframe]
        if(window.self != window.top/*IFRAME CHK*/) return window.parent.postMessage({type:"kakao", loginUrl:kakaoLoginUrl}, `${process.env.REACT_APP_HOST}`);

        //kakao login open [normal]
        window.location.href = kakaoLoginUrl;
        return;
    }

    //effect
    useEffect(() => {
        //kakao sdk init
        if(isMobile && Kakao && !Kakao.isInitialized()) Kakao.init(`${process.env.REACT_APP_KAKAO_J_KEY}`);

        //apple login error alert
        if(appleError && appleError == "error") setLoginAlert('appleAuthErr');
    }, []);

    useEffect(() => {
        if(order){
            const refreshObj = {};
            refreshObj['ready'] = null;
            refreshObj['set'] = order.ready;
            setOrderHandler(refreshObj); //----ORDER CONTEXT SET----//
        } 
        if(token){
            navigate(-1, { replace: true });
        }else{
            setSelfHandler(null); //----SELF CONTEXT DELETE----//
        }
    }, [token]);

    //memo
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
                data={{desc : msgData[loginAlert]}}
                state={loginAlert} 
                closeEvent={() => {
                    setLoginAlert(false);
                    return true;    
                }}
            />     
        )        
    }, [loginAlert]);

    const iframeAlertGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "70%", 
                    height : "10em", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "0.8em", 
                    buttonName : ["확인"]
                }} 
                type={1} 
                data={iframeAlert}
                state={iframeAlert} 
                closeEvent={() => {
                    setIframeAlert(false);
                    return true;    
                }}
            />     
        )        
    }, [iframeAlert]); 

    //render
    if(token) return null;
    return (
        <>
        <SimpleMotion display="grid">
        <StyledContainer>
            <StyledHeader>
                <Logo h="8em"/>
                <StyledHeaderSub>
                    <span>지금 올딜에 가입하면 </span>
                    <span>2000원 할인 쿠폰을 드려요</span>
                </StyledHeaderSub>
            </StyledHeader>
            <StyledContent>
                <StyledContentTitle>회원가입/로그인</StyledContentTitle>
                <StyledButton color="#FEE500" onClick = {kakaoAuth}>
                    <RiKakaoTalkFill size="2em" color="black"/>
                    카카오톡으로 3초만에 계속하기
                </StyledButton>
                <Link to="/Login/Phone">
                    <StyledButton>
                        <GoDeviceMobile size="2em" color="black"/>
                        휴대폰 번호로 계속하기
                    </StyledButton>
                </Link>
                {isIOS ? 
                    (
                        <AppleLogin 
                            clientId={APPLE_CLIENT}
                            redirectURI={APPLE_REDIRECT}
                            scope={"name email"}
                            responseType={"code id_token"}
                            responseMode={"form_post"}
                            usePopup={false}
                            render={(props) => (
                                <StyledButton onClick={() => props.onClick()}>
                                    <RiAppleFill size="2em" color="black"/>
                                    Apple로 계속하기
                                </StyledButton> 
                            )}                                  
                        />
                    ) : null
                }

                <StyledExtra>
                    <StyledExtraLink>* 휴대폰 번호가 변경되셨나요?</StyledExtraLink>
                    <StyledExtraButton onClick={() => navigate('/Login/PhoneUpdate')}>이메일로 계정찾기</StyledExtraButton>
                </StyledExtra>
            </StyledContent>
            <StyledFooter>
                <span style={{cursor:"pointer"}} onClick={() => navigate('/MyPage/CustomerService')}>고객 센터 (문의하기)</span>
                <br/>
                <div>
                    <span style={{cursor:"pointer"}} onClick={() => navigate('/TermsOfUse')}>이용약관</span>
                    <span style={{cursor:"pointer"}} onClick={() => navigate('/PrivacyPolicy')}>개인정보처리방침</span>
                    <span style={{cursor:"pointer"}} onClick={() => navigate('/CompanyInfo')}>사업자 정보 보기</span>
                </div>
            </StyledFooter>
        </StyledContainer>
        </SimpleMotion>
        {alertGear}
        {iframeAlertGear}
        </>
    );
});

export default Login;