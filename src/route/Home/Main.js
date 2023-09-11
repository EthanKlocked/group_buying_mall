//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { ImgSwiper, ItemList, TeamMain, SimpleMotion, AttendButton } from "component";
import { FcAlarmClock, FcLeave, FcApproval } from "react-icons/fc";
import React, { useState, useEffect, useMemo } from 'react';
import { apiCall } from 'lib';
import bannerArea from 'data/img/bannerArea.png';

//------------------------------ COMPONENT ----------------------------------
const Main = React.memo(({categoryId}) => {
    //state
    const [banners, setBanners] = useState(null);
    const [teamData, setTeamData] = useState(null);

    //function
    const initData = async() => {
        try {
            //bannerData
            setBanners([]);
            let params = { position : 6 };
            const bannerResult = await apiCall.get("/banner", {params});
            setBanners(bannerResult.data.data.map(i=>`${process.env.REACT_APP_SERVER_URL}${i.img}`)); //추수 mimg 테스트 후 mimg 로 변경 예정

            //teamData
            params = { rpp : 6, teamStatus : 'set', page : 1, activateChk: true, exceptSelf : true };
            const teamResult = await apiCall.get("/team", {params});

            let teamListData = teamResult.data.public;
            
            if(teamListData.length < 1){
                params = { rpp : 5, page : 1 };
                const teamEmpty = await apiCall.get("/team", {params});
                teamListData = teamEmpty.data.public;
            }
            
            setTeamData(teamListData);
        }catch(e){
            console.log(e);
        }
    }

    //effect
    useEffect(() => {
        initData();
    }, []);

    //memo
    const bannerGear = useMemo(() => {
        return(
            <SimpleMotion>
            <StyledBanner>
                {banners && banners.length > 0 ? 
                    <ImgSwiper imgBox={banners} auto={true} loop={true}/> : 
                    <StyledNoBanner><img src={bannerArea}/></StyledNoBanner>
                }
            </StyledBanner>            
            </SimpleMotion>
        )
    }, [banners]);

    const eventGear = useMemo(() => {
        return null;
        return(
            <StyledEvent>
                <StyledEventButton>
                    <StyledEventIcon><FcAlarmClock/></StyledEventIcon>
                    <StyledEventName>타임딜</StyledEventName>
                </StyledEventButton>
                <StyledEventButton>
                    <StyledEventIcon><FcLeave/></StyledEventIcon>
                    <StyledEventName>출석체크</StyledEventName>
                </StyledEventButton>
                <StyledEventButton>
                    <StyledEventIcon><FcApproval/></StyledEventIcon>
                    <StyledEventName>팀추첨</StyledEventName>
                </StyledEventButton>
            </StyledEvent>            
        )
    }, []);

    const teamGear = useMemo(() => {
        return(
            <>
                <StyledTitle>
                    <StyledMainTitle>나만 사면 돼</StyledMainTitle>
                    <StyledRowSemiTitle>남은 인원 1명! 서두르세요</StyledRowSemiTitle>
                </StyledTitle>
                <SimpleMotion>
                    <StyledTeam>
                        <TeamMain teamData={teamData}/>
                    </StyledTeam>
                </SimpleMotion>
            </>
        )
    }, [teamData]);

    const itemGear = useMemo(() => {
        return (
            <StyledItems>
                <ItemList loadingCover={true} coverTop="7em"/>
            </StyledItems>           
        )
    }, []);

    //render
    return (
        <>
        <StyledMain>
            {bannerGear} 
            {eventGear}
            {teamGear} 
            {itemGear}
            <AttendButton/>
        </StyledMain>
        </>
    )    
});

export default Main;

//------------------------------ CSS ----------------------------------------
const StyledMain = styled.div`
    background:white;
`;
const StyledBanner = styled.div`
    height:121px;
`;
const StyledNoBanner = styled.div`
    width:100%;
    img{
        width:100%;
    }
`;
const StyledTitle = styled.div`
    margin: 1em 0 0 0.9em;
`;
const StyledMainTitle = styled.div`
    font-weight:bold;
    text-align:start;
    font-size:1em;
`;
const StyledRowSemiTitle = styled.div`
    font-size:0.8em;
    text-align:start;
    color:#888;
`;
const StyledEvent = styled.div`
    display:grid;
    grid-template-columns: repeat(3, 1fr);
    padding:5% 0;
    border-bottom:solid 0.6em #f5f5f5;
`;
const StyledEventButton = styled.div`
`;
const StyledEventIcon = styled.div`
    font-size:2.5em;
`;
const StyledEventName = styled.div`
    font-size:0.5em;
`;
const StyledTeam = styled.div`
    border-bottom:solid 0.6em #f5f5f5;
    height:11.5em;
`;
const StyledItems = styled.div`
`;