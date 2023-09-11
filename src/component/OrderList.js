//------------------------------ MODULE -------------------------------------
import React, { useState, useEffect, useMemo, useRef, useContext } from 'react';
import { AutoTimer, Modal, CustomLoading, RejectForm } from "component";
import styled from "styled-components";
import { apiCall, priceForm, nameCut } from 'lib';
import { msgData } from "static";
import { useNavigate } from "react-router-dom";
import { BaseContext } from "context";
import { AiOutlineQuestion } from "react-icons/ai";

//------------------------------ CSS ----------------------------------------
const StyledContainer = styled.div`
    padding:0 1em;
    overflow-y:auto;
    overflow-x:hidden;
    height:63%;
`;
const StyledErrorMsg = styled.div`
    color:#888;
    padding:5em 3em;
    font-size:0.8em;
`;
const StyledItem = styled.div`
    border-bottom:0.05em solid #aaa;
    padding-top:1em;
`;
const StyledTimeLimit = styled.div`
    height:2em;
    .timeLimitText{
        font-size:0.8em;
    }
    #autoTimer{
        font-weight:550;
        line-height : 2em;
    }
`;
const StyledTeamImgBox = styled.div`
`;
const StyledTeamImg = styled.span`
    display:inline-block;
    border-radius: 50%;
    width:2.5em;
    height:2.5em;
    margin:0.3em;
    overflow:hidden;
    img, svg{
        width:100%;
        height:100%;   
        object-fit: cover;        
    }
`;
const StyledTeamText = styled.div`
    font-size:0.8em;
    padding:1em 0;
`;
const StyledGoods = styled.div`
    height:6em;
    padding:0em 1em 1em 1em;
    text-align:start;
    cursor:pointer;
`;
const StyledGoodsImgBox = styled.span`
    display:inline-block;
    width:30%;
    height:95%;
    margin-left:1em;
`;
const StyledGoodsImg = styled.img`
    height:100%;
    margin:0.1em;
`;
const StyledGoodsContentBox = styled.span`
    display:inline-block;
    margin-left:1em;
    width:55%;
    vertical-align:top;
    div{
        text-align:start;
    }
`;
const StyledGoodsDate = styled.div`
    font-size:1em;
    padding-bottom:0.3em;
    border-bottom:0.05em solid #eee;
    margin-bottom:0.3em;
`;
const StyledGoodsName = styled.div`
    font-size:0.8em;
    font-weight:550;
    padding-bottom:0.3em;
`;
const StyledGoodsOption = styled.div`
    font-size:0.8em;
    color:#888;
`;
const StyledGoodsCnt = styled.div`
    font-size:0.8em;
    color:#888;
`;
const StyledGoodsPrice = styled.div`
    font-size:0.8em;
    color:#888;
`;
const StyledTeamBtnArea = styled.div`
    padding:0em 1em 1em 1em;
`;
const StyledTeamBtnPro = styled.span`
    display:inline-block;
    width:40%;
    background:crimson;
    color:white;
    border:solid 0.05em crimson;
    border-radius:0.3em;
    line-height:1.8em;
    margin-right:0.5em;
    cursor:pointer;
`;
const StyledTeamBtnCons = styled.span`
    display:inline-block;
    width:40%;
    background:white;
    border:solid 0.05em #ccc;
    border-radius:0.3em;
    line-height:1.8em;
    margin-left:0.5em;
    color:#555;
    cursor:pointer;
`;
const StyledCancelMessage = styled.div`
    color:#888;
    line-height:1.9em;
`;
const StyledOrderBtnArea = styled.div`
    padding:0em 1em 1em 1em;
    text-align:end;
`;
const StyledOrderBtnNormal = styled.span`
    display:inline-block;
    width:25%;
    background: ${(props) => !props.unable ? 'white' : '#CCC'};
    border:solid 0.05em #ccc;
    border-radius:0.3em;
    line-height:2em;
    font-size:0.8em;
    margin-left:0.5em;
    color:#555;
    cursor:pointer;
`;
const StyledOrderBtnWide = styled.div`
    color:white;
    background:crimson;
    width:95%;
    height:2em;
    line-height:2em;
    margin:auto;
    border-radius:0.3em;
    margin-bottom:0.5em;
`;

