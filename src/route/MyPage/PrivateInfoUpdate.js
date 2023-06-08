//------------------------------ MODULE -------------------------------------
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Title, Modal, MobileInput, NumberInput, MailInput, AutoTimer } from "component";
import { useContext, useState, useMemo, useRef } from "react";
import { apiCall } from "lib";
import { SelfContext } from "context";
import { msgData } from "static";

//------------------------------ CSS ----------------------------------------
const StyledInfoUpdate = styled.div`
    height:100%;
`;
const StyledContent = styled.div`
    padding:4.5em 6%;
    height:50%;
`;
const StyledInfo = styled.div`
    margin-left:1%;
    margin-top:1%;
`;
const StyledInfoTitle = styled.div`
    margin:0 1%;
    text-align:start;
    font-weight:bold;
    font-size:0.8em;
    vertical-align:center;
    align-content:center;
`;
const StyledInfoContent1 = styled.div`
    display:grid;
    grid-template-columns: 2fr 1fr;
    text-align:start;
    font-size:0.8em;
    vertical-align:center;
    align-content:center;
    margin:3% 0;
`;
const StyledInfoContent2 = styled.div`
    display:grid;
    text-align:start;
    font-size:0.8em;
    font-weight:bold;
    vertical-align:center;
    align-content:center;
    margin:3% 0;
`;
const StyledInputBox1 = styled.div`
    display:grid;
    align-content:center;
    border-radius:0.5em;
    border:none;
    align-content:center;
    background: ${(props)=> props.backg ? "#eee" : "none"};
    overflow-y:hidden;
    padding: ${(props)=> props.backg ? "0.5em 0.2em" : "none"};
`;
const StyledInputBox2 = styled.div`
    grid-template-columns: 5fr 1fr;
    display:grid;
    align-content:center;
    border-radius:0.5em;
    background:#eee;
    padding:0.5em 0.2em;1
    margin-left:0;
    align-content:center;
`;
const StyledTimerBox = styled.div`
`;
const StyledButton = styled.span`
    display:grid;
    align-items:center;
    margin:0 1%;
    padding:0.5em;
    width:80%;
    justify-self:end;
    background:crimson;
    color:white;
    border-radius:0.5em;
    cursor:pointer;
`;
const StyledSubmit = styled.div`
    display:grid;
    background:${(props) => props.expired ? '#aaa' : 'crimson'};
    margin:2% 0;
    text-align:center;
    font-size:0.8em;
    font-weight:bold;
    color:white;
    align-items:center;
    border-radius:0.5em;
    height:2.5em;
    cursor:pointer;
`;
const StyledSubtitle = styled.div`
    margin-left:2%;
    margin-top:1%;
    text-align:left;
    font-size:0.5em;
    height:3em;
    color: ${(props) => props.pass ? 'green' : 'red'}
`;

