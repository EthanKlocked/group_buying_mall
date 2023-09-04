//------------------------------ MODULE -------------------------------------
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Title, Modal, CustomLoading, SimpleMotion, PriceInput, QuestionIcon, PointInfo } from "component";
import { useState, useMemo, useEffect, useContext } from "react";
import { apiCall, priceForm, onErrorImg, vnotiCall } from "lib";
import { AiFillPlusSquare, AiFillMinusSquare} from "react-icons/ai";
import { OrderContext, SelfContext } from "context";
import { msgData } from "static";
import kakaoPayIcon from 'data/img/kakaopay.png';
import { SiPicpay } from "react-icons/si";
import { AiFillCreditCard } from "react-icons/ai";
import { loadTossPayments } from '@tosspayments/payment-sdk'
import { BaseContext, CacheContext } from "context";

//------------------------------ CSS ----------------------------------------
const StyledOrder = styled.div`
    height:100%;
    img{
        width:100%;
    }
`;
const StyledContent = styled.div`
    margin-top:3.5em;
    overflow:auto;
    padding-bottom:0.5em;
    height:calc(100% - 5em);
`;
const StyledSection = styled.div`
    padding:0.5em 0.8em;
    border-bottom:solid 0.5em #eee;
`;
const StyledSectionHeader = styled.div`
    overflow:auto;
    padding-bottom:0.3em;
`;
const StyledSectionTitle = styled.span`
    float:left;
    font-size:1.2em;
`;
const StyledSectionButton = styled.span`
    float:right;
    margin-right:1em;
    position:relative;
    color:crimson;
    cursor:pointer;
    &:after{
        content: '';
        position:absolute;
        width:0.5em;
        height:0.5em;
        border-top: 2px solid crimson; 
        border-right: 2px solid crimson;
        transform: rotate(45deg);
        top:0.4em;
    }
`;
const StyledSectionMainInfo = styled.div`
    overflow:auto;
    padding-bottom:0.5em;
    div{
        font-size:0.9em;
        text-align:start;
    }
`;
const StyledSectionPaymentTitle = styled.div`
    float:left;
    font-weight:bold;
    font-size:1em;
    svg{
        vertical-align:text-top;
        color:crimson;
    }
`;
const StyledSectionSubInfo = styled.div`
    text-align:start;
    color:#aaa;
    font-size:0.8em;
    font-weight:normal;
    padding-bottom:0.5em;
    div{
        font-size:0.9em;
        text-align:start;
    }
`;
const StyledOrderSection = styled.div`
    padding:0.5em 0.8em;
    border-bottom:solid 0.5em #eee;    
`;
const StyledOrderImg = styled.span`
    display:inline-block;
    width:30%;
    height:100%;
    float:left;
    margin-top:0.5em;
`;
const StyledOrderDetail = styled.span`
    display:inline-block;
    width:68%;
    height:100%;
    padding-left:2%;
`;
const StyledOrderName = styled.div`
    text-align:start;
    margin: 0.3em 0 0.5em 0;
`;
const StyledOrderOption = styled.div`
    text-align:start;
    font-size:0.8em;
    margin: 0.5em 0;
    border-top:solid 1px #aaa;
`;
const StyledOrderPrice = styled.div`
    text-align:start;
    font-size:0.8em;
    color:#aaa;
    margin: 0.5em 0;
`;
const StyledOrderDelivery = styled.div`
    text-align:start;
    font-size:0.8em;
    color:#aaa;
    margin: 0.5em 0;
`;
const StyledOrderPoint = styled.div` 
    text-align:start;
    font-size:0.8em;
    color:#aaa;
    margin: 0.3em 0;
    display: flex;
    align-items:${(props) => props.pointYn? 'flex-start' : 'center'};
`;
const StyledOrderTotal = styled.div`
    text-align:start;
    font-size:0.8em;
`;
const StyledOrderPriceTitle = styled.span`
    text-align:start;
    width:50%;
    display:inline-block;
    vertical-align:top;
`;
const StyledOrderPriceInfo = styled.span`
    display:flex;
    align-content:flex-end;
    text-align:end;
    width:50%;
    display:inline-block;
    font-weight:bold;
    input{
        background:#eee;
        border-radius: 0.5em;
        border: none;
        padding: 0.3em;
        text-align:right;
        font-weight:bold;
        width:50%;
    }
`;
const StyledOrderCnt = styled.div`
    margin-top:0.5em;
    border-top:solid 1px #aaa;
    padding-top:0.5em;
`;
const StyledOrderCntTitle = styled.span`
    display:inline-block;
    text-align:start;
    width:50%;
`;
const StyledOrderCntUpdown = styled.span`
    display:inline-block;
    text-align:end;
    width:50%;
`;
const StyledOptionCountBtn = styled.span`
    vertical-align: -webkit-baseline-middle;
    cursor:pointer;
    //margin: 0 0.5em;
`;
const StyledOptionCountNumber = styled.span`
    vertical-align:middle;
    display:inline-block;
    width:2em;
`;
const StyledTermTitle = styled.span`
    display:inline-block;
    text-align:start;
    width:70%;
    font-size:0.8em;
`;
const StyledTermBtn = styled.span`
    display:inline-block;
    text-align:end;
    width:30%;
    font-size:0.8em;
    color:#aaa;
    cursor:pointer;
`;
const StyledTermContent = styled.div`
    display:${(props) => props.open ? 'inline-block' : 'none'};
    text-align:start;
    font-size:0.8em;
    width:100%;
    color:#888;
    padding-top:1em;
    white-space: pre-wrap;
`;
const StyledFooter = styled.div`
    padding:0.5em;
    padding-bottom:3em;
    font-size:0.8em;
    font-weight:bold;  
`;
const StyledBuy = styled.div`
    width:100%;
    height:3em;
    bottom:0;
    position:fixed;
    border-top:solid 1px #aaa;
    z-index:1;
    background:white;
`;
const StyledBuySubmit = styled.div`
    width:90%;
    height:2em;
    background:crimson;
    margin:auto;
    margin-top:0.5em;
    color:white;
    font-weight:bold;
    border-radius:0.5em;
    line-height:2em;
    cursor:pointer;
`;
const StyledPaymentIcon = styled.span`
    margin-right: 0.5em;
    img{
        width:3em;
        vertical-align:bottom;
    }
`;

