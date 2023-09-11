//------------------------------ MODULE -------------------------------------
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Title, Modal } from "component";
import { useCallback, useState, useEffect, useMemo, useContext } from "react";
import { apiCall } from "lib";
import { SiPicpay } from "react-icons/si";
import { AiFillCreditCard } from "react-icons/ai";
import kakaoPayIcon from 'data/img/kakaopay.png';
import { SelfContext } from "context";
import { msgData } from "static";

//------------------------------ CSS ----------------------------------------
const StyledPaymentUpdate = styled.div`
`;
const StyledContent = styled.div`
    padding-top:3.8em;
`;
const StyledItem = styled.div`
    padding: 0.3em;
    margin:0.5em;
`;
const StyledItemTitle = styled.div`
    margin:0.2em;
    overflow:hidden;
    height:2.1em;
`;
const StyledItemTitleRadio = styled.span`
    float:left;
    line-height:1.5em;
`;
const StyledRadioSetting = styled.div`
    text-align:start;
    margin:5%;
    font-size:0.8em;
    input[type="radio"]:checked {
        background-color: crimson;
        border-color: crimson;
        color: white;
    }
    input[type="radio"] {
        -webkit-appearance: none;
        width: 1.7em;
        height:1.7em;
        vertical-align:bottom;
    }
`;
const StyledRadio = styled.input`
    vertical-align:middle;
`;
const StyledItemTitleLabel = styled.label`
    float:left;
    cursor:pointer;
`;
const StyledItemTitleIcon = styled.span`
    float:left;
    line-height:2.8em;
    margin-left:0.8em;
    img{
        width:3em;
    }
`;
const StyledItemTitleText = styled.span`
    float:left;
    font-weight:550;
    line-height:2.1em;
    margin-left:0.3em;
`;
const StyledItemTitleDelete = styled.span`
    float:right;
    line-height:2.1em;
    font-size:0.9em;
    color:#999;
`;
const StyledItemBody = styled.div`
    margin:0.2em;
`;
const StyledItemBodyList = styled.div`
`;
const StyledItemBodyAdd = styled.div`
`;
const StyledItemList = styled.label`
    display:block;
    border:solid 1px #ccc;
    border-radius:0.5em;
    margin-top:1%;
    padding:0.5em;
    font-size:0.8em;
    background:white;
    height:2em;
    line-height:2em;
    margin-bottom:0.5em;
`;
const StyledItemRadio = styled.input`
    float:left;
    margin:1em 0.5em;
    border:none !important;
    background:white !important;
    &:checked{
        background: crimson !important;
        color:white !important;
    }
    &:checked + ${StyledItemList} {
        background: crimson !important;
        color:white !important;
        border: solid 0.1em crimson !important; 
    }
`;
const StyledAddBtn = styled.div`
    border:solid 1px #ccc;
    border-radius:0.5em;
    margin-top:1%;
    padding:0.5em;
    font-size:0.8em;
    background:white;
    height:2em;
    cursor:pointer;
`;
const StyledAddIcon = styled.span`
    font-size:1.5em;
    line-height:21px;
    display:inline-block;
    height:26px;
`;
const StyledAddText = styled.span`
    margin-left:0.5em;
    line-height:26px;
    display:inline-block;
    height:26px;
`;
const StyledDefaultSetting = styled.div`
    text-align:start;
    margin:5%;
    font-size:0.8em;
    input[type="checkbox"]:checked {
        background-color: crimson;
        border-color: crimson;
        color: white;
    }
    input[type="checkbox"] {
        -webkit-appearance: none;
        width: 1.5em;
        height:1.5em;
        border-radius:50%;
    }
`;
const StyledDefaultLabel = styled.label`
    vertical-align:middle;
    margin-left:0.5em;
    color:#aaa;
`;
const StyledDefaultCheckbox = styled.input`
    vertical-align:middle;
`;
const StyledSubmit = styled.div`
    color:white;
    height:2.5em;
    border-radius:0.5em;
    line-height:2.5em;
    background:crimson;
    margin: 2%;
    cursor:pointer;
`;
const StyledSimpleLoading = styled.div`
    height:100%;
    width:100%;
    position:fixed;
    background:white;
`;

