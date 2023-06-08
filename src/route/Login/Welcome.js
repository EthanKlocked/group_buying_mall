//------------------------------ MODULE -------------------------------------
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import welcomeImg from 'data/img/celeb2.gif';
import styled from "styled-components";
import { Title, AutoTimer, SimpleMotion } from "component";

//------------------------------ CSS ----------------------------------------
const StyledWelcome = styled.div`
    height:100%;
    img{
        width:100%;
    }
`;
const StyledContent = styled.div`
    padding:6.75em 8% 0 8%;
`;
const StyledTitle = styled.div`
    font-size:1.3em;
`;
const StyledImgBox = styled.div`
    padding:10%;
`;
const StyledImg = styled.img`
    max-width: 100%;
    margin-top: 0;
`;
const StyledText = styled.div`
    font-size:0.9em;
    height:10%;
`;
const StyledButton = styled.div`
    display:grid;
    margin:2em 0 0 0;
    padding:0.8em;
    color:white;
    background:crimson;
    font-size:0.8em;
    border-radius:0.5em;   
    cursor:pointer;
`;

//------------------------------ COMPONENT ----------------------------------
const Welcome = () => {
    //init
    const { state } = useLocation();
    const navigate = useNavigate();

    //state
    const [loading, setLoading] = useState(true);

    //func
    const welcomeHome = () => {
        return navigate('/', { replace : true });
    }    

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [])

    //memo
    const timerGear = useMemo(() => {
        return loading ? null : <AutoTimer type="s" expireEvent = {welcomeHome} timeSet = {5}/>
    }, [loading]);

    //render
    return (
            <>
            {/*loading ? <CustomLoading/> : null*/}
            <SimpleMotion duration={1}>
            <StyledWelcome>
            <Title text="회원가입 완료" url="/"/>
            <StyledContent>
                <StyledTitle>가입을 환영합니다!</StyledTitle>            
                <StyledImgBox>
                    <StyledImg src={welcomeImg}/>
                </StyledImgBox>
                <StyledText>{state && state.name || ''}님의 회원가입을 축하합니다.</StyledText>
                <StyledText>{timerGear}초 후 자동으로 홈 화면으로 이동합니다.</StyledText>
                <StyledButton onClick={welcomeHome}>홈 화면으로 바로 이동하기</StyledButton>
            </StyledContent>                 
            </StyledWelcome>
            </SimpleMotion>
            </>
    );
}

export default Welcome;