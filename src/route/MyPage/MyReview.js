//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { Modal, ImgSwiper, Title, ReviewOrder, MyReviewList } from "component";
import React, {useEffect, useState, useMemo} from "react";
import { customSlide } from "lib";
import { msgData } from "static";

//------------------------------ CSS ----------------------------------------
const StyledMyReview = styled.div`
    overflow:hidden;
    height:100%;
`;
const StyledContainer = styled.div`
    padding-top:3.5em;
    overflow:hidden;
    height:100%;
`;
const StyledHeader = styled.nav`
`;
const StyledMenu = styled.ul`
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 0;
    border-bottom:solid 0.15em #f5f5f5;
`;
const StyledMenuList = styled.li`
    list-style: none;
    height: 3.5em;
    cursor: pointer;
    width:50%;
    line-height:3.5em;
`;
const StyledLine = styled.div`
    position: absolute;
    height: 0.2em;;
    background-color: crimson;
    transition: .3s ease-out;
    margin:0;
    padding:0;
    border:none;
    z-index:2;
`;
const StyledContent = styled.div`
    height:100%;
`;
const StyledContentList = styled.div`
    width: 200%;
    height:100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    transition: .3s ease-out;
`;
const StyledContentItem = styled.div`
    width: 100%;
    height:100%;
    background:#f5f5f5;
    overflow-y:auto;
`;

//------------------------------ COMPONENT ----------------------------------
const MyReview = React.memo(() => {
    //state
    const [imgBox, setImgBox] = useState(null);
    const [reviewAlert, setReviewAlert] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [bridge, setBridge] = useState(null); //connect MyReviewList tp ReviewOrder

    //effect
    useEffect(() => {
        customSlide();
    }, []);

    //memo
    const imageGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "20em", 
                    height : "21.5em", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "0.8em", 
                }} 
                type={0} 
                data={{desc : (                
                    <ImgSwiper 
                        imgBox={imgBox} 
                        options={{auto:false}}
                        loop={true}
                    />)
                }}
                state={imgBox} 
                closeEvent={() => {
                    setImgBox(null);
                    return true;    
                }}
            />     
        )        
    }, [imgBox]);

    const alertGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "70%", 
                    height : "6em", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "0.8em", 
                    buttonName : ["확인"]
                }} 
                type={1} 
                data={{desc : msgData[reviewAlert]}}
                state={reviewAlert} 
                closeEvent={() => {
                    setReviewAlert(false);
                    return true;    
                }}
            />     
        )        
    }, [reviewAlert]);

    //memo
    const confirmGear = useMemo(() => {
        return !confirm ? null : (
            <Modal 
                option={{
                    width : "75%", 
                    height : "8em", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "1em", 
                    buttonName : ["삭제","취소"]
                }} 
                type={2}
                proEvent = {() => {
                    confirm.exec();
                    return true;
                }}
                consEvent = {() => {
                    return true;
                }}
                data={{
                    desc : msgData[confirm.desc],
                    title : confirm.title
                }}
                state={confirm} 
                closeEvent={() => setConfirm(null)}
            />
        )
    }, [confirm]);

    //render
    return (
        <StyledMyReview>
            <Title text="구매 후기" />
            <StyledContainer id="wrapper">
                <StyledHeader id="nav">
                    <StyledMenu>
                        <StyledMenuList>구매 후기 작성하기</StyledMenuList>
                        <StyledMenuList>내가 작성한 후기</StyledMenuList>
                    </StyledMenu>
                    <StyledLine id="line"/>
                </StyledHeader>
                <StyledContent id="content">
                    <StyledContentList id="contentList">
                        <StyledContentItem>
                            <ReviewOrder limit={5} bridgeChk={bridge}/>
                            {/*<TeamList limit={5} alertHandler={setTeamAlert}/>*/}
                        </StyledContentItem>
                        <StyledContentItem>
                            <MyReviewList limit={5} wideImg={setImgBox} confirmHandler={setConfirm} bridgeHandler={setBridge}/>
                            {/*<ReviewList limit={5} dayCnt={10} wideImg={setImgBox} /> */}
                        </StyledContentItem>                    
                    </StyledContentList>
                </StyledContent>
            </StyledContainer>
            {imageGear}
            {alertGear}
            {confirmGear}
        </StyledMyReview>
    );      
});

export default MyReview;