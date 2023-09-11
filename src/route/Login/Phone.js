//------------------------------ MODULE -------------------------------------
import { useState, useContext, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { apiCall, stripslashes } from "lib";
import { Title, CheckList, Modal, MobileInput, NumberInput, AutoTimer } from "component";
import { OrderContext, SelfContext, BaseContext } from "context";
import { msgData, termsData } from "static";

//------------------------------ COMPONENT ----------------------------------
const Phone = () => {
    //context
    const { order } = useContext(OrderContext);
    const { base } = useContext(BaseContext);
    const { setSelfHandler } = useContext(SelfContext);

    //init
    const navigate = useNavigate();
    const SearchParams = new URLSearchParams(useLocation().search);
    const hostId = SearchParams.get('hostId');   
    const APPLE_RESULT = SearchParams.get('res');    
    const APPLE_SUB = SearchParams.get('sub');    
    const APPLE_LOGIN_MEM = SearchParams.get('memId');       
    const APPLE_NAME = SearchParams.get('name');       
    const APPLE_EMAIL = SearchParams.get('email');      

    const checkList = [
        {
            checked: false,
            required:true,
            title: termsData.service.title,
            desc: base && base.provision ? <StyledModalText style={{textAlign:"Start"}} dangerouslySetInnerHTML={{__html:stripslashes(base.policy)}} /> : termsData.service.desc
        },
        {
            checked: false,
            required:true,
            title:termsData.private.title,
            desc: base && base.policy ? <StyledModalText style={{textAlign:"Start"}} dangerouslySetInnerHTML={{__html:stripslashes(base.policy)}} /> : termsData.private.desc
        },
        {
            checked: false,
            required:false,
            title:termsData.marketing.title,
            desc: base && base.marketing ? <StyledModalText style={{textAlign:"Start"}} dangerouslySetInnerHTML={{__html:stripslashes(base.marketing)}} /> : termsData.marketing.desc
        },                
    ];

    const sendStatus = {
        "ready" : "인증번호 받기",
        "start" : "보내는 중",
        "end" : "다시 받기"
    }    

    //state
    const [phoneNum, setPhoneNum] = useState(null);
    const [certPhone, setCertPhone] = useState(null);
    const [certNum, setCertNum] = useState(null);
    const [validateMsg, setValidateMsg] = useState(0);
    const [confirmMsg, setConfirmMsg] = useState(0);
    const [chkList, setChkList] = useState(checkList);
    const [allChk, setAllChk] = useState(false);
    const [modalState, setModalState] = useState(false);
    const [modalData, setModalData] = useState({title:'', desc:''});
    const [modalIdx, setModalIdx] = useState(null);
    const [level1, setLevel1] = useState(false);
    const [level2, setLevel2] = useState(false);
    const [memberId, setMemberId] = useState(false);
    const [cData, setCdata] = useState(null);
    const [alert, setAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState("needRequiredChk");
    const [expired, setExpired] = useState(false);
    const [setTime, setSetTime] = useState(false);
    const [sendingChk, setSendingChk] = useState('ready');
    const [appleSub, setAppleSub] = useState(null);
    const [confirm, setConfirm] = useState(null);

    //func
    const chkHandler = (idx, defaultMod='origin') => {
        const nowChkList = [...chkList];
        nowChkList[idx].checked = defaultMod =='origin' ? !nowChkList[idx].checked : defaultMod;
        setChkList(nowChkList);
        (chkList.length == chkList.filter(obj => obj.checked).length) ? setAllChk(true) : setAllChk(false);
    };

    const allChkHandler = () => {
        const nowChkList = [...chkList];
        nowChkList.map((obj) => obj.checked=!allChk);
        setChkList(nowChkList);
        setAllChk(!allChk);
    };

    const modalOpen = (idx) => {
        const {title, desc} = chkList[idx];
        setModalState(true);
        setModalData({title:title, desc:desc});
        setModalIdx(idx);
    };    

    const login = async(memId) => {
        const loginResult = await apiCall.get(`/login/${memId}/phone`);
        if(loginResult.data.res == "SUCCESS"){
            window.localStorage.setItem('token', JSON.stringify(loginResult.data.token));
            if(order && order.set){
                const selfResult = await apiCall.get(`/self/self`);           
                setSelfHandler(selfResult.data); //----SELF CONTEXT SET----//
                navigate('/Order', {replace : true });
                return false;
            }
            navigate('/', { replace : true });
        }else{
            setAlertMsg("loginProblem");
            setAlert(true);
            return false; 
        }
    }

    const passLevel1 = async() => {
        if(sendingChk == "start") return;
        setLevel1(false);
        setLevel2(false);
        setValidateMsg("empty");
        setConfirmMsg("empty");

        //----FORMAT CHECK----//
        if(!phoneNum) {
            setValidateMsg("needPhoneNum");
            return false;
        }
        if(phoneNum.length < 12) {
            setValidateMsg("informal");
            return false;
        }

        setSendingChk("start");

        //----DUPLICATE CHECK----//
        try {
            const params = {
                srch : 'cellphone',
                kwd : phoneNum
            }
            const result = await apiCall.get("/join/any/makeDigit", {params});
            setValidateMsg("sentCertNum");
            setCdata(result.data.c);
            setSetTime(result.data.exp);
            setMemberId(result.data.memberId);
        }catch(e){
            console.log(e);
            return false;
        }
    
        //----LEVEL1 PASSED----//
        setSendingChk("end");
        setLevel1(true);
        setExpired(false);
    };

    const passLevel2 = async() => {
        setLevel2(false);
        setConfirmMsg("empty");

        //----CERTIFICATE----//
        try {
            const params = {
                data : certNum
            }
            const result = await apiCall.get(`/join/${cData}/digitChk`, {params});           
            if(result.data['res'] == "MISMATCH") return setConfirmMsg("differCertNum");
            if(result.data['res'] == "EXPIRED") return setConfirmMsg("timeExpired");
            if(result.data['res'] == "MATCH"){
                if(memberId){ //----CASE MEMBER ALREADY----//
                    //if need apple connect
                    if(appleSub){
                        setConfirm({
                            msg : "appleIdConnect",
                            title : "appleIntegration",
                            exec : () => appleConnect(appleSub, memberId),
                            decline : () => login(memberId)
                        });
                        return;
                    }

                    //login
                    login(memberId);
                    return;
                }            
                setConfirmMsg("passedCert"); //----CASE NEW MEMBER----//
                setCertPhone(result.data['kwdData']);
                setLevel2(true);
            }
        }catch(e){
            console.log(e);
            return false;
        }        
    };

    const passLevel3 = () => {
        let requiredChk = true;
        for(var i=0; i<chkList.length; i++)   {
            if(chkList[i].required && !chkList[i].checked) requiredChk = false;
        }
        if(requiredChk){
            const checkedEmail = APPLE_EMAIL && APPLE_EMAIL.endsWith('appleid.com') ? null : APPLE_EMAIL;
            const extraParams = hostId ? `?hostId=${hostId}` : '';
            navigate(
                `/Login/Auth${extraParams}`,
                { 
                    replace: true, 
                    state: { 
                        certPhone: certPhone, 
                        chkList: chkList[2].checked, 
                        appleId : appleSub || null, 
                        appleName : APPLE_NAME || null,
                        appleEmail : checkedEmail || null,
                    } 
                }
            );
        }else{
            setAlertMsg("needRequiredChk");
            setAlert(true);
        }
    };  

    const appleChk = async() => {
        //already member -> login
        if(APPLE_RESULT == "LOGIN" && APPLE_LOGIN_MEM){
            login(APPLE_LOGIN_MEM);
            return;
        }

        if(APPLE_RESULT == "CONTINUE" && APPLE_SUB){
            setAppleSub(APPLE_SUB);
            return;
        }        
    }

    const appleConnect = async(appleId, userId) => {
        try{
            const params = {
                appleId : appleId,
                userId : userId,
            }
            const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
            const result = await apiCall.put("/login/any/appleConnect", {params}, {headers});    
            if(result.data.result == "success"){
                login(userId);
            }else{
                setAlertMsg("loginProblem");
                setAlert(true);
            }   
        }catch{
            setAlertMsg("loginProblem");
            setAlert(true);
        }        
    }

    //effect
    useEffect(() => {
        if(APPLE_RESULT) appleChk();
    }, []);

    //memo
    const phoneGear = useMemo(() => {
        return(
            <>
                <StyledTitle>휴대폰 번호</StyledTitle>
                <StyledInputBox1><MobileInput readOnly={confirmMsg=="passedCert"?true:false} changeHandler={setPhoneNum}/></StyledInputBox1>
                <StyledButton1 onClick={passLevel1}>{sendStatus[sendingChk]}</StyledButton1>
                <StyledSubTitle chk={validateMsg}>{msgData[validateMsg]}</StyledSubTitle>
            </>
        )

    }, [validateMsg, confirmMsg, phoneNum, level1, level2, cData, setTime, memberId]);

    const certGear = useMemo(() => {
        if(!level1) return null;
        return(
            <>
                <StyledTitle>인증번호</StyledTitle>
                <StyledInputBox2>
                    <NumberInput number={6} changeHandler={setCertNum} expression="인증번호 6자리를 입력 해 주세요."/>
                    <AutoTimer timeSet={setTime} expireEvent={() => setExpired(true)}/>
                </StyledInputBox2>
                <StyledSubTitle chk={confirmMsg}>{msgData[confirmMsg]}</StyledSubTitle>
                <StyledButton2 active={expired} onClick={passLevel2}>인증하기</StyledButton2>
            </>
        )
    }, [level1, setTime, confirmMsg, expired, certNum, alertMsg, alert]);

    const chkGear = useMemo(() => {
        if(!level2) return null;
        return(
            <>
                <StyledListBox>
                    <CheckList list={chkList} allChk={allChk} eachHandler={chkHandler} allHandler={allChkHandler} openModal={modalOpen}/>
                </StyledListBox>
                <StyledSubmit onClick={passLevel3}>약관 동의하기</StyledSubmit>
            </>
        )
    }, [level2, allChk, modalData, modalState, modalIdx, chkList, alert, alertMsg]);

    const chkModalGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "70%", 
                    height : "70%", 
                    textAlign : "left", 
                    alignContent : "start",  
                    fontSize : "0.2em", 
                    buttonName : ["동의"],
                    overflow: 'auto'
                }} 
                type={1}
                pre={true}
                data={modalData} 
                state={modalState} 
                closeEvent={() => setModalState(false)}
                proEvent={() => {
                    chkHandler(modalIdx, true);
                    return true;
                }}
                consEvent={() => {
                    chkHandler(modalIdx, false);
                    return true;
                }}
            />
        )
    }, [modalIdx, allChk, chkList, modalData, modalState]);

    const alertModalGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "70%", 
                    height : "18%", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "0.8em", 
                    buttonName : ["확인"]
                }} 
                type={1} 
                data={{desc : msgData[alertMsg]}}
                state={alert} 
                closeEvent={() => {
                    setAlert(false);
                    return true;
                }}
            />     
        )
    }, [alert, alertMsg]);

    const confirmGear = useMemo(() => {
        return confirm ? (
            <Modal 
                option={{
                    width : "75%", 
                    height : "10em",
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "0.8em", 
                    noClose : true,
                    buttonName : ["확인","취소"]
                }} 
                type={2}
                proEvent = {() => {
                    confirm.exec();
                    return true;
                }}
                consEvent = {() => {
                    confirm.decline();
                    return true;
                }}
                data={{desc : msgData[confirm.msg], title : msgData[confirm.title]}}
                state={confirm} 
                closeEvent={() => confirm.decline()}
            />
        ) : null;
    }, [confirm]);    

    //render
    return (
        <>
        <StyledPhone>
            <Title text="휴대폰 번호 인증" url="/Login"/>
            <StyledContent>
                {phoneGear}
                {certGear}
                {chkGear}
            </StyledContent>                 
        </StyledPhone>
        {chkModalGear}
        {alertModalGear}
        {confirmGear}
        </>
    );
};

