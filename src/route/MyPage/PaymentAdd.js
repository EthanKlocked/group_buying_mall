//------------------------------ MODULE -------------------------------------
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Title, Modal, CustomLoading } from "component";
import { useState, useMemo, useContext } from "react";
import { apiCall } from "lib";
import { msgData } from "static";
import { SelfContext } from "context";

//------------------------------ CSS ----------------------------------------

const StyledPaymentAdd = styled.div`
`;
const StyledContent = styled.div`
    height:100%;
    padding:4.5em 1em 0 1em;
`;
const StyledRow = styled.div`
    margin-bottom:1em;
    overflow:hidden;
`;
const StyledCardNumber = styled.div`
    display:grid;
    grid-template-columns: repeat(4, 1fr);
    justify-content:space-between;
    column-gap:0.8em;
    #i2, #i3{
        -webkit-text-security: disc;
    }
`;
const StyledInfoNumber = styled.div`
    display:grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap:0.8em;
    width:60%;
    text-align:start;
    align-items:center;
`;
const StyledIdNumber = styled.div`
    float:left;
`;
const StyledIdSubtitle = styled.div`
    width:150%;
    text-align:start;
    font-size:0.6em;
    float:left;
    margin-top:1em;
    color:#aaa
`;
const StyledInput = styled.input`
    background:#eee;
    line-height:3em;
    text-align:center;
    border-radius:0.5em;
    letter-spacing:0.2em;
    ::placeholder{
        letter-spacing:0.2em;
        font-weight:normal;
        color:#aaa;
    }
`;
const StyledTitle = styled.div`
    text-align:start;
    font-weight:500;
    padding:0.5em 0;
`;
const StyledCol = styled.span`
    display:inline-block;
    width:48%;
    height:90%;
    float:left;
`;
const StyledSubmit = styled.div`
    color:white;
    height:2.5em;
    border-radius:0.5em;
    line-height:2.5em;
    background:crimson;
    cursor:pointer;
`;