//------------------------------ COMPONENT ----------------------------------
const PrivateInfoUpdate = () => {
    //context
    const { self, setSelfHandler } = useContext(SelfContext);

    //init
    const { state } = useLocation();
    const navigate = useNavigate();    
    const typeConfig = {
        "phone" : "휴대폰 번호",
        "mail" : "이메일 주소"
    }
    const sendStatus = {
        "ready" : "인증번호 받기",
        "start" : "보내는 중",
        "end" : "다시 받기"
    }

    //ref
    const dataTarget = useRef();
    const certTarget = useRef();

    //state
    const [sendingChk, setSendingChk] = useState('ready');
    const [timeSet, setTimeSet] = useState(null);
    const [msg1, setMsg1] = useState("empty");
    const [msg2, setMsg2] = useState("empty");
    const [certToken, setCertToken] = useState(0);
    const [expired, setExpired] = useState(false);
    const [modal, setModal] = useState(false);

    //function
    const send = async() => {
        if(sendingChk == "start") return;

        try {
            setMsg1('empty');
            setMsg2('empty');
            setExpired(false);

            let kwd;
            let srch;
            let duplicateMsg;
            if(state.type == "phone"){
                srch = "cellphone";
                kwd = dataTarget.current.children[0].value;
                if(!kwd) return setMsg1("needValue");
                if(kwd.length<12) return setMsg1("informal");
                duplicateMsg = 'phoneAlready';
            }else if(state.type == "mail"){
                srch = "email";
                const front = dataTarget.current.children[0].children[0].value;
                const rear = dataTarget.current.children[0].children[2].value;
                const regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
                kwd = `${front}@${rear}`;
                if(!front || !rear) return setMsg1("needValue");
                if(!regEmail.test(kwd)) return setMsg1("informal");
                duplicateMsg = 'mailAlready';
            }else{
                return setMsg1('unexpected status');    
            }

            setSendingChk('start');

            const params = {
                srch : srch,
                kwd : kwd,
                type : state.type 
            }
            const result = await apiCall.get("/join/any/makeDigit", {params});
            
            if(result.data.memberId){// member info already exists
                setSendingChk('ready');
                return setMsg1(duplicateMsg);                
            }
            setTimeSet(result.data.exp);
            setMsg1("sentCertNum");
            setSendingChk('end');
            setCertToken(result.data.c);
        }catch(e){
            console.log(e);
            setSendingChk('ready');
            return setMsg1('error');
        }
    }

    const resultSet = async() => {
        try {
            const params = new Object;

            if(state.type == "phone") {
                params.cellphone = dataTarget.current.children[0].value;
            }else if(state.type == "mail"){
                params.email = `${dataTarget.current.children[0].children[0].value}@${dataTarget.current.children[0].children[2].value}`;
            }

            const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
            const result = await apiCall.put("/self", {params}, {headers});    
            return (result.data == '000' || result.data == '001');

        }catch(e){
            console.log(e);
            return false;
        }
    }

    const certificate = async() => {
        try {
            const certNum = certTarget.current.children[0].value;

            if(!certNum) return setMsg2('needValue');
            if(certNum.length<6) return setMsg2('informal');

            const params = {
                data : certNum
            }
            const result = await apiCall.get(`/join/${certToken}/digitChk`, {params});           
            if(result.data['res'] == "MISMATCH") return setMsg2('differCertNum');
            if(result.data['res'] == "EXPIRED") return setMsg2('timeExpired');
            if(result.data['res'] == "MATCH"){
                const setChk = resultSet();
                if(!setChk) return console.log('update error');
                const updateData = await apiCall.get(`/self/private`);
                setSelfHandler(updateData.data);
                setModal(true);
            }
        }catch(e){
            console.log(e);
            return false;
        }
    }

    //memo
    const phoneGear = useMemo(() => {
        return(
            <>
            <StyledInfo>
                <StyledInfoTitle>{typeConfig[state.type]}</StyledInfoTitle>
                <StyledInfoContent1>
                    <StyledInputBox1 backg={state.type == "phone"} ref={dataTarget}>
                        {state.type == 'phone' ? <MobileInput /> : <MailInput />}
                    </StyledInputBox1>
                    <StyledButton onClick={() => send()}>{sendStatus[sendingChk]}</StyledButton>
                </StyledInfoContent1>
            </StyledInfo>
            <StyledSubtitle pass={msg1=="sentCertNum"}>{msgData[msg1]}</StyledSubtitle>
            </>
        )
    }, [sendingChk, msg1]);

    const certGear = useMemo(() => {
        return sendingChk == 'end' ?  
            <>
            <StyledInfo>
                <StyledInfoTitle>인증번호</StyledInfoTitle>
                <StyledInfoContent2>
                    <StyledInputBox2 ref={certTarget} border={true}>
                        <NumberInput number={6} expression="인증번호 6자리를 입력 해 주세요."/>
                        <StyledTimerBox><AutoTimer expireEvent = {() => setExpired(true)} timeSet = {timeSet}/></StyledTimerBox>
                    </StyledInputBox2>
                </StyledInfoContent2>
            </StyledInfo>     
            <StyledSubtitle pass={false}>{msgData[msg2]}</StyledSubtitle>
            <StyledSubmit expired={expired} onClick = {certificate} >인증하기</StyledSubmit>
            </> : 
            null
    }, [sendingChk, timeSet, msg2, expired]);

    const modalGear = useMemo(() => {
        return (
            <Modal 
                option={{
                    width : "70%", 
                    height : "8em",
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "1em", 
                    buttonName : ["확인"]
                }} 
                type={1}
                data={{desc : `${typeConfig[state.type]}가 변경되었습니다.`}}
                state={modal} 
                closeEvent={() => navigate(-1)}
            />        
        )
    }, [modal])

    //render
    return(
        <StyledInfoUpdate>
            <Title text={`${typeConfig[state.type]} 변경`} />
            <StyledContent>
                {phoneGear}
                {certGear}
            </StyledContent>
            {modalGear}
        </StyledInfoUpdate>
    )
}

export default PrivateInfoUpdate;