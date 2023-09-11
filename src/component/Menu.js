//------------------------------ MODULE -------------------------------------
import React, { useContext, useRef, useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { elementScrollIntoView, scrollTo } from 'seamless-scroll-polyfill';
import { BaseContext } from "context";
import { categoryData } from "static";
import { touchSlide } from "lib";

//------------------------------ CSS ----------------------------------------
const StyledMenu = styled.div`
    display:grid;
    overflow-x:auto;
    overflow-y:hidden;
    grid-template-columns: repeat(${(props) => props.listCnt}, 22%);
    &::-webkit-scrollbar {
        display:none;
    }
    ${(props) => props.chkSearch ? 'display:none;' : null}
    height:3.5em;
`;
const StyledMenuList = styled.span`
    display:grid;
    text-align:center;
    -webkit-overflow-scrolling: touch;
    font-size:14px;
    font-weight:bold;
    border-bottom: solid 0.15em ${(props) => props.selected ? "red" : "#f444"};
    align-content:center;
    z-index:4;
    height:97%;
    span {
        color:${(props) => props.selected ? "red" : "gray"};
        cursor:pointer;
    }
`;

//------------------------------ COMPONENT ----------------------------------

const Menu = React.memo(() => {
    //ref
    const menuRef = useRef(null);
    
    //init
    const { pathname }  = useLocation();
    const chkSearch = pathname.endsWith('Search');
    const navigate = useNavigate();    

    //context
    const { base } = useContext(BaseContext);
    const menuCategory = Object.entries(base.useCtg);

    //func
    const executeScroll = useCallback((e) => {
        //menu target
        menuRef.current = e.target;
        elementScrollIntoView(menuRef.current,{behavior: "smooth", block: "center", inline: "center"});
    }, []);

    const itemTopReset = (refreshChk) => { //scroll move to top when menu changed
        const upstreamTarget = document.getElementById(`upstreamTarget`);
        if(refreshChk){ //same menu
            scrollTo(upstreamTarget,{behavior: "smooth", top: 0, left: 0});
        }else{ //different menu
            upstreamTarget.style.overflowY = 'hidden';
            upstreamTarget.scrollTop = 0;
            upstreamTarget.style.overflowY = 'scroll';
        }
    }

    const moveMenu = (target) => { //menu navigate exec
        itemTopReset(pathname == `/Home/${target}`);
        navigate(target);
    }

    //memo
    const menuGear = useMemo(() => {
        return (
        <StyledMenu id="touchSlide" listCnt = {menuCategory.length} chkSearch = {chkSearch}>
            {menuCategory.map((item, index)=>(
                <StyledMenuList 
                    id={item[0]=='all' ? 'homeTarget' : 'categoryTarget'}
                    key={index} 
                    selected={ pathname.endsWith(item[0]=='all'? 'Main' : `List${index}`) } 
                    onClick={executeScroll}
                    ref={ pathname.endsWith(item[0]=='all'? 'Main' : `List${index}`)?menuRef:null}
                >
                    <span onClick={() => moveMenu(item[0]=='all'? 'Main' : `List${index}`)}>
                        {item[0]=='all'? '추천':(categoryData.hasOwnProperty(item[1].info.ctgId) ? categoryData[item[1].info.ctgId].name : item[1].info.title)}
                    </span>                        
                </StyledMenuList>
            ))}        
        </StyledMenu>              
        )
    }, [pathname]);

    //effect
    useEffect(() => {
        if(!chkSearch && menuRef.current) elementScrollIntoView(menuRef.current,{block: "center", inline: "center"});
        touchSlide('touchSlide', 'x');
    },[])

    //render
    return menuGear;
})

export default Menu;