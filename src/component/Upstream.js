//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { IoIosArrowUp } from "react-icons/io";
import React, { useState, useEffect, useMemo } from "react";
import { scrollTo } from 'seamless-scroll-polyfill';
import { useLocation } from "react-router-dom";
import { SimpleMotion } from "component";

//------------------------------ CSS ----------------------------------------
const StyledDiv = styled.div`
    position:fixed;
    right: 5%;
    bottom:12%;
    z-index:4;
    height:3em;
    width:3em;
    border-radius:50%;
    background:white;
    box-shadow: 0px 0px 30px #ddd;
    margin-top:0.2em;
    color:gray;
    cursor:pointer;
`;

//------------------------------ COMPONENT ----------------------------------
const Upstream = React.memo(() => {
    //init
    const { pathname } = useLocation();

    //state
    const [scroll, setScroll] = useState(false);
    const [upstreamTarget, setUpstreamTarget] = useState(null);

    //function
    const handleScroll = () => {
        if(upstreamTarget.scrollTop >= 50) setScroll(true);
        else setScroll(false);
    };     

    //effect
    useEffect(() => {
        setScroll(false);
        setUpstreamTarget(document.getElementById('upstreamTarget') || null);
    }, [pathname]);

    useEffect(() => {
        if(!upstreamTarget) return;

        upstreamTarget.addEventListener('scroll', handleScroll);
        return () => upstreamTarget.removeEventListener('scroll', handleScroll); //clean up
    }, [upstreamTarget]);

    //memo
    const buttonGear = useMemo(() => {
        return (
            <SimpleMotion isVisible={scroll} pagecover={0}>
                <StyledDiv id="webUpstream" onClick={() => {
                    console.log('event');
                    scrollTo(upstreamTarget,{behavior: "smooth", top: 0, left: 0})
                }}>
                    <IoIosArrowUp size="2em"/>
                </StyledDiv>
            </SimpleMotion>
        );
    }, [scroll]);

    //render
    return buttonGear; 
});

export default Upstream;