//------------------------------ COMPONENT ----------------------------------
const ErrorMsg = React.memo(() => {
    return(
        <StyledErrorMsg>
            오류가 발생하였습니다. <br/>
            관리자에게 문의 해 주세요.
        </StyledErrorMsg>
    )
});

const EmptyMsg = React.memo(() => {
    return(
        <StyledErrorMsg>
            주문 데이터가 존재하지 않습니다.
        </StyledErrorMsg>
    )
});

const State1 = React.memo(({dt, confirmHandler, alertHandler}) => { // orderState 2
    //init
    const navigate = useNavigate();

    //ref
    const autoTimerRef = useRef();

    //state
    const [time, setTime] = useState(dt.teamData[0].teamTimeLimit);
    const [cancelChk, setCancelChk] = useState(false);

    //function
    const retry = (teamId) => {
        const obj = {
            exec : async() => {
                const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
                const params = { 'teamId' : teamId }
                const teamUpdateResult = await apiCall.put("/team/method/retry", {params}, {headers});
                if(teamUpdateResult.data.res == 'success'){
                    autoTimerRef.current.timeReset(teamUpdateResult.data.timeLimit);
                    setTime(teamUpdateResult.data.timeLimit);
                }else{
                    alertHandler('error');
                }
            }
        }
        confirmHandler('orderRetry', obj);
    }

    const cancel = (odNum, teamId) => {
        const obj = {
            exec : async() => {
                let params = { 
                    'orderNum' : odNum,
                    'reason' : '주문 취소',
                }
                const cancelResult = await apiCall.get("/billing/payback/cancel", {params});
                if(cancelResult.data == 'success'){
                    setCancelChk(true);
                    autoTimerRef.current.pause();

                    const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
                    params = { 'teamId' : teamId };
                    const breakResult = await apiCall.put("/team/after/break", {params}, {headers});
                } 
            }
        }
        confirmHandler('orderCancel', obj);
    }

    //memo
    const timeGear = useMemo(() => {
        return (
            <StyledTimeLimit>
                <AutoTimer expireEvent = {() => {setTime(0)}} timeSet = {time} type="h" ref = {autoTimerRef}/> <span className="timeLimitText">남음</span>
            </StyledTimeLimit>
        )
    }, [time, cancelChk]);

    const btnGear = useMemo(() => {
        return(
            <StyledTeamBtnArea>
                {cancelChk ? 
                    <StyledCancelMessage>주문이 취소되었습니다.</StyledCancelMessage> :
                    (
                        <>
                        <StyledTeamBtnPro 
                            onClick = {time < 1 ? () => {retry(dt.teamData[0].teamId)} : () => navigate('/MyPage/OrderDesc', { state: { orderId: dt.odId } })}
                        >
                            {time < 1 ? '재시도' : '주문 상세'}
                        </StyledTeamBtnPro>
                        <StyledTeamBtnCons onClick = {() => cancel(dt.odNo, dt.teamData[0].teamId)}>취소</StyledTeamBtnCons>                    
                        </>
                    )
                }
            </StyledTeamBtnArea>
        )
    }, [time, cancelChk]);

    const bodyGear = useMemo(() => {
        return(
            <>
            <StyledTeamImgBox>
                {dt.memberData.map((unit, unitIndex) => (
                    <StyledTeamImg key={unitIndex}>
                        {unit ? <img src={unit.img} /> : <AiOutlineQuestion color="#555" key={unitIndex} />}
                    </StyledTeamImg>
                ))}
            </StyledTeamImgBox>
            <StyledTeamText>
                팀 구매 성사를 위해 <span style={{'color':'red', 'fontWeight' : 'bold'}}>{dt.teamData[0].teamMax-dt.teamData[0].teamCnt}명</span>의 친구가 더 필요합니다.
            </StyledTeamText>
            <StyledGoods onClick = {() => navigate('/Description', { state: { id: dt.goodsInfo.goodsId } })}>
                <StyledGoodsImgBox>
                    <StyledGoodsImg src={`${process.env.REACT_APP_SERVER_URL}/${dt.goodsInfo.simg1}`}/>
                </StyledGoodsImgBox>
                <StyledGoodsContentBox>
                    <StyledGoodsName>{nameCut(dt.goodsInfo.goodsName, 23)}</StyledGoodsName>
                    <StyledGoodsOption>옵션 : {dt.goodsInfo.optionName}</StyledGoodsOption>
                    <StyledGoodsCnt>주문수량 : {dt.qty}개</StyledGoodsCnt>
                    <StyledGoodsPrice>결제금액 : {priceForm(dt.amount)}</StyledGoodsPrice>
                </StyledGoodsContentBox>
            </StyledGoods>
            </>
        )
    }, []);

    //render
    return(
        <>
        {
            <StyledItem>
                {timeGear}
                {bodyGear}
                {btnGear}
            </StyledItem>
        }
        </>
    )
});

