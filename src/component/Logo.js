//------------------------------ MODULE -------------------------------------
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import React, { useContext } from "react";
import { BaseContext, SrchContext, CacheContext } from "context";
import { elementScrollIntoView } from 'seamless-scroll-polyfill';
import { IoIosArrowBack } from "react-icons/io";

//------------------------------ CSS ----------------------------------------
const StyledLogoBox = styled.span`
    text-align:${(props) => props.xPosition};
    cursor:pointer;
`;
const StyledLogo = styled.img`        
    height:${(props) => props.height};
    vertical-align: -webkit-baseline-middle;
`;
const StyledBack = styled(IoIosArrowBack)`
    color:crimson;
    height:${(props) => props.height};
    vertical-align: -webkit-baseline-middle;
    width:2em;
    font-size:1.1em;
`;

//------------------------------ COMPONENT ----------------------------------
const Logo = React.memo(({ h = null, xPosition = 'center', type=1 }) => {
    //init
    const navigate = useNavigate();    
    const { pathname }  = useLocation();

    //context
    const { base } = useContext(BaseContext);
    const { setSrchHandler } = useContext(SrchContext);
    const { cache, setCacheHandler } = useContext(CacheContext);

    //function
    const moveToHome = () => {
        //init
        const cacheData = cache;
        if(cacheData.hasOwnProperty('/Home/Search')) delete cacheData['/Home/Search'];
        setCacheHandler(cacheData);
        setSrchHandler(null);

        const srchInput = document.getElementById('srchTextInput');
        const homeMenu = document.getElementById("homeTarget");

        //move
        navigate('/Home/Main');
        
        //after task
        if(srchInput) srchInput.value = '';
        if(homeMenu) setTimeout(() => elementScrollIntoView(homeMenu,{behavior: "smooth", block: "center", inline: "center"}), 0);
    }

    //render
    return (
        <>
            {/*<Link to={"/"}><StyledLogo src={logoImg} height={h}/></Link>*/}
            {/*<Link to={"/"}><StyledLogo src={`${process.env.REACT_APP_SERVER_URL}/${base.logo}`} height={h}/></Link>*/}
            {
                <StyledLogoBox onClick={moveToHome} xPosition={xPosition}>
                    {pathname == "/Home/Search" ? <StyledBack height={h}/> : <StyledLogo src={`${process.env.REACT_APP_SERVER_URL}/${type == 1 ? base.logo : base.mLogo}`} height={h}/>}
                </StyledLogoBox>
            }
        </>
    );     
});

export default Logo;