export default Phone;

//------------------------------ CSS ----------------------------------------
const StyledPhone = styled.div`
    height:100%;
`;
const StyledContent = styled.div`
    height:75%;
    display:grid;
    padding:3.5em 8% 0 8%;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr 0.75fr 0.5fr 1fr 0.8fr 1fr 2.5fr 1fr;
    align-content:space-evenly;
`;
const StyledTitle = styled.div`
    display:grid;
    grid-column: 1 / span 3;
    justify-content:left;
    align-content:flex-end;
    font-size:0.8em;
    font-weight:bold;
    margin-bottom:3%;
`;
const StyledSubTitle = styled.div`
    display:grid;
    height:1em;
    grid-column: 1 / span 2;
    justify-self:left;
    font-size:0.6em;
    color:${(props) => props.chk == "sentCertNum" || props.chk == "passedCert" ? 'green' : 'red'};
`;
const StyledInputBox1 = styled.div`
    display:grid;
    grid-column: 1 / span 2;
    height:2.2em;
    border-radius:0.5em;
    font-size:0.8em;
    background:#eee;
    padding: 1%;
`;
const StyledInputBox2 = styled.div`
    display:grid;
    grid-column: 1 / span 3;
    height:2.15em;
    border-radius:0.5em;
    background:#eee;
    padding: 1%;    
    align-content:center;
    font-size:0.8em;
    grid-template-columns: 10fr 3fr;
`;
const StyledButton1 = styled.div`
    display:grid;
    margin-left:20%;
    align-content:center;
    background:crimson;
    color:white;
    width:80%;
    height:2.5em;
    font-size:0.8em;
    border-radius:0.5em;
    cursor:pointer;
`;
const StyledButton2 = styled.div`
    display:grid;
    grid-column: 3 / span 3;
    margin-left:20%;
    height:2.5em;
    align-content:center;
    background:${(props)=>props.active ? '#aaa' : 'crimson'};
    color:white;
    font-size:0.8em;
    border-radius:0.5em;
    cursor:pointer;
`;
const StyledSubmit = styled.div`
    display:grid;
    grid-column: 1 / span 3;
    background:black;
    height:2.5em;
    align-content:center;
    background:crimson;
    border-radius:0.5em;
    font-size:0.8em;
    color:white;
    margin-top:5%;
    cursor:pointer;
`;
const StyledListBox = styled.div`
    display:grid;
    grid-column: 1 / span 3;
`;
const StyledModalText = styled.div`
    *{
        text-align:start;
    }    
`;