const State2 = React.memo(({dt, confirmHandler}) => { // orderState 3, 11, 12, 41
    //init
    const navigate = useNavigate();

    //state
    const [cancelChk, setCancelChk] = useState(false);

    //function
    const cancelReq = (odNum) => {
        const obj = {
            exec : async() => {
                let params = { 
                    'orderNum' : odNum,
                    'reason' : '고객 주문취소 신청',
                }
                const cancelResult = await apiCall.get("/billing/payback/cancelReq", {params});
                if(cancelResult.data == 'success'){
                    setCancelChk(true);
                } 
            }
        }
        confirmHandler('orderCancelReq', obj);
    }    

    //memo
    const btnGear = useMemo(() => {
        //watershed
        let stateText;
        switch(dt.state) {
            case  3 : 
                stateText = !cancelChk 
                    ? <StyledOrderBtnNormal onClick={() => cancelReq(dt.odNo)}>주문 취소</StyledOrderBtnNormal>
                    : <StyledOrderBtnNormal unable={true}>취소 접수중</StyledOrderBtnNormal>;
                    break;
            case 11 : stateText = <StyledOrderBtnNormal unable={true}>배송 준비중</StyledOrderBtnNormal>;
                    break;
            case 12 : stateText = <StyledOrderBtnNormal unable={true}>배송 보류중</StyledOrderBtnNormal>;
                    break;
            case 41 : stateText = <StyledOrderBtnNormal unable={true}>취소 접수중</StyledOrderBtnNormal>;
        }        

        //render
        return(
            <StyledOrderBtnArea>                    
                <StyledOrderBtnNormal onClick={() => navigate('/MyPage/OrderDesc', { state: { orderId: dt.odId } })}>주문 상세</StyledOrderBtnNormal>
                {stateText}
            </StyledOrderBtnArea>            
        )
    }, [cancelChk]);

    //render
    return(        
        <StyledItem>
            <StyledGoods onClick = {() => navigate('/Description', { state: { id: dt.goodsInfo.goodsId } })}>
                <StyledGoodsImgBox>
                    <StyledGoodsImg src={`${process.env.REACT_APP_SERVER_URL}${dt.goodsInfo.simg1}`}/>
                </StyledGoodsImgBox>
                <StyledGoodsContentBox>
                    <StyledGoodsName>{nameCut(dt.goodsInfo.goodsName, 23)}</StyledGoodsName>
                    <StyledGoodsOption>옵션 : {dt.goodsInfo.optionName}</StyledGoodsOption>
                    <StyledGoodsCnt>주문수량 : {dt.qty}</StyledGoodsCnt>
                    <StyledGoodsPrice>결제금액 : {priceForm(dt.goodsPrice)}</StyledGoodsPrice>
                </StyledGoodsContentBox>
            </StyledGoods>
            {btnGear}
        </StyledItem>
    )
});

const State3 = React.memo(({dt}) => { // orderState 13
    //init
    const navigate = useNavigate();

    //context
    const { base } = useContext(BaseContext);

    //memo
    const btnGear = useMemo(() => {
        return(
            <StyledOrderBtnArea>
                <StyledOrderBtnNormal onClick={() => navigate('/MyPage/OrderDesc', { state: { orderId: dt.odId } })}>주문 상세</StyledOrderBtnNormal>
                <StyledOrderBtnNormal onClick={() => {window.location.href=`${base['delivery'][dt.deliveryCompany].link}${dt.deliveryNo}`}}>배송 조회</StyledOrderBtnNormal>
            </StyledOrderBtnArea>            
        )
    }, []);

    //render    
    return(        
        <StyledItem>
            <StyledGoods onClick = {() => navigate('/Description', { state: { id: dt.goodsInfo.goodsId } })}>
                <StyledGoodsImgBox>
                    <StyledGoodsImg src={`${process.env.REACT_APP_SERVER_URL}${dt.goodsInfo.simg1}`}/>
                </StyledGoodsImgBox>
                <StyledGoodsContentBox>
                    <StyledGoodsName>{nameCut(dt.goodsInfo.goodsName, 23)}</StyledGoodsName>
                    <StyledGoodsOption>옵션 : {dt.goodsInfo.optionName}</StyledGoodsOption>
                    <StyledGoodsCnt>주문수량 : {dt.qty}</StyledGoodsCnt>
                    <StyledGoodsPrice>결제금액 : {priceForm(dt.goodsPrice)}</StyledGoodsPrice>
                </StyledGoodsContentBox>
            </StyledGoods>
            {btnGear}
        </StyledItem>
    )
});

