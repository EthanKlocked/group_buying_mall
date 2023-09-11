//------------------------------ MODULE -------------------------------------
import React, { useEffect, useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Logo, SearchBar, Menu, SimpleMotion } from "component";
import { SrchContextProvider, CacheContext} from "context";
import { touchSlide } from "lib";

//------------------------------ COMPONENT ----------------------------------
const Home = React.memo(() => {
    //init
    const { pathname }  = useLocation();
    const chkSearch = pathname.endsWith('Search');
    const navigate = useNavigate();
    const { cache } = useContext(CacheContext);

    if(pathname == "/Home") navigate("/Home/Main");

    //effect
    useEffect(() => {
        if(!pathname.endsWith('Search')){
            const cacheData = cache;
            if(cacheData.hasOwnProperty('/Home/Search')) delete cacheData['/Home/Search'];
        }
        document.getElementById('home').scrollTo(0,0);
        touchSlide('upstreamTarget', 'y');
    }, []);

    //render
    return (
        <>
        <SimpleMotion>
        <StyledContainer id="home" chkSearch={chkSearch} >
            <SrchContextProvider>
            <StyledHeader id="header" chkSearch={chkSearch}>
                <StyledSearchBar><Logo h='2.2em' xPosition="start" type={2}/><SearchBar /></StyledSearchBar>
                <Menu/>
            </StyledHeader>
            <StyledContent id="upstreamTarget" path={pathname} chkSearch={chkSearch}>
                <Outlet />
                <StyledFooter />
            </StyledContent>
            </SrchContextProvider>
        </StyledContainer>
        </SimpleMotion>
        </>
    );
});

export default Home;

//------------------------------ CSS ----------------------------------------
const StyledContainer = styled.div`
    display:grid;
    height: 100%;
    //grid-template-rows: ${(props)=>props.chkSearch ? '4em' : '6em'} auto;
    overflow:hidden;
`;
const StyledHeader = styled.div`
    display:grid;
    width:100%;
    //grid-template-rows: ${(props)=>props.chkSearch ? '3em ' : '3em auto'};
    height:${(props)=>props.chkSearch ? '3.5em ' : '7em'};
    position:fixed;
    z-index:3;
    background:white;
`;
const StyledSearchBar = styled.div`
    display:grid;
    padding: 0 0.7em;
    height:3.5em;
    grid-template-columns: 1fr 3fr;
    align-content: center;
`;
const StyledContent = styled.div`
    width:100%;
    margin: 0 auto;
    left: 0;
    right: 0;
    margin-top:${(props)=>props.chkSearch ? '3.5em' : '7em'};
    overflow-y:auto;
    overflow-x:hidden;
    &::-webkit-scrollbar {
        display: none;
    }
`;
const StyledFooter = styled.div`
    display:grid;
    height:5em;
`;