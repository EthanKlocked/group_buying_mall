//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { BsGear } from "react-icons/bs";
import { IoIosArrowForward, IoIosHeartEmpty, IoMdClose } from "react-icons/io";
import { RiCustomerService2Line, RiPhoneFindLine, RiQuestionMark, RiTeamLine, RiUserReceived2Line } from "react-icons/ri";
import { MdOutlineLocalShipping, MdOutlineRateReview } from "react-icons/md";
import { FiPackage } from "react-icons/fi";
import { apiCall, touchSlide, priceForm } from "lib";
import { Modal, GoodsSwiper, SimpleMotion, QuestionIcon, PointInfo, InviteGuest } from "component";
import { BaseContext, SelfContext } from "context";
import { msgData } from "static";
import { BiConversation } from "react-icons/bi";

//------------------------------ COMPONENT ----------------------------------
const MyPage = React.memo(() => {
    //init
    const navigate = useNavigate();

    //context
    const { base } = useContext(BaseContext);
    const { setSelfHandler } = useContext(SelfContext);

    //state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [orderState, setOrderState] = useState(null);
    const [logoutConfirm, setLogoutConfirm] = useState(false);
    
    //function
    const initData = async() => {
        try {
            setError(null);
            setLoading(true);
            setData(null);
            let params;

            //goods
            const browse = JSON.parse(sessionStorage.getItem('browse'));
            let goodsResult = {data:[]};
            if(browse && browse[0]){
                params = { dataArr : browse };
                goodsResult = await apiCall.get("/goods/any/getArrayOrdered", {params});                
            }

            //self
            const selfResult = await apiCall.get(`/self/self`);
            setData({'goods' : goodsResult.data, 'self' : selfResult.data});
            setSelfHandler(selfResult.data); //----SELF CONTEXT SET----//

            //order
            params = { 'self' : true, 'colArr' : ['state','teamId'] };
            const orderResult = await apiCall.get(`/order`, {params});
            if(orderResult.data.result == 'success'){
                const orderState = {};
                for(let i of orderResult.data.data){
                    if(!orderState.hasOwnProperty(i.state)) orderState[i.state] = 0;
                    orderState[i.state]++;
                }
                setOrderState(orderState);
            }
        }catch(e){
            setError(e);
        }
        setLoading(false);
    }    

    const logout = useCallback(() => {
        localStorage.clear();
        setSelfHandler(null); //----SELF CONTEXT DELETE----//
        navigate('/Login', { replace : true });
    }, []);

    const profileUpdate = useCallback(() => {
        navigate('/MyPage/ProfileUpdate');
    }, [data]);

    const addressUpdate = useCallback(() => {
        navigate('/MyPage/AddressUpdate');
    }, [data]);

    const paymentUpdate = useCallback(() => {
        navigate('/MyPage/PaymentUpdate');
    }, [data]);    

    const settings = useCallback(() => {
        navigate('/MyPage/Settings');
    }, [data]);        

    //effect
    useEffect(() => {
        initData();
    }, []);

    useEffect(() => {
        if(data && orderState) touchSlide('mypageTouch', 'y');
    }, [data, orderState]);    

    //memo
    const profileGear = useMemo(() => {
        return !data ? null :(
            <StyledProfile>
                <StyledProfile1>
                    <StyledProfileImageBox>
                        <StyledProfileImage src={data.self.img} />
                    </StyledProfileImageBox>
                    <StyledProfileInfo>
                        <StyledProfileName>
                        {data.self.name}
                        </StyledProfileName>
                        {
                            data.self.point > 0 ? (
                                <StyledProfilePoint>
                                    Point <StyledProfilePointNumber>{priceForm(data.self.point, true)}</StyledProfilePointNumber>원&nbsp;&nbsp;<QuestionIcon style={{position:'absolute', top:"-5px"}} content={<PointInfo />}/>
                                </StyledProfilePoint>                            
                            ) : null
                        }
                    </StyledProfileInfo>
                    <StyledProfileText onClick={profileUpdate}>프로필 수정<IoIosArrowForward /></StyledProfileText>
                </StyledProfile1>
                <StyledProfile2>
                    <StyledProfileButton onClick={addressUpdate}>배송지 관리</StyledProfileButton>
                    <StyledProfileButton onClick={paymentUpdate}>결제 수단</StyledProfileButton>
                </StyledProfile2>
            </StyledProfile>
        )
    }, [data]);

    const inviteGear = useMemo(() => {
        if(!data) return;
        return (
            <StyledInvite>
                <InviteGuest id={data.self?.id}/>
            </StyledInvite>
        )
    }, [data]);

    const goodsGear = useMemo(() => {
        return !data ? null :(
            <StyledGoods>
                <StyledGoodsTitle>내가 조회한 상품</StyledGoodsTitle>
                {
                    data.goods.length ? (
                        <StyledGoodsSlide>
                            <GoodsSwiper goodsBox={data.goods}/>
                        </StyledGoodsSlide>
                    ) : (
                        <StyledZeroBrowse>
                            상품 조회 기록이 없습니다.
                        </StyledZeroBrowse>
                    )
                }
            </StyledGoods>            
        )
    }, [data])

    const orderGear = useMemo(() => {
        return !orderState ? null : (
            <StyledOrder>
                <StyledOrderTitle>내 주문 현황</StyledOrderTitle>
                <StyledOrderProcess onClick={() => navigate('/MyPage/OrderInfo', { state: { orderState: 2 } })}>
                    <StyledOrderIcon>
                        { !orderState[2] ? null : <StyledOrderCnt>{orderState[2]}</StyledOrderCnt> }
                        <RiTeamLine/>
                    </StyledOrderIcon>
                    <StyledOrderText>팀모집중</StyledOrderText>                        
                </StyledOrderProcess>
                <StyledOrderProcess onClick={() => navigate('/MyPage/OrderInfo', { state: { orderState: 3 } })}>
                    <StyledOrderIcon>
                        { !orderState[3] && !orderState[11] && !orderState[12] && !orderState[41]  
                            ? null 
                            : <StyledOrderCnt>
                                {(orderState[3] || 0) + (orderState[11] || 0) + (orderState[12] || 0) + (orderState[41] || 0)}
                            </StyledOrderCnt> }
                        <FiPackage/>
                    </StyledOrderIcon>
                    <StyledOrderText>상품준비중</StyledOrderText>
                </StyledOrderProcess>
                <StyledOrderProcess onClick={() => navigate('/MyPage/OrderInfo', { state: { orderState: 13 } })}>
                    <StyledOrderIcon>
                        { !orderState[13] ? null : <StyledOrderCnt>{orderState[13]}</StyledOrderCnt> }
                        <MdOutlineLocalShipping/>
                    </StyledOrderIcon>
                    <StyledOrderText>배송중</StyledOrderText>
                </StyledOrderProcess>
                <StyledOrderProcess onClick={() => navigate('/MyPage/OrderInfo', { state: { orderState: 14 } })}>
                    <StyledOrderIcon>
                        { !orderState[14] ? null : <StyledOrderCnt highlight="none">{orderState[14]}</StyledOrderCnt> }
                        <RiUserReceived2Line/>
                    </StyledOrderIcon>                        
                    <StyledOrderText>배송완료</StyledOrderText>                        
                </StyledOrderProcess>
                <StyledOrderProcess onClick={() => navigate('/MyPage/CancelList')}>
                    <StyledOrderIcon>
                        { 
                            !orderState[21] && //교환신청
                            !orderState[22] && //교환접수
                            !orderState[23] && //교환회수단계
                            !orderState[26] && //교환보류
                            !orderState[27] && //교환발송단계
                            !orderState[29] && //교환완료
                            !orderState[31] && //반품신청
                            !orderState[32] && //반품접수
                            !orderState[33] && //반품회수단계
                            !orderState[36] && //반품보류
                            !orderState[37] && //반품완료
                            !orderState[42] //취소완료
                            ?  
                            null 
                            : <StyledOrderCnt highlight="none">
                                {
                                    Number(orderState[21] || 0)
                                    +Number(orderState[22] || 0)
                                    +Number(orderState[23] || 0)
                                    +Number(orderState[26] || 0)
                                    +Number(orderState[27] || 0)
                                    +Number(orderState[29] || 0)
                                    +Number(orderState[31] || 0)
                                    +Number(orderState[32] || 0)
                                    +Number(orderState[33] || 0)
                                    +Number(orderState[36] || 0)
                                    +Number(orderState[37] || 0)
                                    +Number(orderState[42] || 0)
                                }
                            </StyledOrderCnt> 
                        }
                        <BiConversation/>
                    </StyledOrderIcon>                        
                    <StyledOrderText>취소/교환/환불</StyledOrderText>                        
                </StyledOrderProcess>
            </StyledOrder>
        )
    }, [orderState]);

    //render
    if(!data || !orderState) return <StyledSimpleLoading />
    return (
        <>
        <SimpleMotion>
        <StyledContainer id="mypageTouch">
            <StyledHeader>
                <StyledHeaderName>내 정보</StyledHeaderName>
                <StyledHeaderIcon><BsGear onClick={settings}/></StyledHeaderIcon>
            </StyledHeader>
            <StyledContent>
                {profileGear}
                {inviteGear}
                {orderGear}
                {goodsGear}
                <StyledEtc>
                    <StyledEtcArea onClick={() => navigate('/MyPage/CustomerService')}>
                        <StyledEtcIcon><RiCustomerService2Line /></StyledEtcIcon>
                        <StyledEtcText>고객 센터 (평일 10:00 ~ 17:00)</StyledEtcText>
                    </StyledEtcArea>
                    <StyledEtcArea onClick={() => navigate('/MyPage/MyReview')}>
                        <StyledEtcIcon><MdOutlineRateReview /></StyledEtcIcon>
                        <StyledEtcText>구매 후기</StyledEtcText>
                    </StyledEtcArea>
                    <StyledEtcArea onClick={() => navigate('/MyPage/MyCatch')}>
                        <StyledEtcIcon><RiPhoneFindLine /></StyledEtcIcon>
                        <StyledEtcText>조회 내역</StyledEtcText>
                    </StyledEtcArea>
                    <StyledEtcArea onClick={() => navigate('/MyPage/MyQa', { state: { memberId: data.self.id } })}>
                        <StyledEtcIcon><RiQuestionMark /></StyledEtcIcon>
                        <StyledEtcText>문의 내역</StyledEtcText>
                    </StyledEtcArea>
                    <StyledEtcArea onClick={() => navigate('/MyPage/MyWish')}>
                        <StyledEtcIcon><IoIosHeartEmpty /></StyledEtcIcon>
                        <StyledEtcText>찜한 상품</StyledEtcText>
                    </StyledEtcArea>
                    <StyledEtcArea onClick = {() => setLogoutConfirm(true)}>
                        <StyledEtcIcon><IoMdClose /></StyledEtcIcon>
                        <StyledEtcText>로그아웃</StyledEtcText>
                    </StyledEtcArea>                    
                </StyledEtc>
            </StyledContent>
            <StyledFooter>
                법인명 : {base.companyName} <br/>
                대표자 : {base.companyOwner} <br/>
                사업자 등록번호 : {base.saupjaNo} <br/>
                통신판매업 신고번호 : {base.tolsinNo} <br/>
                주소 : {base.companyAddr} <br/>
                이메일 : {base.companyEmail} <br/>
                Copyright©{base.shopId} Corp.All right reserved.<br />
                <br />
                <br />
                <br />
            </StyledFooter>
        </StyledContainer>
        </SimpleMotion>
        <Modal 
            option={{
                width : "70%", 
                height : "8em", 
                textAlign : "center",
                alignContent : "center",  
                fontSize : "1em", 
                buttonName : ["확인","취소"]
            }} 
            type={2}
            proEvent = {() => {
                logout();
                return true;
            }}
            data={{desc : msgData['logoutConfirm']}}
            state={logoutConfirm} 
            closeEvent={() => setLogoutConfirm(false)}
        />
        </>
    );    
});