const State4 = React.memo(({dt, rejectHandler}) => { // orderState 14
    //init
    const navigate = useNavigate();

    //state
    const [rejectResult, setRejectResult] = useState(false);

    //context
    const { base } = useContext(BaseContext);

    //function
    const makeRejectPage = () => {
        rejectHandler(<RejectForm dt={dt} selfHandler = {rejectHandler} resultHandler = {setRejectResult}/>);
    }

    //memo
    const btnGear = useMemo(() => {
        return !rejectResult ? (
            <>
            <StyledOrderBtnArea>
                <StyledOrderBtnNormal onClick={() => {window.location.href=`${base['delivery'][dt.deliveryCompany].link}${dt.deliveryNo}`}}>배송 상세</StyledOrderBtnNormal>
                <StyledOrderBtnNormal onClick={() => navigate('/MyPage/OrderDesc', { state: { orderId: dt.odId } })}>주문 상세</StyledOrderBtnNormal>
                <StyledOrderBtnNormal onClick={makeRejectPage}>교환 및 반품</StyledOrderBtnNormal>
            </StyledOrderBtnArea>            
            {dt.review == 'y' ? null : <StyledOrderBtnWide onClick={() => navigate('/MyPage/ReviewAdd', { state: { order: dt, mode: 'add' } })}>구매 후기 작성하기</StyledOrderBtnWide>}
            </>
        ) : <StyledCancelMessage>{rejectResult}</StyledCancelMessage>;
    }, [rejectResult]);

    //render    
    return(        
        <StyledItem>
            <StyledGoods onClick = {() => navigate('/Description', { state: { id: dt.goodsInfo.goodsId } })}>
                <StyledGoodsImgBox>
                    <StyledGoodsImg src={`${process.env.REACT_APP_SERVER_URL}${dt.goodsInfo.simg1}`}/>
                </StyledGoodsImgBox>
                <StyledGoodsContentBox>
                    <StyledGoodsDate>{dt.invoiceDate.substr(0, 10)} 배송 완료</StyledGoodsDate>
                    <StyledGoodsName>{dt.goodsInfo.goodsName}</StyledGoodsName>
                </StyledGoodsContentBox>
            </StyledGoods>
            {btnGear}
        </StyledItem>
    )
});

