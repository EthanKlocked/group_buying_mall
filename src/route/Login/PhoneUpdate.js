//------------------------------ MODULE -------------------------------------
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Title, Modal, NumberInput, MailInput, MobileInput, AutoTimer } from "component";
import { useState, useMemo, useRef } from "react";
import { apiCall } from "lib";
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
const StyledInfoContent2 = styled.span`
    display:grid;
    grid-template-columns: 2fr 1fr;
    text-align:start;
    font-size:0.8em;
    vertical-align:center;
    align-content:center;
    margin:3% 0;
`;
const StyledInfoContent3 = styled.span`
    display:grid;
    text-align:start;
    font-size:0.8em;
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
    overflow-y:hidden;
`;
const StyledInputBox2 = styled.span`
    grid-template-columns: 5fr 3fr;
    display:grid;
    align-content:center;
    border-radius:0.5em;
    background:#eee;
    padding:0.5em 0.2em;
    margin-left:0;
    align-content:center;
`;
const StyledInputBox3 = styled.div`
    display:grid;
    font-weight:bold;
    font-size:1em;
    border-radius:0.5em;
    border:none;
    align-content:center;
    background:#eee;
    overflow-y:hidden;
    padding:0.6em 0em;
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
const StyledCertificate = styled.span`
    display:grid;
    background:${(props) => props.expired ? '#aaa' : 'crimson'};
    margin:0 1%;
    padding:0.5em;
    width:80%;
    text-align:center;
    justify-self:end;
    color:white;
    align-items:center;
    border-radius:0.5em;
`;
const StyledSubtitle = styled.div`
    margin-left:2%;
    margin-top:0.5%;
    text-align:left;
    font-size:0.5em;
    height:3em;
    color: ${(props) => props.pass ? 'green' : 'red'}
`;
const StyledSubmit = styled.div`
    border-radius:0.5em;
    border:none;
    background:crimson;
    color:white;
    overflow-y:hidden;
    padding:0.5em 0.2em;
    cursor:pointer;
