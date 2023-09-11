//------------------------------ MODULE -------------------------------------
import React, { useState, useMemo, useRef, useEffect } from 'react';
import styled from "styled-components";
import { FcIdea, FcNext } from "react-icons/fc";
import { priceForm, strToDate, nameCut } from "lib";
import { AutoTimer, Modal, Motion } from "component";
import { useNavigate } from "react-router-dom";
import { msgData } from "static";
import { apiCall, touchSlide } from "lib";

//------------------------------ CSS ----------------------------------------
const StyledContainer = styled.div`
    img{
        height:100%;
        border-radius: 0.5em;
    }
    overflow-x:auto;
    overflow-y:hidden;
    ::-webkit-scrollbar {
        display: none;
    }
    text-align:start;
`;
const StyledContent = styled.span`
    text-align:start;
    display:inline-block;
    height:12em;
    width:${(props) => {
        if(props.w < 3) return `100%`;
        if(props.w < 6) return `${12+props.w*6}em`;
        return `${21+props.w*6}em`;
    }};
    div{
        text-align:start;
    }
`;
const StyledFirst = styled.span`
    display:inline-block;
    height:80%;
    width:5em;
    vertical-align:top;
    margin-top:0.8em;
    border-right:solid 1px #aaa;
`;
const StyledFirstIcon = styled.div`
    padding-top:1em;
`;
const StyledLastIcon = styled.div`
    padding-top:3em;
    margin-left:2em;
`;
const StyledFirstTitle = styled.div`
    font-weight:550;
    font-size:0.9em;
`;
const StyledFirstSub = styled.div`
    font-size:0.8em;
    font-weight:550;
    color:#999;
`;
const StyledLastTitle = styled.div`
    font-size:0.8em;
    color:#999;
    margin-left:2em;
`;
const StyledItem = styled.span`
    display:inline-block;
    height:90%;
    margin:0.2em 0 0 0.7em;
    cursor:pointer;
`;
const StyledEmptyItem = styled.span`
    font-size:0.8em;
    color:#999;
    line-height:5em;
    padding-left:1.1em;
`;
const StyledItemImg = styled.span`
    display:inline-block;
    height:70%;
    padding-top:0.4em;
    position:relative;
`;
const StyledItemTime = styled.span`
    position:absolute;
    right:5%;
    bottom:5%;
    font-size:0.9em;
    span{
        font-weight:500;
    }
    color:white;
    background-color:rgba(0, 0, 0, 0.5);
    width:70%;
    border-radius:1em;
`;
const StyledItemTimeExp = styled.span`
    position:absolute;
    right:0;
    bottom:0;
    span{
        font-weight:500;
        font-size:1.5em;
        padding:1.8em 0;
        height:100%;
        display:inline-block;
    }
    color:white;
    background-color:rgba(0, 0, 0, 0.5);
    width:100%;
    height:95%;
    border-radius:0.5em;
`;
const StyledItemPrice = styled.div`
    font-size:0.8em;
    font-weight:bold;
    color:crimson;
`;
const StyledLast = styled.span`
    display:inline-block;
    height:100%;
    width:5em;
    vertical-align:top;
    cursor:pointer;
`;

