//------------------------------ MODULE -------------------------------------
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import React, { useState, useEffect, useMemo, useContext } from "react";
import styled from "styled-components";
import { ModalSwiper, ImgSwiper, Modal, AutoTimer, ReviewListGoods, SellerGoodsList, KakaoShare, SimpleMotion } from "component";
import { apiCall, priceForm, stripslashes, strToDate, kakaoShare, touchSlide } from "lib";
import { IoIosArrowForward, IoIosArrowBack, IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { AiFillPlusSquare, AiFillMinusSquare } from "react-icons/ai";
import { OrderContext, SelfContext } from "context";
import { guideData, msgData } from "static";
import descriptionLoading from 'data/img/descriptionLoading.png';
import linkIcon from 'data/img/linkIcon.png';
import ReactGA4 from 'react-ga4';

//------------------------------ CSS ----------------------------------------
const StyledDescription = styled.div`
    width:100%;
    height:100%;
    overflow-y:auto;
    &::-webkit-scrollbar {
        display: none;
    }
    img{
        width:100%;
    }
`;
const StyledHeader = styled.div`
    display:grid;
    z-index: 2;
    position: fixed;
    width:100%;
    grid-template-columns: auto auto;
`;
const StyledBack = styled(IoIosArrowBack)`
    border-radius:50%;
    padding:2%;
    background:white;
    margin:0.8em;
    color:#aaa;
    cursor:pointer;
`;
const StyledContainer = styled.div`
    background:white;
    height:100%;
`;
const StyledBanner = styled.div`
    display:grid;
    width:100%;
`;
const StyledBannerLoading = styled.div`
    background:white;
    width:100%;
    padding-bottom:101%;

    background-repeat: no-repeat;

    background-image:
        linear-gradient( 90deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0) 90% ), /* animation */
        linear-gradient( #eee 100%, transparent 0 );

    background-size:
        50% 100%,
        100% 100%;

    background-position:
        -50% 0,
        0 0;

    animation: shineM 1s infinite;

    @keyframes shineM {
        to {
            background-position: 
                150% 0,
                0 0;
        }
    }    
`;
const StyledInfo = styled.div`
    display:grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-items:start;
    padding:0 5%;
    margin-top:3%;
    border-bottom:solid 10px #eee;
`;
const StyledPercent = styled.div`
    display:grid;
    font-size:0.8em;
    font-weight:bold;
`;
const StyledTagPrice = styled.div`
    display:grid;
    font-size:0.8em;
    color:#aaa;
    text-decoration:line-through;
    grid-column: 2 / span 3;
`;
const StyledPrice = styled.div`
    display:grid;
    color:crimson;
    grid-column: 1 / span 4;
`;
const StyledName = styled.div`
    display:grid;
    text-align:left;
    grid-column: 1 / span 4;
    justify-content:start;
    padding: 2% 0;
    width:100%;
    border-bottom:solid 1px #aaa;
`;
const StyledDelivery1 = styled.div`
    display:grid;
    font-size:0.8em;
    grid-column: 1 / span 4;
    justify-content:start;
    padding: 2% 2%;
    width:96%;
    border-bottom:solid 1px #aaa;
`;
const StyledDelivery2 = styled.div`
    display:grid;
    padding: 2% 2%;
    font-size:0.8em;
    grid-column: 1 / span 4;    
`;
const StyledTeamInfo = styled.div`
    display:grid;
    grid-column: 1 / span 4;
    color:red;
    font-size:0.9em;
    font-weight:550;
    grid-template-columns: auto 1fr;
    align-items:center;
    justify-items:start;
    padding: 3% 2%;
    width:96%;
    cursor:pointer;
`;
const StyledPartyList = styled.div`
    width:90%;
    border-top: solid 0.1em #eee;
    margin:auto;
    height:3.7em;
    position:relative;
    span{
        display:inline-block;
        vertical-align:middle;
    }
`;
const StyledPartyListImg = styled.span`
    position:absolute;
    left:${(props) => props.seq * 1.2}em;
    top:0.5em;
    display:inline-block;
    overflow:hidden;
    width:2.5em;
    height:2.5em;
    border-radius:50%;
    border:solid 0.1em white;
    img{
        width:100%;
        height:100%;
        object-fit: cover;        
    }
`;
const StyledPartyListName = styled.span`
    position:absolute;
    line-height:4.5em;
    left:7.5em;
    font-size:0.8em;
`;
const StyledPartyListInfo = styled.span`
    display:inline-block;
    position:absolute;
    width:5.5em;
    right:7em;
    font-size:0.8em;
    top:0.8em;
    .partyCnt{
        color:crimson;
        padding-right:0.5em;
    }
    #autoTimer span{
        color:#aaa;
        font-weight:500;
    }
    .autoTimerM{
        padding-left:0.2em;
    }
    .autoTimerS{
        padding-left:0.2em;
    }
`;
const StyledPartyFinished = styled.span`
    position:absolute;
    color:#ccc;
    line-height:3.5em;
    right:0;
`;
const StyledPartyListButton = styled.span`
    background:green;
    position:absolute;
    right:0;
    top:1.1em;
    width:6em;
    line-height:2.5em;
    background:crimson;
    color:white;
    border-radius:5px;
    font-size:0.8em;
    cursor:pointer;
`;
const StyledTeam = styled.div`
    display:grid;
    border-bottom:solid 10px #eee;
`;
const StyledReview = styled.div`
    border-bottom:solid 10px #eee;
`;
const StyledParty = styled.div`
    display:grid;
    border-bottom:solid 10px #eee;
`;
const StyledSeller = styled.div`
    display:grid;
    border-bottom:solid 10px #eee;
`;
const StyledSectionTitle = styled.div`
    text-align:left;
    font-size:0.9em;
    font-weight:550;
    padding:5%;
    padding-bottom:2%;
`;
const StyledSectionContent = styled.div`
    padding: 2% 5%;
`;

const StyledDetail = styled.div`
    width:100%;
`;
const StyledDetailContainer = styled.div`
    height:40em;
    overflow-y:hidden;
    position:relative;
`;
const StyledNoneHtml = styled.div`
    display:grid;
    width:100%;
    font-size:0.8em;
    color:#aaa;
    height:10em;
    align-content:center;
    border-bottom:solid 1px #ddd;
`;
const StyledHtml = styled.div`
    width:100%;
`;
const StyledDetailLinkBox = styled.div`
    display:grid;
    background-color: rgba(255, 255, 255, 0.5);
    position:absolute;
    bottom:0em;
    height:3.5em;
    width:100%;
`;
const StyledDetailLink = styled.div`
    display:grid;
    align-items:center;
    background:white;
    color:crimson;
    font-size:0.8em;
    border:solid 1px crimson;
    margin:2%;
    border-radius:5px;
    cursor:pointer;
`;
const StyledLink = styled.div`
    display:grid;
    text-align:left;
    padding:3% 5%;
    grid-template-columns:95% 5%;
    font-weight:550;
    font-size:0.9em;
    align-items:center;
    border-bottom:solid 1px #ddd;
    cursor:pointer;
`;
const StyledEmpty = styled.div`
    display:grid;
    height:3.5em;
`;
const StyledButton = styled.div`
    display:grid;
    border-radius:8px;
    color:white;
    font-size:0.8em;
    background: crimson;
    margin:3% 7%;
    justify-content:center;
    align-content:center;
    cursor:pointer;
`;
const StyledBuy = styled.div`
    display:grid;
    grid-template-columns:${(props) => props.joinState ? '3% 95%' : '10% 40% 40%' };
    width:100%;
    height:3em;
    bottom:0;
    position:fixed;
    background:white;
    border-top:solid 1px #aaa;
    justify-content:center;
    padding:1%;
`;
const StyledBuyJoinButton = styled.div`
    position:relative;
    border-radius:8px;
    color:white;
    font-size:0.8em;
    background: ${(props) => props.joinExp ? "#ccc" : "crimson"};
    margin:1% 7%;
    cursor:pointer;
`;
const StyledBuyImgBox = styled.span`
    display:inline-block;
    position:absolute;
    left:1em;
    top:0.6em;
    width:2em !important;
    height:2em !important;
    border-radius:50%;
    overflow:hidden;
`;
const StyledBuyImg = styled.img`
    width:100%;
    height:100%;
    border-radius:50%;
    object-fit: cover;  
`;
const StyledBuyText = styled.span`
    position:absolute;
    left:4.5em;
    top:0.3em;
    font-size:1em;
    font-weight:500;
`;
const StyledBuyTime = styled.span`
    position:absolute;
    left:4.5em;
    top:1.5em;
    font-size:1em;
    font-weight:500;
`;
const StyledWish = styled.div`
    display:grid;
    align-content:center;
    svg{
        color:crimson;
        font-size:2em;
        cursor:pointer;
    }
`;
const StyledMaxQty = styled.span`
    font-size:0.8em;
    font-weight:bold;
    color:#0F9D58;
    margin-left:1.5em;
`;
const StyledOption = styled.div`
    display:grid;
`;
const StyledOptionPrice = styled.div`
    font-weight:bold;
    color:crimson;
    text-align:start;
    font-size:1.3em;
`;
const StyledOptionContent = styled.div`
    display:grid;
    width:100%;
    align-content:center;
    border-bottom:1px solid #ccc;
    padding:0.5em 0;
`;
const StyledOptionTitle = styled.div`
    text-align:start;
    font-size:1.05;
`;
const StyledOptionSubtitle = styled.span`
    text-align:start;
    font-size:0.8em;
    color:crimson;
    margin-left:1em;
    margin-bottom:0.3em;
    display: ${(props) => props.optChk=="isNot" ? "inline" : "none"};
`;
const StyledOptionList = styled.div`
    text-align:start;
    word-break:break-all;
    overflow:auto;
    height:7em;
    display:block;
`;
const StyledOptionEach = styled.span`
    display:block;
    padding:0.5em 1.5em;
    line-height:1.4em;
    font-size:1em;
    margin:0.8em 0;
    border-radius:0.5em;
    cursor:pointer;
    ${(props) => 
        props.selected ? 
        `
            background: crimson;
            color:white;    
        ` : 
        (
            props.qtyCheck ? 
            `
            background: #eee;
            color:black;        
            ` 
            : 
            `
            background: #eee;
            color:#bbb;        
            ` 
        )
    }
`;
const StyledOptionCount = styled.div`
    display:grid;
    grid-template-columns:5fr 3fr;
    width:100%;
    justify-items:start;
    align-items:center;
    line-height:2em;  
`;
const StyledOptionCountBtn = styled.span`
    margin: 0 0.5em;
    color:#555;
    font-size:1.3em;
    cursor:pointer;
    svg{
        vertical-align:middle;
    }
`;
const StyledOptionCountNumber = styled.span`
    display:inline-block;
    width:1em;
    font-size:1.2em;
`;
const StyledReviewLinkBox = styled.div`
    display:grid;
    background-color: rgba(255, 255, 255, 0.5);
    height:3.5em;
    width:100%;
`;
const StyledReviewLink = styled.span`
    background:white;
    color:crimson;
    font-size:0.8em;
    border:solid 1px crimson;
    margin:2%;
    border-radius:5px;
    line-height:3em;
    svg{
        font-size:1.5em;
        vertical-align:middle;
    }
`;

//------------------------------ COMPONENT ----------------------------------
const Description = React.memo(({id, closeEvent}) => {
    //context
    const { setOrderHandler } = useContext(OrderContext);
    const { setSelfHandler } = useContext(SelfContext);

    //init
    const { state } = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams]=useSearchParams();
    const nowId = searchParams.get('id');
    const nowJoin = searchParams.get('joinInfo');

    //state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [teamData, setTeamData] = useState(null);
    const [selfTeamData, setSelfTeamData] = useState(false);
    const [imgBox, setImgBox] = useState([]);
    const [teamInfo, setTeamInfo] = useState(false);
    const [optionWindow, setOptionWindow] = useState(false);
    const [selectedOpt, setSelectedOpt] = useState(null);
    const [count, setCount] = useState(1);
    const [wish, setWish] = useState(false);
    const [joinInfo, setJoinInfo] = useState(null);
    const [loginAlert, setLoginAlert] = useState(false);
    const [descAlert, setDescAlert] = useState(false);
    const [joinTarget, setJoinTarget] = useState(null);
    const [htmlWindow, setHtmlWindow] = useState(null);
    const [reviewCnt, setReviewCnt] = useState(null);
    const [iframeAlert, setIframeAlert] = useState(false);

    //function
    const initData = async() => {
        //parameter check
        const thisId = nowId ? nowId : state.id;
        const thisJoin = nowJoin ? nowJoin : (state && state.hasOwnProperty('joinInfo') ? state.joinInfo : null);

        try {
            setError(null);
            setLoading(true);
            setData(null);

            //call info
            let params = { customerView : true }
            const result = await apiCall.get(`/goods/${thisId}`, {params});
            setData(result.data);
            setWish(result.data.wish);
            if(result.data.goods.stockQty < 1){ //stock check
                if(!alert(msgData['soldOut'])) return navigate('/', {replace : true });
            }

            //image
            const imgArr = [];
            for(let i=1; i <=5; i++) if(result.data.goods[`simg${i}`]) imgArr.push(`${process.env.REACT_APP_SERVER_URL}${result.data.goods[`simg${i}`]}`);
            setImgBox(imgArr);

            //teams
            params = { goodsId : thisId, activateChk: true, teamStatus:['set', 'go'] };
            const teamResult = await apiCall.get("/team", {params});
            setTeamData(teamResult.data.public);

            //set a target team
            if(thisJoin) setJoinTarget(teamResult.data.public.filter(obj=>obj.team.teamId==thisJoin)[0]);
            
            //set private teams
            setSelfTeamData(teamResult.data.private);

            //selfTargetChk (from kakao share)
            const targetObj = teamResult.data.private.filter(obj=>obj.team.teamId==thisJoin)[0];
            const selfChk = await apiCall.get(`/self/self`);
            if(targetObj && selfChk.data.id == targetObj.team.teamHost) {
                if(!alert(msgData['selfJoinError'])) return navigate('/', {replace : true });
            }

        }catch(e){
            setError(e);
        }
        setLoading(false);
    }    
    const moveBack = () => {
        navigate(-1);
    }
    const optionWindowOpen = (j=null) => {
        //if(window.self != window.top/*IFRAME CHK*/) return setIframeAlert({desc:"상품은 모바일 기기를 통해 alldeal.kr로 접속하신 뒤 구매하실 수 있습니다.", title:"모바일을 통해 접속 해 주세요!"});        
        if(j && strToDate(j.team.teamTime)<new Date()) return setDescAlert('teamExpired');
        setJoinInfo(j);
        setOptionWindow(true);
    };

    const orderExec = () => {
        try {
            apiCall.get(`/self/self`)
            .then((res) => {
                if(selectedOpt == null) {
                    setSelectedOpt('isNot');
                    return false;
                }
                if(selectedOpt == 'isNot') return false;

                const orderObj = {
                    goods : data.goods,
                    option : data.options[selectedOpt],
                    count : count,
                    join : joinInfo,
                }

                if(res.data === null){
                    setOrderHandler({ready : orderObj, set : null}); //----ORDER CONTEXT READY----//
                    return setLoginAlert(true);
                }
                setOrderHandler({ready : null, set : orderObj}); //----ORDER CONTEXT SET----//
                setSelfHandler(res.data); //----SELF CONTEXT SET----//
                navigate('/Order');
            })            
        }catch(e){
            console.log(e);
        }
    }

    const wishChk = async() => {
        try{
            const selfChk = await apiCall.get(`/self/self`);
            if(selfChk.data === null){
                return setLoginAlert(true);
            }
            const result = await apiCall.get(`/goods/${data.goods.goodsId}/wishChk`);                    
            setWish(result.data);
        }catch(e){
            console.log(e);
        }
    }

    const disableButton = (id) => document.getElementById(id).style.background = "#ccc";

    const sendShare = (joinId = null) => {
        if(!data) return;
        //set
        const sendObj = {
            objectType: 'commerce',
            content: {
                title: joinId ? '올딜에서 팀 참여 요청이 왔어요!' : '올딜에서 팀을 모집 해 보세요!',
                imageUrl: `${process.env.REACT_APP_SERVER_URL}/${data.goods.simg1}`,
                link: {
                    mobileWebUrl: `${process.env.REACT_APP_HOST}/Description?id=${data.goods.goodsId}`,
                    webUrl: `${process.env.REACT_APP_HOST}/Description?id=${data.goods.goodsId}`,
                },
            },
            commerce: {
                productName: data.goods.goodsName,
                regularPrice: data.goods.consumerPrice,
                discountRate: Math.round(100-data.goods.goodsPrice/data.goods.consumerPrice*100),
                discountPrice: data.goods.goodsPrice,
            },
            buttons: [
                {
                    title: '구매하기',
                    link: {
                        mobileWebUrl: `${process.env.REACT_APP_HOST}/Description?id=${data.goods.goodsId}${joinId ? `&joinInfo=${joinId}` : ``}`,
                        webUrl: `${process.env.REACT_APP_HOST}/Description?id=${data.goods.goodsId}${joinId ? `&joinInfo=${joinId}` : ``}`,
                    },
                }
            ],
        };

        //exec
        kakaoShare(sendObj);
    }

    //effect
    useEffect(() => {
        initData();
        setTimeout(() => {
            //parameter check
            const thisId = nowId ? nowId : state.id;

            const browse = sessionStorage.getItem('browse') ? JSON.parse(sessionStorage.getItem('browse')) : [];
            const duplicateChk = browse.indexOf(thisId);
            if(duplicateChk != -1) browse.splice(duplicateChk, 1);
            browse.length = 19;
            browse.unshift(thisId);
            sessionStorage.setItem('browse', JSON.stringify(browse));                        
        });
    }, [state]);

    useEffect(() => { //for kakao share api
        //touchSlide
        touchSlide('descriptionTouch', 'y');

        //google analytics send
        const thisId = nowId ? nowId : state.id;
        ReactGA4.send({hitType: "pageview", path: `/Description/${thisId}`, location: `/Description/${thisId}`, title: `/Description/${thisId}`});

        const script = document.createElement("script");
        script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.0.0/kakao.min.js";
        script.crossorigin = "anonymous";
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    //memo
    const bannerGear = useMemo(() => {
        return (
            <StyledBanner>
                <ImgSwiper 
                    imgBox={imgBox} 
                    loadingImg={descriptionLoading}
                    options={{auto:false}}
                    loop={true}
                />
            </StyledBanner>            
        )        
    }, [imgBox]);

    const myTeamGear = useMemo(() => {
        if(selfTeamData && !selfTeamData.length) return null;
        return(
            <StyledTeam>
                <StyledSectionTitle>나의 팀 구매</StyledSectionTitle>
                {selfTeamData && selfTeamData.length ? selfTeamData.map((item, index)=>(      
                    item.member.length ? (
                        <StyledPartyList key={index}>
                            {item.member.map((memberItem, memberIndex)=>(
                                <StyledPartyListImg key={memberIndex} seq={item.member.length-memberIndex-1}>
                                    <img src={memberItem.img}/>
                                </StyledPartyListImg>
                            ))}
                            <StyledPartyListName>{`${item.member[item.member.length-1].name.substr(0, 2)}*`}</StyledPartyListName>
                            { Number(item.team.teamCnt) < Number(item.team.teamMax) ? 
                                <>
                                <StyledPartyListInfo>
                                    <div><span className="partyCnt">{`${Number(item.team.teamMax)-Number(item.team.teamCnt)}명`}</span><span>남음</span></div>
                                    <AutoTimer expireEvent = {() => disableButton(`teamNum${item.team.teamId}`)} timeSet = {item.team.teamTimeLimit} type="h"/>
                                </StyledPartyListInfo>                        
                                <StyledPartyListButton id={`teamNum${item.team.teamId}`} onClick={() => sendShare(item.team.teamId)}>공유하기</StyledPartyListButton>
                                </>
                                :
                                <StyledPartyFinished>팀 모집 완료</StyledPartyFinished>
                            }
                        </StyledPartyList> 
                    ) : null
                )) : null}                                      
            </StyledTeam>
        )
    }, [selfTeamData])

    const partyGear = useMemo(() => {
        return(
            <StyledParty>
                <StyledSectionTitle>열린 팀구매 참여하기 (2인 팀)</StyledSectionTitle>
                {teamData && teamData.length ? teamData.map((item, index)=>(      
                    item.member.length ? (
                        <StyledPartyList key={index}>
                            {item.member.map((memberItem, memberIndex)=>(
                                <StyledPartyListImg key={memberIndex} seq={item.member.length-memberIndex-1}>
                                    <img src={memberItem.img}/>
                                </StyledPartyListImg>
                            ))}
                            <StyledPartyListName>{`${item.member[item.member.length-1].name.substr(0, 2)}*`}</StyledPartyListName>
                            { Number(item.team.teamCnt) < Number(item.team.teamMax) ? 
                                <>
                                <StyledPartyListInfo>
                                    <div><span className="partyCnt">{`${Number(item.team.teamMax)-Number(item.team.teamCnt)}명`}</span><span>남음</span></div>
                                    <AutoTimer expireEvent = {() => disableButton(`teamNum${item.team.teamId}`)} timeSet = {item.team.teamTimeLimit} type="h"/>
                                </StyledPartyListInfo>                        
                                <StyledPartyListButton id={`teamNum${item.team.teamId}`} onClick={() => optionWindowOpen(item)}>참여하기</StyledPartyListButton>
                                </>
                                :
                                <StyledPartyFinished>팀 모집 완료</StyledPartyFinished>
                            }
                        </StyledPartyList> 
                    ) : <span key={index} style={{marginTop : '1.5em', marginBottom : '1.5em', fontSize : '0.8em', color : '#ccc'}}>진행 중인 팀 구매가 없습니다.</span>
                )) : <span style={{marginTop : '1.5em', marginBottom : '1.5em', fontSize : '0.8em', color : '#ccc'}}>진행 중인 팀 구매가 없습니다.</span>}                      
            </StyledParty>            
        )
    }, [teamData])

    const infoGear = useMemo(() => {
        return data ?(
            <StyledInfo>
                <StyledPercent>{Math.round(100-data.goods.goodsPrice/data.goods.consumerPrice*100)}%</StyledPercent>
                <StyledTagPrice>{priceForm(data.goods.consumerPrice)}</StyledTagPrice>
                <StyledPrice>{priceForm(data.goods.goodsPrice)}</StyledPrice>
                <StyledName>{data.goods.goodsName}</StyledName>
                <StyledDelivery1>
                    {`배송비 무료`}
                </StyledDelivery1>
                <StyledDelivery2>배송 2일 소요</StyledDelivery2>
                <StyledTeamInfo onClick={() => setTeamInfo(true)}>팀 구매 안내 <IoIosArrowForward/></StyledTeamInfo>
            </StyledInfo>
        ) : null;
    }, [data]);

    const sellerGear = useMemo(() => {
        //parameter check
        const thisId = nowId ? nowId : state.id;
        
        return data ? (
            <StyledSeller>
                <StyledSectionTitle>판매자 상품</StyledSectionTitle>
                <StyledSectionContent>
                    <SellerGoodsList sellerId={data.goods.seller} limit={4} nowGoods={thisId}/>
                </StyledSectionContent>
            </StyledSeller>
        ) : null;
    }, [data])

    const detailGear = useMemo(() => {
        return data ? (
            <StyledDetail>
                <StyledSectionTitle>상품 상세 설명</StyledSectionTitle>
                {
                    data.goods.detail !="<p>&nbsp;</p>" ? 
                        (
                            <StyledDetailContainer>
                            <StyledHtml dangerouslySetInnerHTML={{__html:stripslashes(data.goods.detail)}}></StyledHtml>
                            <StyledDetailLinkBox>
                                <StyledDetailLink onClick={() => setHtmlWindow(true)}>
                                    상품 상세 확대보기 +
                                </StyledDetailLink>
                            </StyledDetailLinkBox>                                
                            </StyledDetailContainer>
                        ) :
                        <StyledNoneHtml>상품 상세정보가 존재하지 않습니다.</StyledNoneHtml>
                }
            </StyledDetail>
        ) : null;
    }, [data])

    const linkGear = useMemo(() => {
        //parameter check
        const thisId = nowId ? nowId : state.id;
        
        return(
            <>
            <StyledLink onClick={() => navigate('/GoodsQa', { state: { goodsId: thisId } })}>상품 문의 <IoIosArrowForward size="1.5em" color="#ccc"/></StyledLink>
            <StyledLink onClick={() => navigate('/RawHtml', { state: { title: '배송/교환/반품 정책', content:data.seller.sl_delivery_information } })}>배송/교환/반품 정책 <IoIosArrowForward size="1.5em" color="#ccc"/></StyledLink>
            <StyledLink onClick={() => navigate('/SellerInfo', { state: { data:data.seller } })}>판매자 정보 <IoIosArrowForward size="1.5em" color="#ccc"/></StyledLink>
            <StyledEmpty />            
            </>
        )
    }, [data])

    const buyGear = useMemo(() => {
        //parameter check
        const thisJoin = nowJoin ? nowJoin : (state && state.hasOwnProperty('joinInfo') ? state.joinInfo : null);

        if(!data) return null;
        if(thisJoin && !joinTarget) return null;
        return(
            <StyledBuy id="webDescBuy" joinState={joinTarget}>
                <StyledWish onClick={wishChk}>
                    { wish ? <IoMdHeart /> : <IoMdHeartEmpty /> }
                </StyledWish>
                {
                    joinTarget ? 
                        <StyledBuyJoinButton id={`teamJoinButton`} onClick={() => optionWindowOpen(joinTarget)}>
                            <StyledBuyImgBox>
                                <StyledBuyImg src={joinTarget.member[0].img}/>
                            </StyledBuyImgBox>
                            <StyledBuyText>{`${joinTarget.member[0].name.substr(0, 2)}* 님의 팀구매 참여하기 (${joinTarget.team.teamCnt}/${joinTarget.team.teamMax}명)`}</StyledBuyText>
                            <StyledBuyTime><AutoTimer expireEvent = {() => disableButton(`teamJoinButton`)} timeSet = {joinTarget.team.teamTimeLimit} type="h"/> 남음</StyledBuyTime>
                            
                        </StyledBuyJoinButton> 
                        :
                        <>
                        {/* 
                        <StyledButton onClick={() => setDescAlert('noFunction')}>
                            {priceForm(1.5*data.goods.goodsPrice)}<br/>
                            혼자 구매하기
                        </StyledButton>
                        */}
                        {/*
                        <div style={{fontWeight:'bold', fontSize:'0.9em', lineHeight:'3.3em'}}>팀을 모집 해 보세요!</div>
                        */}
                        <span 
                            style={{
                                margin:"3% 7%",
                                border:"solid 0.07em #bbb",
                                color:"#555",
                                borderRadius:"8px",
                                cursor:"pointer"
                            }}
                            onClick={() => sendShare()}
                        >
                            <img style={{width:"2.5em", verticalAlign:"middle"}} src={linkIcon}/><span style={{fontSize:"0.9em", verticalAlign:"middle", fontWeight:"bold"}}>사주세요</span>
                        </span>                        
                        <StyledButton onClick={() => optionWindowOpen()}>
                            {priceForm(data.goods.goodsPrice)}<br/>
                            2인 팀 구매 열기
                        </StyledButton>
                        </>
                }
            </StyledBuy>
        );
    }, [data, wish, joinTarget]);

    const modalGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "70%", 
                    height : "22em", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "0.8em", 
                    buttonName : ["확인"]
                }} 
                type={1} 
                data={{desc : <ModalSwiper guideBox = {guideData}/>}}
                state={teamInfo} 
                closeEvent={() => {
                    setTeamInfo(false)
                }}
            />
        )
    }, [teamInfo]);

    const optionWindowGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "90%", 
                    height : "50%", 
                    textAlign : "left",
                    alignContent : "stretch",  
                    fontSize : "0.8em", 
                    buttonName : [!joinInfo ? "2인 팀구매 시작하기" : "팀구매 참여하기"],
                    buttonStyle : 'bold',
                    sink : 1,
                    motion: true,
                }} 
                type={1} 
                proEvent={() => orderExec()}
                data={{desc : 
                    data ?
                    (<>
                        <StyledOption>
                            <StyledOptionContent>
                                <StyledOptionPrice>
                                    {
                                        `${
                                            priceForm(
                                                (
                                                data.goods.goodsPrice + 
                                                    (
                                                        selectedOpt && selectedOpt!='isNot'? 
                                                        data.options[selectedOpt].addPrice : 
                                                        0
                                                    )
                                                ) *
                                                count
                                            )
                                        } 
                                        ${
                                            selectedOpt==null || selectedOpt=='isNot'? 
                                            '~' : 
                                            ''
                                        }`
                                    }
                                </StyledOptionPrice>
                            </StyledOptionContent>
                            <StyledOptionContent>
                                <StyledOptionTitle>
                                    옵션 <StyledOptionSubtitle optChk={selectedOpt}>{msgData["needOption"]}</StyledOptionSubtitle>
                                </StyledOptionTitle>
                                <StyledOptionList className={window.self != window.top ? 'iframeScroll' : null} cnt={data.options.length}>
                                    {
                                        data.options.map((item, index) => (
                                            item.optionType == 1 ? 
                                            <StyledOptionEach 
                                                key={index} 
                                                selected = {index==selectedOpt} 
                                                onClick={() => item.optionStockQty > 0 ? setSelectedOpt(index) : null}
                                                qtyCheck={item.optionStockQty > 0}
                                            >
                                                {item.optionName}
                                            </StyledOptionEach> 
                                            : 
                                            null
                                        ))
                                    }
                                </StyledOptionList>
                            </StyledOptionContent>
                            <StyledOptionContent>
                                <StyledOptionCount>
                                    <div>
                                        <span>주문수량</span>
                                        <StyledMaxQty>
                                            {data.goods.orderMaxQty ? `최대 ${data.goods.orderMaxQty}개 까지 구매가능!` : null}
                                        </StyledMaxQty>                                        
                                    </div>
                                    <div>
                                        <StyledOptionCountBtn onClick = {() => {
                                            if(selectedOpt!=null && selectedOpt!='isNot'){
                                                setCount((count-1>=1)?count-1:1)
                                            }else{
                                                setSelectedOpt('isNot');
                                            } 
                                        }}>
                                            <AiFillMinusSquare size="1.5em"/>
                                        </StyledOptionCountBtn>
                                        <StyledOptionCountNumber>
                                            {count}
                                        </StyledOptionCountNumber>
                                        <StyledOptionCountBtn onClick = {() => {
                                            if(selectedOpt!=null && selectedOpt!='isNot'){
                                                setCount(count + (count<(Number(data.goods.orderMaxQty)||1000) ? 1 : 0))
                                            }else{
                                                setSelectedOpt('isNot');
                                            } 
                                        }}>
                                            <AiFillPlusSquare size="1.5em"/>
                                        </StyledOptionCountBtn>
                                    </div>
                                </StyledOptionCount>
                            </StyledOptionContent>
                        </StyledOption>
                    </>) : null
                }}
                state={optionWindow} 
                closeEvent={() => {
                    setOptionWindow(false);
                }}
            />
        )
    }, [optionWindow, selectedOpt, count, joinInfo]);    

    const loginAlertGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "75%", 
                    height : "8em", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "1em", 
                    buttonName : ["로그인 페이지로","취소"]
                }} 
                type={2}
                proEvent = {() => {
                    navigate('/Login');
                    return true;
                }}
                consEvent = {() => {
                    return true;
                }}
                data={{desc : msgData['needLogin']}}
                state={loginAlert} 
                closeEvent={() => setLoginAlert(false)}
            />
        )        
    }, [loginAlert]);

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
                data={{desc : msgData[descAlert]}}
                state={descAlert} 
                closeEvent={() => {
                    setDescAlert(false);
                    return true;    
                }}
            />     
        )        
    }, [descAlert]);

    const htmlGear = useMemo(() => {
        if(!data) return null;
        return(
            <Modal 
                option={{
                    width : "100%", 
                    height : "95%", 
                    textAlign : "center",
                    alignContent : "space-between",  
                    fontSize : "0.8em", 
                    buttonName : ["확인"],
                    overflow: 'auto'
                }} 
                type={1} 
                data={{
                    desc : <div dangerouslySetInnerHTML={{__html:stripslashes(data.goods.detail)}}></div>,
                    title : '상품 상세보기'
                }}
                state={htmlWindow} 
                noClose={true}
                closeEvent={() => {
                    setHtmlWindow(false);
                    return true;    
                }}
            />     
        )        
    }, [data, htmlWindow]);

    const reviewGear = useMemo(() => {
        //parameter check
        const thisId = nowId ? nowId : state.id;

        return(
            <StyledReview>
                <StyledSectionTitle>구매후기 {reviewCnt}건</StyledSectionTitle>
                <ReviewListGoods goodsId={thisId} limit={3} sendCnt={setReviewCnt}/>            
                {
                    reviewCnt ? (
                        <StyledReviewLinkBox>
                        <StyledReviewLink onClick={() => navigate('/Review', { state: { reviewCnt: reviewCnt, goodsId: thisId } })}>{reviewCnt}개 구매후기 전체보기 <IoIosArrowForward /></StyledReviewLink>
                        </StyledReviewLinkBox>
                    ) : null
                }

            </StyledReview>
        )
    }, [reviewCnt, state])

    const shareGear = useMemo(() => {
        if(!data) return null;

        const goodsData = data.goods;
        const joinData = nowJoin ? nowJoin : (state && state.hasOwnProperty('joinInfo') ? state.joinInfo : null);
        const sendData = {
            'goods' : goodsData,
            'join' : joinData,
        }
        return <KakaoShare type="goods" sendData={sendData} />
    }, [data])

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
    return (
        <SimpleMotion>
        <StyledDescription id="descriptionTouch">
            {/*shareGear*/}
            <StyledHeader id="webDescHeader">
                <StyledBack size='2em' onClick={moveBack}/>
            </StyledHeader>
            <StyledContainer>
                {loading? <StyledBannerLoading /> : bannerGear}
                {infoGear}
                {myTeamGear}
                {partyGear}
                {reviewGear}
                {sellerGear}
                {detailGear}
                {linkGear}
                {buyGear}
            </StyledContainer>
            {modalGear}
            {optionWindowGear}
            {loginAlertGear}
            {alertGear}
            {iframeAlertGear}
            {htmlGear}
        </StyledDescription>
        </SimpleMotion>
    );
});

export default Description;