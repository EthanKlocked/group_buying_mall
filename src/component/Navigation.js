//------------------------------ MODULE -------------------------------------
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { IoHomeOutline,IoDocumentTextOutline,IoHeartOutline,IoPersonOutline } from 'react-icons/io5';
import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
import {isAndroid} from "react-device-detect";
import ReactGA4 from 'react-ga4';
import { CacheContext } from "context";

//------------------------------ CSS ----------------------------------------
const StyledDiv = styled.div`
    display:grid;
    ${(props)=> props.display?'display:none':null};
    width: 80%;
    height:3.5em;
    grid-template-columns: repeat(4, 1fr);
    background:white;
    border-radius: 10em;
    box-shadow: 0px 0px 30px #ddd;
    align-content:center;
    position:fixed;
    margin: 0 auto;
    left: 0;
    right: 0;
    bottom:1%;
    z-index:5;
`;
const StyledSpan = styled.span`
    display:grid;
    width: 100%;
    justify-content:center;
`;
const StyledIcon = styled.span`
    display:grid;
    color:${(props) => props.selected ? "red" : "gray"};
    font-size:1.6em;
`;

//------------------------------ COMPONENT ----------------------------------
const Navigation = React.memo(() => {
    //context
    const { setCacheHandler } = useContext(CacheContext);

    //init
    const { pathname, search } = useLocation();
    const token = localStorage.getItem("token");
    const exception = [
        '/Description',
        '/Login/Phone',
        '/Login/Auth',
        '/Login/Welcome',
        '/Login/Kakao',
        '/MyPage/AddressUpdate',
        '/MyPage/AddressAdd',
        '/Order',
        '/MyPage/PrivateInfoUpdate',
        '/MyPage/PaymentUpdate',
        '/MyPage/PaymentAdd',
        '/MyPage/ReviewAdd',
        '/TossSuccess',
        '/TossFail',
        '/MyPage/MyReview',
        '/GoodsQa',
        '/GoodsQaAdd',
        '/MyPage/MyQa',
        '/MyPage/MyWish',
        '/MyPage/MyCatch',
        '/MyPage/CustomerService',
        '/RawHtml',
        '/SellerInfo',
        '/CompanyInfo',
        '/PhoneUpdate',
        '/MyPage/Settings',
        '/TermsOfUse',
        '/PrivacyPolicy',
        '/PcWindow',
    ];

    //state
    const [display, setDisplay] = useState(0);

    //function
    const inputHide = useCallback(() => {
        const pageInput = document.querySelectorAll('input');
        pageInput.forEach((a) => {
            a.addEventListener('focus', () => {
                setDisplay(1);
            });
            a.addEventListener('blur', () => {
                setDisplay(0);
            });  
        });
    }, []);

    //effect
    useEffect(() => {
        //google analytics send
        ReactGA4.send({hitType: "pageview", path: pathname, location: pathname, title: pathname});

        //to handle android bottom keyboard problem
        if(isAndroid) inputHide();
    }, [pathname, search]);

    //memo
    const navGear = useMemo(() => {
        if(exception.includes(pathname)) return;
        return (
            <>
                <StyledDiv id="webNavigation" display={display}>
                    <StyledSpan>
                        <Link 
                            to="/" 
                            onClick={pathname.startsWith("/Home") 
                                ? (e) => e.preventDefault() 
                                : () => {
                                    /*2023-01-11 added <for reinitiating all list cache> this event precedes navigation event*/
                                    setCacheHandler(new Object);
                                }
                            }
                        >
                            <StyledIcon selected={ pathname.startsWith("/Home") }><IoHomeOutline /></StyledIcon>
                        </Link>    
                    </StyledSpan>
                    <StyledSpan>
                        <Link to="TeamOrder">
                            <StyledIcon selected={ pathname.startsWith("/TeamOrder") }><IoDocumentTextOutline /></StyledIcon>
                        </Link>
                    </StyledSpan>
                    <StyledSpan>
                        <Link to="WishList">
                            <StyledIcon selected={ pathname.startsWith("/WishList") }><IoHeartOutline /></StyledIcon>
                        </Link>
                    </StyledSpan>
                    <StyledSpan>
                        <Link to={token ? "MyPage" : "Login"}>
                            <StyledIcon selected={ pathname.startsWith("/MyPage") || pathname.startsWith("/Login")}><IoPersonOutline /></StyledIcon>
                        </Link>
                    </StyledSpan>                
                </StyledDiv>
            </>
        );
    }, [pathname, display]);

    //render
    return navGear; 
});

export default Navigation;