//------------------------------ COMPONENT ----------------------------------
const Order = () => {
    //context
    const { order, setOrderHandler } = useContext(OrderContext);
    const { self, setSelfHandler } = useContext(SelfContext);
    const { base } = useContext(BaseContext);
    const { setCacheHandler } = useContext(CacheContext);

    //init
    const navigate = useNavigate(); 

    //state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);    
    const [data, setData] = useState(null);    
    const [count, setCount] = useState(order.set.count);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [defaultDelivery, setDefaultDelivery] = useState('blank');
    const [orderConfirm, setOrderConfirm] = useState(false);
    const [orderAlert, setOrderAlert] = useState(false);
    const [paymentType, setPaymentType] = useState(self.paymentType);
    const [defaultCard, setDefaultCard] = useState(null);
    const [termOpen, setTermOpen] = useState(false);

    const [point, setPoint] = useState(''); 
    const [vpointAble, setVpointAble] = useState(0); 
    const [vpoint, setVpoint] = useState(''); 
    const [vid, setVid] = useState(''); 

    //function
    const initData = async() => {
        try {
            //selfJoinChk
            if(order.set.join && order.set.join.team.teamHost == self.id){
                if(!alert(msgData['selfJoinError'])) return navigate('/', {replace : true });
            } 

            //Join able Chk
            if(order.set.join){
                let ExpireChk = await apiCall.get(`/team/${order.set.join.team.teamId}/ableChk`);
                if(ExpireChk.data != 'able'){
                    if(!alert(msgData['teamFull'])) return navigate('/', {replace : true });
                }
            } 
            
            const selfData = await apiCall.get(`/self/self`);
            setSelfHandler(selfData.data); //----SELF CONTEXT UPDATE----//            
            setPaymentType(selfData.data.paymentType);

            setError(null);
            setLoading(true);
            setData(null);
            setCount(order.set.count);
            
            //vnoti point Chk
            const vnotiId = selfData.data.snsid3;
            if(vnotiId){
                setVid(vnotiId);
                const pointData = await vnotiCall.get(`/point/${vnotiId}`);
                if(pointData.data.result == "000") setVpointAble(pointData.data.data.mb_point);                 
            }

            //address
            const result = await apiCall.get("/address");
            const addrId = selfData.data.addrId;
            const billingId = selfData.data.billingId;

            if(result.data.length>0){
                if(!addrId){
                    setDefaultDelivery(result.data[result.data.length-1]); //DEFAULT 0
                }
                const defaultAddr = result.data.filter((item, index) => {
                    if(item.id == addrId) return true;
                })
                if(defaultAddr.length > 0){
                    setDefaultDelivery(defaultAddr[0]); //DEFAULT SET
                }else{
                    setDefaultDelivery(result.data[result.data.length-1]); //DEFAULT 0
                }
            }else{
                setDefaultDelivery('empty'); //DEFAULT 0
                console.log('empty addr'); //EMPTY BUTTON
            }

            //payment
            if( selfData.data.paymentType == 'allpay' && billingId ){
                const paymentResult = await apiCall.get(`/billing/${billingId}`);                
                setDefaultCard(paymentResult.data);
            }

            setTimeout(() => setLoading(false), 500);
        }catch(e){
            setError(e);
        }
    };

    const editDelivery = async() => {
        const orderObj = order;
        orderObj.set.count = count;
        setOrderHandler({ready : null, set : orderObj.set}); //----ORDER CONTEXT UPDATE(COUNT)----//
        const updateData = await apiCall.get(`/self/self`);
        setSelfHandler(updateData.data); //----SELF CONTEXT UPDATE----//
        navigate('/MyPage/AddressUpdate');
    };

    const editPayment = async() => {
        const orderObj = order;
        orderObj.set.count = count;
        setOrderHandler({ready : null, set : orderObj.set}); //----ORDER CONTEXT UPDATE(COUNT)----//
        const updateData = await apiCall.get(`/self/self`);
        setSelfHandler(updateData.data); //----SELF CONTEXT UPDATE----//
        navigate('/MyPage/PaymentUpdate');
    };

    const orderExec = async() => {
        //soldOut Chk
        let optionQtyChk = await apiCall.get(`/goods/${order.set.option.optionId}/optionStockChk`);
        if(!optionQtyChk.data){
            if(!alert(msgData['soldOut'])) return navigate('/', {replace : true });
        }

        //Join able Chk
        if(order.set.join){
            let ExpireChk = await apiCall.get(`/team/${order.set.join.team.teamId}/ableChk`);
            if(ExpireChk.data != 'able'){
                if(!alert(msgData['teamFull'])) return navigate('/', {replace : true });
            }
        }

        //minumum point Chk
        const minPoint = base.minPoint || base.default.minPoint;
        if((point || vpoint) && (point + vpoint < minPoint)) return setOrderAlert('MinpointNotUsed');

        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< init >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        if(defaultDelivery == 'empty' || defaultDelivery == 'blank') return setOrderAlert('isNotAddress');
        if(!paymentType) return setOrderAlert('isNotPayment');
        if(paymentType == 'allpay' && !defaultCard ) return setOrderAlert('noCardSelected');
        if(paymentType == 'kakao') return setOrderAlert('noFunction');
        if(paymentType != 'allpay' && paymentType != 'kakao' && paymentType != 'credit' ) return setOrderAlert('error');

        const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
        let teamId = null;
        let params = { 'order' : order.set };

        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< make team >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        if(!order.set.join){ // NEW
            const teamResult = await apiCall.post("/team", {params}, {headers});        
            if(teamResult.data.res != 'success') return setOrderAlert('error');
            teamId = teamResult.data.teamId;
        }else{// JOIN
            teamId = order.set.join.team.teamId;
        }

        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< make order >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        const goodsTotal = (order.set.goods.goodsPrice + order.set.option.addPrice);
        params['addr'] = defaultDelivery;
        params['count'] = count;
        params['teamId'] = teamId;
        params['amount'] = count * (deliveryFee + goodsTotal) - point - vpoint;
        params['paymentType'] = paymentType;
        params['point'] = point + vpoint;
        params['pointIn'] = point;
        params['pointOut'] = vpoint;

        const orderResult = await apiCall.post("/order", {params}, {headers});        
        if(orderResult.data.res != 'success') return setOrderAlert('error');

        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< make pay >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        if(paymentType == 'credit'){ //card&credit
            setLoading(true);
            //const clientKey = process.env.REACT_APP_TOSS_CLIENT;
            const clientKey = base.pgClientKey;
            const isParticipate = order.set.join ? 'y' : 'n';

            const orderObject = {
                amount: count * (deliveryFee + goodsTotal) - point - vpoint, 
                orderId: `${orderResult.data.orderNum}`, 
                orderName: `${order.set.goods.goodsName} : ${order.set.option.optionName}`, 
                customerName: self.name, 
                successUrl: `${window.location.protocol}//${window.location.host}/TossSuccess?teamId=${teamId}&joinChk=${isParticipate}&optionId=${order.set.option.optionId}&vid=${vid}&apoint=${point}&vpoint=${vpoint}`, 
                failUrl: `${window.location.protocol}//${window.location.host}/TossFail`,                                         
            }

            //toss sdk open [iframe]
            if(window.self != window.top){
                window.parent.postMessage({type:"toss", clientKey:clientKey, orderObject:orderObject}, `${process.env.REACT_APP_HOST}`);
                return setLoading(false);
            }

            //toss sdk open [normal]
            loadTossPayments(clientKey).then(tossPayments => {
                tossPayments.requestPayment(`카드`, orderObject);
            });
            return setLoading(false);;
        }

        //simple pay
        setLoading(true);
        let payChk = false;
        if(paymentType == 'allpay'){ 
            /*****************  PAYMENT CHECK *******************/
            params = { 
                'orderName' : `${order.set.goods.goodsName} : ${order.set.option.optionName}`,
                'orderNum' : orderResult.data.orderNum,
                'amount' : count * (deliveryFee + goodsTotal) - point - vpoint,
                'customerName' : self.name
            }
            const payResult = await apiCall.get(`/billing/${defaultCard.id}/pay`, {params});        
            if(payResult.data == 'success'){ //pay Success

                /***************** POINT CHECK *******************/
                /* CASE INDEPENDENT POINT USE (doesn't need when point controlled by server side logic)
                //POINT CONTROLL
                let alldealPointChk = 'try';
                let vnotiPointChk = 'try';

                //alldeal point try
                if(Number(point) > 0){
                    params = { 'amount' : -Number(point) };
                    const aPointUse = await apiCall.get("/member/any/point", {params});
                    alldealPointChk = (aPointUse.data == "success") ? 'ok' : 'fail';
                }

                //vnoti point try
                if(vid && Number(vpoint) > 0){
                    const vPointUse = await vnotiCall.get(`/point/${vid}/order?od_id=${orderResult.data.orderNum}&use_point=${vpoint}`);
                    vnotiPointChk = (vPointUse.data.result == "000") ? 'ok' : 'fail';
                }

                //point failed
                if(alldealPointChk =='fail' || vnotiPointChk == 'fail'){
                    payChk = false;
                    //order status reset process
                    params = { 
                        'orderNum' : orderResult.data.orderNum,
                        'orderStatus' : '1', // 2 -> 1
                        'teamId' : 'reset',
                    }
                    const orderUpdateResult = await apiCall.put("/order", {params}, {headers}); //orderCancel

                    //payback
                    params.reason = '포인트 사용 오류';
                    const cancelResult = await apiCall.get("/billing/payback/cancel", {params}); //billingCancel                        

                    if(alldealPointChk == 'ok'){ //case alldeal used vnoti failed
                        params = { 'amount' : Number(point) };
                        const aPointCancel = await apiCall.get("/member/any/point", {params});
                    }

                    if(vnotiPointChk == 'ok'){ //case alldeal failed vnoti used
                        const vPointCancel = await vnotiCall.get(`/point/${vid}/cancel?od_id=${orderResult.data.orderNum}`);
                    }                        
                }else{ //point Success
                */
                    /***************** TEAM UPDATE *******************/
                    params = { 'teamId' : teamId }
                    const teamUpdateResult = await apiCall.put("/team", {params}, {headers}); //case 1 : ready -> set, case2 : set -> go(order state to 3)
                    if(teamUpdateResult.data != 'success') { //team update failed => order status 0, payback
                        //order status reset process
                        params = { 
                            'orderNum' : orderResult.data.orderNum,
                            'orderStatus' : '1', // 2 -> 1
                            'teamId' : 'reset',
                        }
                        const orderUpdateResult = await apiCall.put("/order", {params}, {headers}); //orderCancel

                        //payback
                        params.reason = '팀 생성 오류';
                        const cancelResult = await apiCall.get("/billing/payback/cancel", {params}); //billingCancel

                        /* CASE INDEPENDENT POINT USE
                        if(alldealPointChk == 'ok'){ //case alldeal used vnoti failed
                            params = { 'amount' : Number(point) };
                            const aPointCancel = await apiCall.get("/member/any/point", {params});
                        }
    
                        if(vnotiPointChk == 'ok'){ //case alldeal failed vnoti used
                            const vPointCancel = await vnotiCall.get(`/point/${vid}/cancel?od_id=${orderResult.data.orderNum}`);
                        }
                        */
                        payChk = false;
                    }else{
                        payChk = true;                    
                    }
                //}
            }else{
                //order status reset process
                params = { 
                    'orderNum' : orderResult.data.orderNum,
                    'orderStatus' : '1', 
                    'teamId' : 'reset',
                }
                const orderUpdateResult = await apiCall.put("/order", {params}, {headers}); //orderCancel

                /*
                if(payResult.data != 'networkErr'){ //order update failed => payback
                    //payback
                    params = { 
                        'orderNum' : orderResult.data.orderNum,
                        'reason' : '결제 오류',
                    }
                    const cancelResult = await apiCall.get("/billing/payback/cancel", {params});
                    console.log(cancelResult.data);
                }
                */
                payChk = false;
            }
        } 
        
        if(payChk){
            setOrderConfirm(true);
            setCacheHandler(new Object);
        }else{
            setOrderAlert('error');
        }
        setLoading(false);
    };

    //effect
    useEffect(() => {
        initData();
    }, []);

    //memo
    const addrGear = useMemo(() => {
        if(defaultDelivery == 'blank') return null;
        if(defaultDelivery == 'empty'){
            return(
                <StyledSection>
                    <StyledSectionHeader>
                        <StyledSectionTitle>배송지</StyledSectionTitle>
                        <StyledSectionButton onClick = {editDelivery}>변경하기</StyledSectionButton>
                    </StyledSectionHeader>
                    <StyledSectionSubInfo>
                        배송지 정보가 존재하지 않습니다.
                    </StyledSectionSubInfo>
                </StyledSection>
            )
        } 
        return (
            <StyledSection>
                <StyledSectionHeader>
                    <StyledSectionTitle>배송지</StyledSectionTitle>
                    <StyledSectionButton onClick = {editDelivery}>변경하기</StyledSectionButton>
                </StyledSectionHeader>
                <StyledSectionMainInfo>
                    <div>{defaultDelivery.recipient} {defaultDelivery.tel}</div>
                    <div>{defaultDelivery.address1} {defaultDelivery.address2}</div>
                </StyledSectionMainInfo>
                <StyledSectionSubInfo>
                    <div>공동현관 비밀번호 : {defaultDelivery.password}</div>
                    <div>배송 수령 방법 : {defaultDelivery.extraInfo}</div>
                </StyledSectionSubInfo>
            </StyledSection>
        )
    }, [defaultDelivery, count])

    const paymentGear = useMemo(() => {
        return (
            <StyledSection>
                <StyledSectionHeader>
                    <StyledSectionTitle>결제수단</StyledSectionTitle>
                    <StyledSectionButton onClick={editPayment}>변경하기</StyledSectionButton>
                </StyledSectionHeader>
                <StyledSectionMainInfo>
                    <StyledSectionPaymentTitle>
                        {
                            paymentType == 'credit' ? 
                                <>
                                    <StyledPaymentIcon>
                                        <AiFillCreditCard size="1.5em" color="#006699"/>
                                    </StyledPaymentIcon>
                                    <span>신용/체크카드</span>
                                </>
                                : null
                        }                        
                        {
                            paymentType == 'kakao' ? 
                                <>
                                    <StyledPaymentIcon>
                                        <img src={kakaoPayIcon}/> 
                                    </StyledPaymentIcon>
                                    <span>카카오페이</span>
                                </>
                                : null
                        }
                        {
                            paymentType == 'allpay' && defaultCard? 
                                <>
                                    <StyledPaymentIcon>
                                        <SiPicpay size="1.5em"/>
                                    </StyledPaymentIcon>
                                    <span>딜페이</span>
                                </>
                                : null
                        } 
                        {
                            !paymentType || (paymentType == 'allpay' && !defaultCard) ? <StyledSectionSubInfo> 결제수단이 선택되지 않았습니다.</StyledSectionSubInfo> : null
                        }                       

                    </StyledSectionPaymentTitle>
                </StyledSectionMainInfo>
                <StyledSectionSubInfo>
                    {
                        paymentType == 'allpay' && defaultCard ? 
                            <span>{defaultCard.sInfo}</span>
                            : null
                    }             
                </StyledSectionSubInfo>
            </StyledSection>              
        )
    }, [defaultCard, paymentType, count])

    const orderGear = useMemo(() => {
        return(
            <>
            <StyledSectionHeader>
                <StyledSectionTitle>주문 상품</StyledSectionTitle>
            </StyledSectionHeader>
            <StyledOrderImg>
                <img src={`${process.env.REACT_APP_SERVER_URL}${order.set.goods.simg1}`} onError={onErrorImg}/>
            </StyledOrderImg>
            </>
        )
    }, [])

    const priceGear = useMemo(() => {
        const minPoint = base.minPoint || base.default.minPoint;
        const maxPoint = base.maxPoint || base.default.maxPoint;
        const goodsTotal = (order.set.goods.goodsPrice + order.set.option.addPrice);
        //const realMax = Math.min(self.point, maxPoint, (count * (deliveryFee + goodsTotal))/10-vpoint);
        //const realMaxV = Math.min(vpointAble, maxPoint, (count * (deliveryFee + goodsTotal))/10-point);
        const realMax = Math.min(self.point, (count * (deliveryFee + goodsTotal)) * maxPoint/100 - vpoint);
        const realMaxV = Math.min(vpointAble, (count * (deliveryFee + goodsTotal)) * maxPoint/100 - point);        

        const pointAbleChk = (self.point+vpointAble >= minPoint);

        return(
            <>
            <StyledOrderDetail>
                <StyledOrderName>{order.set.goods.goodsName}</StyledOrderName>
                <StyledOrderOption>선택옵션 : {order.set.option.optionName}</StyledOrderOption>
                <StyledOrderPrice>
                    <StyledOrderPriceTitle>총 상품 가격</StyledOrderPriceTitle>
                    <StyledOrderPriceInfo>{priceForm(count * goodsTotal)}</StyledOrderPriceInfo>
                </StyledOrderPrice>
                <StyledOrderDelivery>
                    <StyledOrderPriceTitle>배송비</StyledOrderPriceTitle>
                    <StyledOrderPriceInfo>{deliveryFee}원</StyledOrderPriceInfo>
                </StyledOrderDelivery>
                {
                    base.pointYn=='y' ? ( // the shop should use point option
                    <>
                        <StyledOrderPoint pointYn={ pointAbleChk } style={{'display':'none'}}>
                            <StyledOrderPriceTitle>포인트 <QuestionIcon content={<PointInfo/>}/></StyledOrderPriceTitle>
                            <StyledOrderPriceInfo>
                                <span style={{fontSize:'0.9em',fontWeight:'normal'}}>{pointAbleChk ? <>사용가능</>:null} {self.point.toLocaleString()}원</span>
                                {pointAbleChk ? <><PriceInput changeHandler={setPoint} max={realMax}/>원</> : null} 
                            </StyledOrderPriceInfo>
                        </StyledOrderPoint>                
                        <StyledOrderPoint pointYn={ pointAbleChk }>
                            <StyledOrderPriceTitle>Vnoti 포인트 <QuestionIcon content={<PointInfo/>}/></StyledOrderPriceTitle>
                            <StyledOrderPriceInfo>
                                <span style={{fontSize:'0.9em',fontWeight:'normal'}}>{pointAbleChk ? <>사용가능</>:null} {vpointAble.toLocaleString()}원</span>
                                {pointAbleChk ?<><PriceInput changeHandler={setVpoint} max={realMaxV}/>원</> : null}
                            </StyledOrderPriceInfo>
                        </StyledOrderPoint>        
                    </>
                    ) : null                    
                }
        
                <StyledOrderTotal>
                    <StyledOrderPriceTitle>상품 결제 금액</StyledOrderPriceTitle>
                    <StyledOrderPriceInfo>{priceForm(count * (deliveryFee + goodsTotal) - point - vpoint)}</StyledOrderPriceInfo>
                </StyledOrderTotal>
            </StyledOrderDetail>                        
            </>
        )
    }, [count, deliveryFee, point, vpoint, vpointAble])

    const countGear = useMemo(() => {
        return (
            <StyledOrderCnt>
                <StyledOrderCntTitle>주문 수량</StyledOrderCntTitle>
                <StyledOrderCntUpdown>
                    <StyledOptionCountBtn>
                        <AiFillMinusSquare size="1.3em" onClick = {() => {setCount((count-1>=1)?count-1:1)}}/>
                    </StyledOptionCountBtn>
                    <StyledOptionCountNumber>
                        {count}
                    </StyledOptionCountNumber>
                    <StyledOptionCountBtn onClick = {() => {setCount(count + 1)}}>
                        <AiFillPlusSquare size="1.3em"/>
                    </StyledOptionCountBtn>
                </StyledOrderCntUpdown>
            </StyledOrderCnt>            
        )
    }, [count])

    const termGear = useMemo(() => {
        const textContent = `
필수 개인정보 제공 동의
\n
올딜 회원 계정으로 올딜에서 제공하는 상품 및 서비스를 구매하고자 할 경우, 
메이저월드(주)는 거래 당사자간 원활한 의사소통 및 배송, 
상담 등 거래이행을 위하여 필요한 최소한의 개인정보를 아래와 같이 제공하고 있습니다.
\n
1. 개인정보를 제공받는 자: ${order.set.goods.seller}
2. 제공하는 개인정보 항목 : 이름, (휴대)전화번호, 상품 구매정보, 상품 수령인 정보 (수령인명, 주소, (휴대)전화번호)
3. 개인정보를 제공받는 자의 이용목적 : 판매자와 구매자의 원활한 거래 진행, 본인의사의 확인, 고객상담 및 불만처리/부정이용 방지 등의 고객관리, 물품배송, 새로운 상품/ 
서비스 정보와 고지사항의 안내, 상품/서비르 구매에 따른 혜택 제공
4. 개인정보를 제공받는 자의 개인정보 보유 및 이용기간 : 개인정보 이용목적 달성 시까지 보존합니다. 
단, 관계법령의 규정에 의하여 일정 기간 보존이 필요한 경우에는  해당 기간만큼 보관 후 삭제합니다.
\n
위 개인정보 제공 동의를 거부할 권리가 있으나, 거부 시 올딜을 이용한 상품구매가 불가능합니다. 그 밖의 내용은 올딜 가맹점의 자체 이용약관 및 개인정보처리방침에 따릅니다.
        `;
        return(
            <StyledSection>
                <StyledTermTitle>개인정보 제공 동의</StyledTermTitle>
                <StyledTermBtn onClick={() => setTermOpen(!termOpen)}>{termOpen ? '닫기' : '상세보기'}</StyledTermBtn>
                <StyledTermContent open={termOpen}>
                    {textContent}
                </StyledTermContent>
            </StyledSection>
        )
    })

    const submitGear = useMemo(() => {
        return(
            <StyledBuy>
                <StyledBuySubmit onClick={orderExec}>
                    {priceForm(count * (deliveryFee + (order.set.goods.goodsPrice + order.set.option.addPrice)) - point - vpoint)} 결제하기
                </StyledBuySubmit>
            </StyledBuy>                   
        )
    }, [count, deliveryFee, defaultDelivery, defaultCard, point, vpoint])

    const modalGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "70%", 
                    height : "8em", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "1em", 
                    buttonName : ["마이페이지","쇼핑 계속하기"]
                }} 
                type={2}
                noClose={true}
                proEvent = {() => {
                    navigate('/MyPage', {replace : true });
                    return true;
                }}
                consEvent = {() => {
                    navigate('/', {replace : true });
                    return true;
                }}
                data={{desc : msgData['orderConfirm']}}
                state={orderConfirm} 
                closeEvent={() => setOrderConfirm(false)}
            />
        )        
    }, [orderConfirm]);

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
                data={{desc : msgData[orderAlert]}}
                state={orderAlert} 
                closeEvent={() => {
                    setOrderAlert(false);
                    return true;    
                }}
            />     
        )        
    }, [orderAlert]);

    //render
    return(
        <>
        {loading ? <CustomLoading opacity={0.5}/> : null}
        <SimpleMotion>
        <StyledOrder>
            <Title text="주문/결제"/>
            <StyledContent className={window.self != window.top ? 'iframeScroll' : null}>
                {addrGear}
                {paymentGear}
                <StyledOrderSection>
                    {orderGear}
                    {priceGear}
                    {countGear}
                </StyledOrderSection>
                {termGear}
                <StyledFooter>
                    주문 내용을 확인하였으며, 정보 제공 등에 동의합니다.
                </StyledFooter>
            </StyledContent>
        </StyledOrder>
        </SimpleMotion>
        {submitGear}   
        {modalGear}
        {alertGear}
        </>
    )
}

export default Order;