export default MyPage;

//------------------------------ CSS ----------------------------------------
const StyledContainer = styled.div`
    background:#eee;
    overflow-y:auto;
    height:100%;
    &::-webkit-scrollbar {
        display: none;
    }
`;
const StyledHeader = styled.div`
    display:grid;
    grid-template-columns: repeat(2, 1fr);
    align-content:center;
    background:white;
    height:3.5em;
    border-bottom:0.1em solid #eee;
    position:fixed;
    z-index:3;
    width:100%;
`;
const StyledHeaderName = styled.div`
    display:grid;
    justify-self:start;
    align-content:center;
    font-size:1.2em;
    margin:5%;
`;
const StyledHeaderIcon = styled.div`
    display:grid;
    justify-self:end;
    align-content:center;
    font-size:1.2em;
    margin:5%;
    cursor:pointer;
`;
const StyledContent = styled.div`
    background:white;
    margin-top:3.5em;
`;
const StyledProfile = styled.div`
    background:white;
    border-bottom:solid 5px #eee;    
`;
const StyledProfile1 = styled.div`
    display:grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: repeat(2, 1fr);
    padding:2% 5%;
`;
const StyledProfileImageBox = styled.span`
    display:inline-block;
    width:5em;
    height:5em;
    margin:auto;
    overflow:hidden;
    border-radius:50%;
    background:white;
    grid-row: 1 / span 2;
    border: solid 0.5px #ddd;
`;
const StyledProfileImage = styled.img`
    width:100%;
    height:100%;
    object-fit: cover;
`;
const StyledProfileInfo = styled.div`
    display:grid;
    align-content:end;
    grid-template-columns: 1fr 1fr;
    justify-content:start;
    background:white;
    padding:2% 5%;
    font-weight:bold;
`;
const StyledProfileName = styled.span`
    text-align:start;
    font-size:0.8em;
`;
const StyledProfilePoint = styled.span`
    text-align:right;
    font-weight:500;
    font-size:0.8em;
    position:relative;
`;
const StyledProfilePointNumber = styled.span`
    color:crimson;
    font-weight:bold;
    font-size:1em;
`;
const StyledProfileText = styled.div`
    display:grid;
    align-items:center;
    justify-items:start;
    align-content:start;
    justify-content:start;
    background:white;
    padding:2% 5%;
    font-size:0.8em;
    color:#555;
    grid-template-columns:auto 1fr;
    cursor:pointer;
`;
const StyledProfile2 = styled.div`
    display:grid;
    background:white;
    grid-template-columns:repeat(2, 1fr);
    margin:0 6%;
`;
const StyledProfileButton = styled.div`
    display:grid;
    align-content:center;
    justify-self:center;
    border:solid 1px #555;
    margin:5%;
    width:80%;
    padding:3%;
    font-size:0.8em;
    color:#555;
    border-radius:5px;
    StyledHeaderIcon;
    cursor:pointer;
`;
const StyledOrder = styled.div`
    display:grid;
    grid-template-rows: 2fr 4fr;
    grid-template-columns: repeat(5, 1fr);
    background:white;
`;
const StyledOrderTitle = styled.div`
    display:grid;
    grid-column: 1 / span 5;
    background:white;
    justify-content:start;
    align-content:end;
    padding:3%;
    font-size:0.8em;
    font-weight:bold;
`;
const StyledOrderProcess = styled.div`
    display:grid;
    background:white;
    jusrift-content:center;
    align-content:center;
    justify-items:center;
    padding:0 5% 20% 5%;
    color:#777;
    cursor:pointer;
`;
const StyledOrderIcon = styled.div`
    position:relative;
    background:white;
    font-size:1.8em;
`;
const StyledOrderCnt = styled.div`
    position: absolute;
    width: 1.9em;
    height: 1.9em;
    color: white;
    font-size: 0.3em;
    background: ${(props) => props.highlight && props.highlight=="none" ? "black" : "red"};
    border-radius: 50%;
    right: -0.6em;
    line-height:2em;
`;
const StyledOrderText = styled.div`
    background:white;
    font-size:0.8em;
`;
const StyledGoods = styled.div`
    border-bottom:solid 5px #eee;    
`;
const StyledZeroBrowse = styled.div`
    margin:5% 3%;
    font-size:0.8em;
    color:#777;
`
const StyledGoodsTitle = styled.div`
    text-align:left;
    //padding:8% 5% 2% 3%;
    padding:3% 5% 2% 3%;
    font-size:0.8em;
    font-weight:bold;
`;
const StyledGoodsSlide = styled.div`
    display:grid;   
`;
const StyledEtc = styled.div`
    background:white;
    border-bottom:solid 5px #eee;    
`;
const StyledEtcArea = styled.div`
    display:grid;   
    grid-template-columns: auto 1fr;
    padding:3%;
    cursor:pointer;
`;
const StyledEtcIcon = styled.div`
    display:grid;
    align-content:center;
    color:#777;
    font-size:1.5em;
`;
const StyledEtcText = styled.div`
    display:grid;
    font-size:0.8em;
    color:#888;
    background:white;
    justify-content:start;
    align-content:center;
    padding:0 2%;
`;
const StyledFooter = styled.div`
    background:#eee;
    text-align:start;
    font-size:0.8em;
    color:#aaa;
    padding:3% 2%;
    line-height:150%;
`;
const StyledSimpleLoading = styled.div`
    height:100%;
    width:100%;
    position:fixed;
    background:white;
`;
const StyledInvite = styled.div`
    padding:5% 3%;
`;