`;

//------------------------------ COMPONENT ----------------------------------
const PhoneUpdate = () => {
    //init
    const navigate = useNavigate();    
    const sendStatus = {
        "ready" : "인증번호 받기",
        "start" : "보내는 중",
        "end" : "다시 받기",
        "confirm" : "다시 받기"
    }

    //ref
    const dataTarget = useRef();
    const certTarget = useRef();

    //state
    const [sendingChk, setSendingChk] = useState('ready');
    const [timeSet, setTimeSet] = useState(null);
    const [msg1, setMsg1] = useState("empty");
    const [msg2, setMsg2] = useState("empty");
    const [msg3, setMsg3] = useState("empty");
    const [certToken, setCertToken] = useState(0);
    const [memberToken, setMemberToken] = useState(0);
    const [expired, setExpired] = useState(false);
    const [newPhoneNumber, setNewPhoneNumber] = useState(false);
    const [alertObj, setAlertObj] = useState(null);

    //function
    const send = async() => {
        if(sendingChk == "start") return;
        try {
            setMsg1('empty');
            setMsg2('empty');
            setExpired(false);

            const front = dataTarget.current.children[0].children[0].value;
            const rear = dataTarget.current.children[0].children[2].value;
            const regEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
            const kwd = `${front}@${rear}`;
            if(!front || !rear){
                setSendingChk('ready');
                return setMsg1("needValue");
            } 
            if(!regEmail.test(kwd)){
                setSendingChk('ready');
                return setMsg1("informal");
            } 

            setSendingChk('start');

            const params = {
                kwd : kwd,
                type : 'mail' 
            }
            const result = await apiCall.get("/join/any/makeDigit", {params});
            console.log(result);
            if(result.data == 'identifyErr'){
                setMsg1("cantFindEmail");   
                setSendingChk('ready');
            }else{
                setTimeSet(result.data.exp);
                setMsg1("sentCertNum");
                setSendingChk('end');
                setCertToken(result.data.c);
                setMemberToken(result.data.tempMember);
            }
        }catch(e){
            console.log(e);
            return setMsg1('error');
        }
    }

    const saveChange = async() => {
        //init
        const saveValue = newPhoneNumber;
    
        //value check
        if(!saveValue) return setMsg3('needPhoneNum');
        if(saveValue.length<12) return setMsg3("informal");

        //request
        const params = { 
            memberToken : memberToken,
            cellphone : saveValue
        };
        const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
        const result = await apiCall.put("/member/any/setNewPhone", {params}, {headers});

        //duplicate Err
        if(result.data == 'phoneAlready') return setMsg3('phoneAlready');

        //result
        const resultObj = {exec : () => navigate(-1)};
        resultObj.desc = (result.data == 'success') ? '새로운 휴대폰 번호로 로그인 해 주세요.' : '관리자에게 문의 해 주세요.';
        resultObj.title = (result.data == 'success') ? '휴대폰 번호 변경완료' : '에러가 발생하였습니다.';
        setAlertObj(resultObj);
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
                setSendingChk('confirm');
                setMsg2('passedCert');
            }
        }catch(e){
            console.log(e);
            return false;
        }
    }

    //memo
    const inputGear = useMemo(() => {
        return(
            <>
            <StyledInfo>
                <StyledInfoTitle>이메일 주소</StyledInfoTitle>
                <StyledInfoContent1>
                    <StyledInputBox1 ref={dataTarget}>
                        <MailInput />
                    </StyledInputBox1>
                    <StyledButton onClick={() => send()}>{sendStatus[sendingChk]}</StyledButton>
                </StyledInfoContent1>
            </StyledInfo>
            <StyledSubtitle pass={msg1=="sentCertNum"}>{msgData[msg1]}</StyledSubtitle>
            </>
        )
    }, [sendingChk, msg1]);

    const certGear = useMemo(() => {
        return sendingChk == 'end' || sendingChk == 'confirm' ?  
            <>
            <StyledInfo>
                <StyledInfoTitle>인증번호</StyledInfoTitle>
                <StyledInfoContent2>
                    <StyledInputBox2 ref={certTarget} border={true}>
                        <NumberInput number={6} expression="인증번호 6자리"/>
                        <StyledTimerBox><AutoTimer expireEvent = {() => setExpired(true)} timeSet = {timeSet}/></StyledTimerBox>
                    </StyledInputBox2>
                    <StyledCertificate expired={expired} onClick = {certificate} >인증하기</StyledCertificate>
                </StyledInfoContent2>
            </StyledInfo>     
            <StyledSubtitle pass={msg2=="passedCert"}>{msgData[msg2]}</StyledSubtitle>
            </> : 
            null
    }, [sendingChk, timeSet, msg2, expired]);

    const changeNumberGear = useMemo(() => {
        if((msg3=='needPhoneNum' && newPhoneNumber) || (msg3=='informal' && newPhoneNumber.length>12)) setMsg3('empty');
        return sendingChk != 'confirm' ? null : (
            <>
                <StyledInfo>
                    <StyledInfoTitle>새로운 휴대폰 번호</StyledInfoTitle>
                    <StyledInfoContent3>
                        <StyledInputBox3><MobileInput changeHandler={setNewPhoneNumber}/></StyledInputBox3>
                    </StyledInfoContent3>
                    <StyledSubtitle pass={false}>{msgData[msg3]}</StyledSubtitle>
                </StyledInfo>
                <StyledSubmit onClick={saveChange}>변경하기</StyledSubmit>
            </>
        )
    }, [sendingChk, newPhoneNumber, msg3])

    const alertGear = useMemo(() => {
        return alertObj ? (
            <Modal 
                option={{
                    width : "17em", 
                    height : "8em",
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "0.8em", 
                    buttonName : ["확인"]
                }} 
                type={1}
                data={{desc : alertObj.desc, title: alertObj.title}}
                state={alertObj} 
                closeEvent={() => alertObj.exec()}
            />        
        ) : null
    }, [alertObj])

    //render
    return(
        <StyledInfoUpdate>
            <Title text={`휴대폰 번호 변경`} />
            <StyledContent>
                {inputGear}
                {certGear}
                {changeNumberGear}
            </StyledContent>
            {alertGear}
        </StyledInfoUpdate>
    )
}

export default PhoneUpdate;