const OrderList = React.memo(({orderState}) => {
    //ref
    const observer = useRef();
    const lastChk = useRef(false);

    //state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [confirm, setConfirm] = useState(null);
    const [confirmFunc, setConfirmFunc] = useState(null);
    const [alert, setAlert] = useState(null);
    const [reject, setReject] = useState(null);
    const [rejectFunc, setRejectFunc] = useState(null);
    const [page, setPage] = useState(1);
    const [pageLoading, setPageLoading] = useState(false);

    //function
    const initData = async() => {
        try {
            setPage(1);
            lastChk.current = false;
            setError(null);
            setLoading(true);
            setData(null);
            let params;
            
            //order
            params = { 'self' : true, 'state' : orderState, 'extraInfo' : ['team']};
            if(orderState == 3) params.state = [orderState, 11, 12, 41]; //only for state 3 (add 11, 12, 41)
            if(orderState == 14) params = {...params, ...{'rpp' : 5, 'page' : page}};
            const orderResult = await apiCall.get(`/order`, {params});
            if(orderResult.data.result != 'success') return setError(true);

            //plus count of left members
            for(let i of orderResult.data.data){
                let originalLength = i.memberData.length;
                i.memberData.length += i.teamData[0].teamMax - i.teamData[0].teamCnt;
                i.memberData.fill(null, originalLength);
            } 
            setData(orderResult.data.data);
        }catch(e){
            setError(e);
        }
        setLoading(false);
    }    

    const confirmHandler = (msg, func) => {
        setConfirm(msg);
        setConfirmFunc(func);
    }

    const alertHandler = (msg) => setAlert(msg);
    
    const rejectHandler = (rejectPage, func) => {
        setReject(rejectPage);
        setRejectFunc(func);
    }    

    //only for State14
    const addData = async() => {
        try {
            const params = { 
                'self' : true, 
                'state' : orderState, //14
                'rpp' : 5, 
                'page' : page,
            };
            const orderResult = await apiCall.get(`/order`, {params});
            if(orderResult.data.result == 'success'){
                if(!orderResult.data.data.length){ //----IS THE LAST INDEX IN ITEM DATAS----//
                    setPageLoading(false);            
                    return lastChk.current = true;
                } 
                setData([...data, ...orderResult.data.data]);
            } 
        }catch(e){
            console.log(e);
        }
        setPageLoading(false);
    }    

    const lastItemElementRef = (node) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            //----INTERSECT THE LAST ITEM IN A PAGE----//
            if (entries[0].isIntersecting && !pageLoading && !lastChk.current) {
                setPageLoading(true);
                setPage((page) => page+1);
            }
        });
        if (node) observer.current.observe(node);
    }

    //effect
    useEffect(() => {
        initData();
    }, [orderState]);
    
    useEffect(() => {
        if(page > 1) addData();
    }, [page]); 

    //memo
    const confirmGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "75%", 
                    height : "8em", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : confirm == 'orderCancelReq' ? "0.75em" : "1em", 
                    buttonName : ["확인","취소"]
                }} 
                type={2}
                proEvent = {() => {
                    if(confirmFunc) confirmFunc.exec();
                    return true;
                }}
                consEvent = {() => {
                    return true;
                }}
                data={{
                    desc : msgData[confirm],
                    title : confirm == 'orderCancel' ? null : (confirm == 'orderRetry' ? msgData['retryConfirm'] : msgData['cancelReqConfirm'])
                }}
                state={confirm} 
                closeEvent={() => setConfirm(false)}
            />
        )
    }, [confirm, confirmFunc]);

    const listGear = useMemo(() => {
        if(!data) return null;
        return (
            <>
            {data.map((item, index) => {
                if(orderState == 2) return <State1 key={index} dt={item} confirmHandler = {confirmHandler} alertHandler = {alertHandler}/>
                if(orderState == 3) return <State2 key={index} dt={item} confirmHandler = {confirmHandler} alertHandler = {alertHandler}/>
                if(orderState == 13) return <State3 key={index} dt={item} confirmHandler = {confirmHandler} alertHandler = {alertHandler}/>
                if(orderState == 14) return (
                    <div ref={index==data.length-1 ? lastItemElementRef : null} key={index}>
                        <State4 dt={item} confirmHandler = {confirmHandler} alertHandler = {alertHandler} rejectHandler = {rejectHandler}/>
                    </div>
                )
            })}
            </>
        )
    }, [data]);

    const alertGear = useMemo(() => {
        return(
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
                data={{desc : msgData[alert]}}
                state={alert} 
                closeEvent={() => {
                    setAlert(false);
                    return true;    
                }}
            />     
        )        
    }, [alert]);    

    const rejectGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "80%", 
                    height : "23em", 
                    textAlign : "center",
                    alignContent : "stretch",  
                    fontSize : "1em", 
                }} 
                type={0} 
                data={{desc : reject, title:"교환 및 반품신청"}}
                state={reject} 
                closeEvent={() => {
                    setReject(false);
                    return true;    
                }}
            />     
        )        
    }, [reject]);    

    const emptyGear = useMemo(() => <EmptyMsg />, [data])

    //render
    if(!data) return <CustomLoading marginB="130%" size="10px" color="#aaa"/>;
    if(data.length < 1) return emptyGear;
    return(
        <StyledContainer>
            {error ? <ErrorMsg/> : null}
            {listGear}
            {confirmGear}    
            {alertGear}   
            {rejectGear}
        </StyledContainer>
    )
});

export default OrderList;

