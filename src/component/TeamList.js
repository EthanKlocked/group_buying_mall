//------------------------------ MODULE -------------------------------------
import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from "styled-components";
import { apiCall, priceForm, nameCut, strToDate } from "lib";
import { AutoTimer, CustomLoading } from "component";
import { useNavigate } from "react-router-dom";
import { BsStarFill } from "react-icons/bs";

//------------------------------ CSS ----------------------------------------
const StyledTeam = styled.div`
    width:100%;
    padding-bottom:10em;
`;
const StyledItemInfo = styled.div`
    border-bottom:${(props) => !props.lenChk ? 'solid 0.6em #f5f5f5' : 'none'};
    padding:0.2em 1em;
    cursor:pointer;
`;
const StyledTeamInfo = styled.div`
    text-align:start;
    padding: 0.2em 0;
`;
const StyledTeamImg = styled.span`
    display:inline-block;
    text-align:start;
    width:8em;
    height:8em;
    vertical-align:middle;
    img{
        width:8em !important;
        height:8em !important;
        border-radius:0.3em;
    }
    position:relative;
`;
const StyledTeamTime = styled.span`
    position:absolute;
    left:0;
    bottom:0;
    font-size:0.8em;
    font-weight:normal;
    color:white;
    background-color:rgba(0, 0, 0, 0.5);
    width:100%;
    border-radius:0 0 0.5em 0.5em;
`;
const StyledTeamText = styled.span`
    display:inline-block;
    vertical-align:middle;
    width:55%;
    margin-left:1em;
    text-align:start;
    div{
        text-align:start;
        margin-bottom:0.2em;
    }
`;
const StyledTeamName = styled.div`
    font-size:0.9em;
`;
const StyledTeamPriceRow = styled.div`
`;
const StyledTeamPrice = styled.span`
    font-size:0.8em;
    text-decoration:line-through;
    color:#888;
`;
const StyledTeamRealPrice = styled.span`
    color:crimson;
    font-weight:bold;
    padding-right:0.5em;
`;
const StyledTeamReview = styled.div`
    font-size:0.8em;
    span{
        padding-right:0.2em;
    }
`;
const StyledTeamReviewIcon = styled.span`
    svg{
        vertical-align:middle;
    }
`;
const StyledTeamReviewScore = styled.span`
    color:#888;
    font-weight:bold;
    vertical-align:middle;
`;
const StyledTeamReviewScoreCnt = styled.span`
    color:#888;
    vertical-align:middle;
`;
const StyledTeamBuyCnt = styled.div`
    font-size:0.8em;
    padding-top:0.2em;
    color:#aaa;
`;
const StyledTeamLeft = styled.div`
    font-weight:bold;
`;
const StyledTeamLeftText = styled.span`
    font-weight:bold;
    vertical-align:middle;
`;
const StyledTeamLeftProfile = styled.span`
    display:inline-block;
    overflow:hidden;
    width:1.5em;
    height:1.5em;
    border-radius:50%;
    vertical-align:middle;
    padding:0 !important;
    margin:0 0.3em;
    img{
        width:100%;
        height:100%;
        object-fit:cover;        
    }    
`;

//------------------------------ COMPONENT ----------------------------------
const TeamList = React.memo(({limit, alertHandler}) => {
    //init
    const navigate = useNavigate();    

    //ref
    const observer = useRef();
    const lastChk = useRef(false);

    //state
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [pageLoading, setPageLoading] = useState(false);

    //function
    const initData = async() => {
        try {
            //teamData
            const params = { rpp : limit, teamStatus : 'set', page : page, activateChk: true, exceptSelf : true }
            const teamResult = await apiCall.get("/team", {params});
            if(teamResult.data.res = 'success') setData(teamResult.data.public);
        }catch(e){
            console.log(e);
        }
    }

    const addData = async() => {
        try {
            //teamData
            const params = { rpp : limit, teamStatus : 'set', page : page, activateChk: true, exceptSelf : true }
            const teamResult = await apiCall.get("/team", {params});
            if(teamResult.data.res == 'success'){
                if(!teamResult.data.public.length){ //----IS THE LAST INDEX IN ITEM DATAS----//
                    return lastChk.current = true;
                } 
                setData([...data, ...teamResult.data.public]);
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

    const disableButton = (id) => document.getElementById(id).children[0].innerHTML = '팀구매 종료';

    const moveDesc = (item) => {
        if(strToDate(item.team.teamTime)<new Date()) return alertHandler('teamExpired');
        const obj = {
            id: item.team.goodsId,
            joinInfo: item.team.teamId,
        }
        navigate('/Description', { state: obj });
    };

    //effect
    useEffect(() => {
        initData();
    }, []);

    useEffect(() => {
        if(page > 1) addData();
    }, [page]); 

    //memo
    const teamGear = useMemo(() => {
        if(!data) return null;
        return data.length ? (            
            data.map((item, index) => (
                <StyledItemInfo key={index} lenChk={data.length-1 == index} onClick = {() => moveDesc(item)}>
                    <StyledTeamInfo>
                        <StyledTeamImg>
                            <img src={`${process.env.REACT_APP_SERVER_URL}/${item.goods.timg1}`} />
                            <StyledTeamTime id={`teamTime${item.team.teamId}`}>
                                <AutoTimer expireEvent = {() => disableButton(`teamTime${item.team.teamId}`)} timeSet = {item.team.teamTimeLimit} type="h"/>
                            </StyledTeamTime>                            
                        </StyledTeamImg>
                        <StyledTeamText>
                            <StyledTeamName>{nameCut(item.goods.goodsName, 30)}</StyledTeamName>
                            <StyledTeamPriceRow>
                                <StyledTeamRealPrice>{priceForm(item.goods.goodsPrice)}</StyledTeamRealPrice>
                                <StyledTeamPrice>{priceForm(item.goods.consumerPrice)}</StyledTeamPrice>
                            </StyledTeamPriceRow>
                            <StyledTeamReview>
                                <StyledTeamReviewIcon><BsStarFill color="#FFD228"/></StyledTeamReviewIcon>
                                <StyledTeamReviewScore>{Number.isInteger(item.reviewAvg) ? `${item.reviewAvg}.0` : item.reviewAvg}</StyledTeamReviewScore>
                                <StyledTeamReviewScoreCnt>({item.reviewCnt})</StyledTeamReviewScoreCnt>
                                {item.buyCnt ? <StyledTeamBuyCnt>{item.buyCnt}명 구매 완료</StyledTeamBuyCnt> : null}
                                <StyledTeamLeft>
                                    <StyledTeamLeftText>남은 인원 {item.team.teamMax - item.team.teamCnt}명</StyledTeamLeftText>
                                    <StyledTeamLeftProfile ref={index==data.length-1 ? lastItemElementRef : null}><img src={item.member[0].img}/></StyledTeamLeftProfile>
                                </StyledTeamLeft>
                            </StyledTeamReview>
                        </StyledTeamText>
                    </StyledTeamInfo>
                </StyledItemInfo>
            ))
        ) : <span style={{display:'inline-block', paddingTop: '3em', marginBottom : '1.5em', fontSize : '0.8em', color : '#ccc'}}>진행 중인 팀 구매가 없습니다.</span>;
    }, [data])

    //render
    if(!data) return <CustomLoading marginB="130%" size="10px" color="#aaa"/>;
    return(
        <StyledTeam>
            {teamGear}
        </StyledTeam>
    )
});

export default TeamList;

