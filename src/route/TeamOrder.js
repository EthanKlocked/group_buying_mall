//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { TeamList, ReviewList, Modal, ImgSwiper, SimpleMotion } from "component";
import React, {useEffect, useState, useMemo} from "react";
import { customSlide, touchSlide } from "lib";
import { msgData } from "static";

//------------------------------ CSS ----------------------------------------
const StyledContainer = styled.div`
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
    height: 0.2em;
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
    padding:1em 0;
    overflow-y:auto;
    &::-webkit-scrollbar {
        display: none;
    }    
`;

//------------------------------ COMPONENT ----------------------------------
const TeamOrder = React.memo(() => {
    //state
    const [imgBox, setImgBox] = useState(null);
    const [teamAlert, setTeamAlert] = useState(false);

    //effect
    useEffect(() => {
        customSlide();
        touchSlide('upstreamTarget', 'y');
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
                    overflow: "auto"
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
                    height : "8em", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "0.8em", 
                    buttonName : ["확인"]
                }} 
                type={1} 
                data={{desc : msgData[teamAlert]}}
                state={teamAlert} 
                closeEvent={() => {
                    setTeamAlert(false);
                    return true;    
                }}
            />     
        )        
    }, [teamAlert]);

    //render
    return (
        <>
        <SimpleMotion>
        <StyledContainer id="wrapper">
            <StyledHeader id="nav">
                <StyledMenu>
                    <StyledMenuList>성공임박 팀구매</StyledMenuList>
                    <StyledMenuList>구매후기</StyledMenuList>
                </StyledMenu>
                <StyledLine id="line"/>
            </StyledHeader>
            <StyledContent id="content">
                <StyledContentList id="contentList">
                    <StyledContentItem id="upstreamTarget">
                        <TeamList limit={5} alertHandler={setTeamAlert}/>
                    </StyledContentItem>
                    <StyledContentItem id="upstreamTarget">
                        <ReviewList limit={5} dayCnt={10} wideImg={setImgBox} />
                    </StyledContentItem>                    
                </StyledContentList>
            </StyledContent>
        </StyledContainer>
        {imageGear}
        {alertGear}
        </SimpleMotion>
        </>
    );      
});

export default TeamOrder;