//------------------------------ COMPONENT ----------------------------------
const PaymentAdd = () => {
    //context
    const { self, setSelfHandler } = useContext(SelfContext);

    //init
    const navigate = useNavigate();

    //state
    const [num1, setNum1] = useState('');
    const [num2, setNum2] = useState('');
    const [num3, setNum3] = useState('');
    const [num4, setNum4] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [password, setPassword] = useState('');
    const [idNum, setIdNum] = useState('');
    const [alertModal, setAlertModal] = useState(null);
    const [completeModal, setCompleteModal] = useState(null);
    const [loading, setLoading] = useState(false);

    //function
    const numberChange = (e) => {
        const thisVal = e.target.value.replace(/[^0-9]/g, '');
        const thisId = e.target.id;
        let length = e.target.dataset.len || 2;

        if(thisId=="i1" && thisVal.length<=length)         setNum1(thisVal);
        if(thisId=="i2" && thisVal.length<=length)         setNum2(thisVal);
        if(thisId=="i3" && thisVal.length<=length)         setNum3(thisVal);
        if(thisId=="i4" && thisVal.length<=length)         setNum4(thisVal);
        if(thisId=="i5" && thisVal.length<=length)        setMonth(thisVal);
        if(thisId=="i6" && thisVal.length<=length)         setYear(thisVal);
        if(thisId=="i7" && thisVal.length<=length)     setPassword(thisVal);
        if(thisId=="i8" && thisVal.length<=length)        setIdNum(thisVal);
        
        setTimeout(() => {
            const thisIndex = thisId.replace('i', '');
            if(thisVal.length==length){
                const nextInput = document.getElementById(`i${Number(thisIndex)+1}`);
                if(nextInput) nextInput.focus();
            }else if(thisVal.length==0){
                /*
                const nextInput = document.getElementById(`i${Number(thisIndex)-1}`);
                if(nextInput) nextInput.focus();
                */
            }
        },0);
    }

    const save = async() => {
        const cardNum = Number(`${String(num1)}${String(num2)}${String(num3)}${String(num4)}`);
        try{
            if(!cardNum) return setAlertModal("needCardNum");
            if(!month) return setAlertModal("needCardExpiry");
            if(!year) return setAlertModal("needCardExpiry");
            if(!password) return setAlertModal("needCardPassword");
            if(!idNum) return setAlertModal("needCardCustomerId");

            setLoading(true);
            const params = {
                'cardNum' : cardNum,
                'month' : month,
                'year' : year,
                'password' : password,
                'idNum' : idNum,
            }
            const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
            const result = await apiCall.post("/billing", {params}, {headers});
            if(result.data != 'success') {
                setLoading(false);
                return setAlertModal("invalidCard");
            }
            const selfData = self;
            selfData.isNewCard = true;
            setLoading(false);
            setCompleteModal(true);
        }catch(e){
            console.log(e);
        }
    }

    //memo
    const cardNumberGear = useMemo(() => {
        return (
            <>
            <StyledTitle>카드 번호</StyledTitle>
            <StyledCardNumber>
                <StyledInput id="i1" data-len={4} type="number" pattern="[0-9]*" placeholder="0000" value={num1} onChange = {(e) => numberChange(e)} />
                <StyledInput id="i2" data-len={4} type="number" pattern="[0-9]*" placeholder="0000" value={num2} onChange = {(e) => numberChange(e)} />
                <StyledInput id="i3" data-len={4} type="number" pattern="[0-9]*" placeholder="0000" value={num3} onChange = {(e) => numberChange(e)} />
                <StyledInput id="i4" data-len={4} type="number" pattern="[0-9]*" placeholder="0000" value={num4} onChange = {(e) => numberChange(e)} />
            </StyledCardNumber>
            </>      
        );
    }, [num1, num2, num3, num4]);

    const expiryGear = useMemo(() => {
        if(String(num4).length < 4) return null;
        return(
            <StyledCol>
                <StyledTitle>유효 기간</StyledTitle>
                <StyledInfoNumber>
                    <StyledInput id="i5" type="number" pattern="[0-9]*" placeholder="MM" value={month} onChange = {(e) => numberChange(e)} />
                    <StyledInput id="i6" type="number" pattern="[0-9]*" placeholder="YY" value={year} onChange = {(e) => numberChange(e)} />
                </StyledInfoNumber>
            </StyledCol>
        );
    }, [num4, month, year]);

    const passwordGear = useMemo(() => {
        if(String(year).length < 2) return null;
        return(
            <StyledCol>
                <StyledTitle>비밀번호 앞 2자리</StyledTitle>
                <StyledInfoNumber>
                    <StyledInput id="i7" type="number" pattern="[0-9]*" value={password} onChange = {(e) => numberChange(e)} />
                    **
                </StyledInfoNumber>
            </StyledCol>
        );
    }, [year, password]);

    const idNumberGear = useMemo(() => {
        if(String(password).length < 2) return null;
        return(
            <StyledCol>
                <StyledTitle>주민번호 앞 6자리</StyledTitle>
                <StyledIdNumber>
                    <StyledInput id="i8" data-len={10} type="number" pattern="[0-9]*" value={idNum} onChange = {(e) => numberChange(e)}></StyledInput>
                </StyledIdNumber>
                <StyledIdSubtitle>* 법인카드는 사업자등록번호 10자리</StyledIdSubtitle>
            </StyledCol>            
        );
    }, [password, idNum]);

    const submitGear = useMemo(() => {
        if(String(idNum).length < 6) return null;
        return(
            <StyledSubmit onClick={save}>등록하기</StyledSubmit>   
        );
    });

    const completeModalGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "70%", 
                    height : "7em", 
                    textAlign : "center",
                    alignContent : "stretch",  
                    fontSize : "1em", 
                    buttonStyle : 'bold',
                    buttonName: ["확인"],
                }} 
                type={1} 
                data={{
                    desc : msgData['cardRegi']
                }}
                state={completeModal}
                closeEvent={() => {
                    navigate(-1);
                }}
            />
        )
    }, [completeModal]); 

    const alertModalGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "70%", 
                    height : "9em", 
                    textAlign : "center",
                    alignContent : "stretch",  
                    fontSize : "1em", 
                    buttonStyle : 'bold',
                    buttonName: ["확인"],
                }} 
                type={1} 
                data={{
                    desc : msgData[alertModal],
                    title: "카드 등록 실패"
                }}
                state={alertModal}
                closeEvent={() => setAlertModal(false)} 
            />
        )
    }, [alertModal]); 

    //render
    return(
        <StyledPaymentAdd>
            {loading ? <CustomLoading opacity={0.5}/> : null}
            <Title text="새 카드 등록하기" />
            <StyledContent>
                <StyledRow>
                    {cardNumberGear}
                </StyledRow>
                <StyledRow>
                    {expiryGear}
                    {passwordGear}
                </StyledRow>
                <StyledRow>
                    {idNumberGear}
                </StyledRow>
                {submitGear}
            </StyledContent>
            {alertModalGear}
            {completeModalGear}
        </StyledPaymentAdd>
    )
}

export default PaymentAdd;