//------------------------------ COMPONENT ----------------------------------
const PaymentUpdate = () => {
    //context
    const { self, setSelfHandler } = useContext(SelfContext);

    //init
    const navigate = useNavigate();    

    //state
    const [paymentType, setPaymentType] = useState(self.paymentType || 'allpay');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);    
    const [data, setData] = useState(null);    
    const [paymentCard, setPaymentCard] = useState(self.billingId);    
    const [alertModal, setAlertModal] = useState(null);

    //function
    const initData = async() => {
        if(self.isNewCard){
            setPaymentType('allpay');
            const selfData = self;
            selfData.isNewCard = false;
            setSelfHandler(selfData);
        }
        try {
            setError(null);
            setLoading(true);
            setData(null);
            
            const result = await apiCall.get("/billing");
            if(!result.data.length) return setData([]);
            
            if(Array.isArray(result.data) && !result.data.length) return setPaymentCard(null);
            if(Array.isArray(result.data) && !result.data.find(element => Number(element.id) == self.billingId)){
                setPaymentCard(result.data[result.data.length-1].id);
            } 
            setData(result.data.reverse());
        }catch(e){
            setError(e);
        }
    }

    const save = async() => {
        if(paymentType == 'allpay' && !paymentCard) return setAlertModal('noCardSelected'); 
        try {
            const params = {
                billingId : paymentCard,
                paymentType : paymentType,
            }
            const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
            const result = await apiCall.put("/self", {params}, {headers});    
            navigate(-1);
        }catch(e){
            setError(e);
            setAlertModal('error'); 
        }
    }

    const deleteCard = async() => {
        try{
            const result = await apiCall.delete(`/billing/${paymentCard}`);
            if(result.data="000") initData();
        }catch(e){
            console.log(e);
            setAlertModal('error');
        }
    }

    const moveAdd = useCallback(() => {
        navigate('/MyPage/PaymentAdd');
    }, []);

    //effect
    useEffect(() => {
        initData();
    }, []);

    //memo
    const defaultGear = useMemo(() => {
        return (
            <StyledDefaultSetting>
                <StyledDefaultCheckbox id="m" type="checkbox" defaultChecked={true} disabled/>
                <StyledDefaultLabel htmlFor="m">현재 결제 수단을 기본 결제 수단으로 설정</StyledDefaultLabel>
            </StyledDefaultSetting>                
        )
    }, []);    

    const addBtnGear = useMemo(() => {
        if(paymentType != 'allpay') return null;
        return (
            <StyledItemBodyAdd>
                <StyledAddBtn onClick={moveAdd}>
                    <StyledAddIcon>
                        +
                    </StyledAddIcon>
                    <StyledAddText>
                        새 카드 등록하기
                    </StyledAddText>
                </StyledAddBtn>
            </StyledItemBodyAdd>
        )
    }, [paymentType]);

    const cardListGear = useMemo(() => {
        if(paymentType != 'allpay') return null;
        if(!data) return null;
        return (
            data.map((item, index)=>(                
                <div key={index}>
                    <StyledItemRadio
                        id={'itemF'+index} 
                        type="radio" 
                        name="cardSelect" 
                        value={item.id} 
                        onChange = {(e) => {setPaymentCard(e.target.value)}}
                        defaultChecked={item.id == paymentCard} 
                    />
                    <StyledItemList htmlFor={'itemF'+index}>
                        {item.sInfo}
                    </StyledItemList>
                </div>
            ))                         
        )
    }, [data, paymentCard, paymentType]);

    const allpayGear = useMemo(() => {
        return(
            <StyledItemTitle>
                <StyledItemTitleRadio>
                    <StyledRadioSetting>
                        <StyledRadio 
                            id="f" 
                            type="radio" 
                            name="paymentType" 
                            value="allpay" 
                            checked={paymentType == "allpay"} 
                            onChange = {(e) => {setPaymentType(e.target.value)}}
                        />
                    </StyledRadioSetting>
                </StyledItemTitleRadio>
                <StyledItemTitleLabel htmlFor="f">
                    <StyledItemTitleIcon><SiPicpay color="crimson" size="1.5em"/></StyledItemTitleIcon>
                    <StyledItemTitleText>딜페이</StyledItemTitleText>
                </StyledItemTitleLabel>
                {paymentCard && paymentType == 'allpay' ? <StyledItemTitleDelete onClick={deleteCard}>카드 삭제</StyledItemTitleDelete> : null}
            </StyledItemTitle>
        )
    }, [paymentType, paymentCard])

    const kakaoGear = useMemo(() => {
        return(
            <StyledItemTitle>
                <StyledItemTitleRadio>
                    <StyledRadioSetting>
                        <StyledRadio 
                            id="k" 
                            type="radio" 
                            name="paymentType" 
                            value="kakao" 
                            checked={paymentType == "kakao"} 
                            onChange = {(e) => {setPaymentType(e.target.value)}}
                        />
                    </StyledRadioSetting>
                </StyledItemTitleRadio>
                <StyledItemTitleLabel htmlFor="k">
                    <StyledItemTitleIcon><img src={kakaoPayIcon}/></StyledItemTitleIcon>
                    <StyledItemTitleText>카카오페이</StyledItemTitleText>                        
                </StyledItemTitleLabel>
            </StyledItemTitle>            
        )
    }, [paymentType])

    const creditGear = useMemo(() => {
        return(
            <StyledItemTitle>
                <StyledItemTitleRadio>
                    <StyledRadioSetting>
                        <StyledRadio 
                            id="c" 
                            type="radio" 
                            name="paymentType" 
                            value="credit" 
                            checked={paymentType == "credit"} 
                            onChange = {(e) => {setPaymentType(e.target.value)}}
                        />
                    </StyledRadioSetting>
                </StyledItemTitleRadio>
                <StyledItemTitleLabel htmlFor="c">
                    <StyledItemTitleIcon><AiFillCreditCard color="#006699" size="1.5em"/></StyledItemTitleIcon>
                    <StyledItemTitleText>신용/체크카드</StyledItemTitleText>                    
                </StyledItemTitleLabel>
            </StyledItemTitle>        
        )
    }, [paymentType])

    const alertModalGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "70%", 
                    height : "8em", 
                    textAlign : "center",
                    alignContent : "stretch",  
                    fontSize : "1em", 
                    buttonStyle : 'bold',
                    buttonName: ["확인"],
                }} 
                type={1} 
                data={{
                    desc : msgData[alertModal],
                    title: "결제 수단 등록 실패"
                }}
                state={alertModal}
                closeEvent={() => setAlertModal(false)} 
            />
        )
    }, [alertModal]); 

    //render
    if(!data) return <StyledSimpleLoading />;
    return(
        <StyledPaymentUpdate>
            <Title text="결제 수단" />
            <StyledContent>
                <StyledItem>
                    {allpayGear}
                    <StyledItemBody>    
                        <StyledItemBodyList>
                            {cardListGear}
                        </StyledItemBodyList>
                        <StyledItemBodyAdd>
                            {addBtnGear}
                        </StyledItemBodyAdd>
                    </StyledItemBody>
                </StyledItem>
                <StyledItem style={{display:'none'}}>
                    {kakaoGear}
                </StyledItem>
                <StyledItem>
                    {creditGear}
                </StyledItem>
                {defaultGear}
                <StyledSubmit onClick = {save}>확인</StyledSubmit>
            </StyledContent>
            {alertModalGear}
        </StyledPaymentUpdate>
    )
}

export default PaymentUpdate;