//------------------------------ COMPONENT ----------------------------------
const TeamMain = React.memo(({teamData}) => {
    //init
    const nowTime = useRef(new Date());
    const navigate = useNavigate();    

    //state
    const [mainAlert, setMainAlert] = useState(false);

    //function
    const moveDesc = (item) => {
        if(strToDate(item.team.teamTime)<new Date()) return setMainAlert('teamExpired');
        const obj = {
            id: item.team.goodsId,
            joinInfo: item.team.teamId,
        }
        navigate('/Description', { state: obj });
    };

    const disableButton = (id) => {
        const element = document.getElementById(id);
        element.children[0]["innerHTML"] = 'TIME OUT';
        element.children[0].style["display"] = 'inline-block';
        element.children[0].style["height"] = '100%';
        element.children[0].style["padding"] = '2em 0';
        element.children[0].style["font-size"] = '1.5em';
        element.style["height"] = "95%";
        element.style["width"] = "100%";
        element.style["bottom"] = "0";
        element.style["right"] = "0";
        element.style['border-radius'] = "0.5em";
    }

    const tokenTest = async() => {
        const tokenResult = await apiCall.get("/Test");
        console.log(tokenResult.data);
    }

    //effect
    useEffect(() => {
        if(teamData) touchSlide('teamTouch', 'x');
    }, [teamData])

    //memo
    const fisrtGear = useMemo(() => {
        return(
            <StyledFirst onClick={tokenTest}>
                <StyledFirstIcon>
                    <FcIdea size="2em"/>
                </StyledFirstIcon>
                <StyledFirstTitle>성공임박</StyledFirstTitle>
                <StyledFirstSub>마지막 1명!</StyledFirstSub>
            </StyledFirst>
        );
    }, []);
    
    const middleGear = useMemo(() => {
        if(!teamData) return null;
        if(!teamData.length) return <StyledEmptyItem> 진행 중인 팀 구매가 없습니다. </StyledEmptyItem>;
        return(
            <>
            {teamData.map((item, index)=>(
                <StyledItem key={index} onClick = {() => moveDesc(item)} >
                    {
                        item.team.teamTimeLimit >= 0 
                        ? 
                        <StyledItemImg>
                            <img src={`${process.env.REACT_APP_SERVER_URL}/${item.goods.timg1}`}></img>
                            <StyledItemTime id={`teamTime${item.team.teamId}`}>
                                <AutoTimer expireEvent = {() => disableButton(`teamTime${item.team.teamId}`)} timeSet = {item.team.teamTimeLimit} type="h"/>
                            </StyledItemTime>                            
                        </StyledItemImg>
                        :    
                        <StyledItemImg>
                            <img src={`${process.env.REACT_APP_SERVER_URL}/${item.goods.timg1}`}></img>
                            <StyledItemTimeExp id={`teamTime${item.team.teamId}`}>
                                <span>
                                    TIME OUT
                                </span>
                            </StyledItemTimeExp>
                        </StyledItemImg>
                    }
                    <StyledItemPrice>
                        <div style={{color:"#555",fontWeight:"normal"}}>{nameCut(item.goods.goodsName, 10)}</div>
                        <div>
                            <span>{Math.round(100-item.goods.goodsPrice/item.goods.consumerPrice*100)}%</span>
                            <span style={{marginLeft:"0.5em",color:"#555",fontWeight:"bold"}}>{priceForm(item.goods.goodsPrice)}</span>
                        </div>
                    </StyledItemPrice>
                </StyledItem>
            ))}
            </>
        );
    }, [teamData]);    

    const lastGear = useMemo(() => {
        if(teamData && teamData.length < 6) return null;
        return(
            <StyledLast onClick = {() => navigate('/TeamOrder')}>
                <StyledLastIcon>
                    <FcNext size="2em"/>
                </StyledLastIcon>
                <StyledLastTitle>
                    더 보기
                </StyledLastTitle>
            </StyledLast>            
        )
    }, [teamData]);

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
                data={{desc : msgData[mainAlert]}}
                state={mainAlert} 
                closeEvent={() => {
                    setMainAlert(false);
                    return true;    
                }}
            />     
        )        
    }, [mainAlert]);

    //render
    if(!teamData) return null;
    return(
        <StyledContainer id="teamTouch">
            <StyledContent w={teamData.length}>
                <Motion isOn={teamData.length ? 1 : 0} isVisible={true} duration={0.2} overflow={null}>
                {middleGear}
                {lastGear}
                </Motion>
            </StyledContent>
            {alertGear}
        </StyledContainer>
    )
});

export default TeamMain;

