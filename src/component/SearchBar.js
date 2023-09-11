//------------------------------ MODULE -------------------------------------
import React, { useState, useContext, useCallback, useMemo } from 'react';
import { SrchContext, CacheContext } from 'context';
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FiSearch, FiX } from "react-icons/fi";
import { useEffect } from 'react';

//------------------------------ CSS ----------------------------------------
const StyledSearchBox = styled.div`        
    display:grid;
    border-radius: 0.5em;    
    grid-template-columns: 1fr 10fr 1fr;
    justify-content:center;
    align-content:center;
    padding:0 0.4em;
    margin-left:0.5em;
    background:#eee;
    font-size:1.2em;
    color:#777;
    height:2.1em;
    width:${(props) => props.animate ? "115%" : "92%"};
    justify-self:right;
    transition: width 0.5s;
    svg{
        font-size:1.2em;    
        margin-right:0.2em;
    }
`;
const StyledInput = styled.input`        
    background:#eee;
    width:100%;
    font-size:0.8em;
    ::placeholder{
        color:#aaa;
    }
`;

//------------------------------ COMPONENT ----------------------------------
const SearchBar = React.memo(() => {
    //init
    const navigate = useNavigate();
    const { pathname }  = useLocation();

    //context
    const { setSrchHandler } = useContext(SrchContext);
    const { cache, setCacheHandler } = useContext(CacheContext);

    //state
    const [keyword, setKeyword] = useState('');
    const [searchBarTrans, setSearchBarTrans] = useState(false);

    //func
    const searchExec = useCallback(async() => {
        //clean
        const cacheData = cache;
        if(cacheData.hasOwnProperty('/Home/Search')) delete cacheData['/Home/Search'];
        setCacheHandler(cacheData);

        //set
        setSrchHandler({srch : 'name', kwd : keyword});
    }, [keyword]);

    const searchEnter = useCallback((e) => {
        if(e.key=="Enter") searchExec();
    },[keyword]);

    const searchClick = useCallback(() => { //open search page
        setSearchBarTrans(true);
        navigate('Search');
    },[]);

    //effect
    useEffect(() => {
        if(pathname == "/Home/Search") setSearchBarTrans(true);
    }, []);

    useEffect(() => {
        if(pathname == "/Home/Main" && searchBarTrans) {
            setSearchBarTrans(false);
            if(keyword) setKeyword("");
        }
    }, [pathname]);

    //memo
    const searchGear = useMemo(() => {
        return (
            <>                
                <StyledInput 
                    id="srchTextInput"
                    value={keyword} 
                    placeholder="상품을 검색 해 보세요." 
                    onKeyPress = {searchEnter} 
                    onClick={searchClick} 
                    onChange = {(e) => setKeyword(e.target.value)}
                    autoComplete="off"
                />
                {
                    keyword?
                    <FiX 
                        style={{
                            borderRadius: "50%",
                            color: "white",
                            background: "#888",
                            fontSize: "0.9em",
                            margin: "auto",
                            padding: "0.1em",
                            cursor:"pointer"
                        }} 
                        onClick = {() => setKeyword('')}
                    /> :
                    null
                }
            </>
        );     
    }, [keyword]);

    //render
    return (
        <StyledSearchBox animate={searchBarTrans}>
            <FiSearch onClick = {searchExec} style={{cursor:"pointer"}}/>
            {searchGear}
        </StyledSearchBox>
    );
});

export default SearchBar;