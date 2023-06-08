//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { apiCall, priceForm } from "lib";
import React, { useState, useRef, useCallback, useEffect, useContext, useMemo } from 'react';
import { CustomLoading, ItemListLoading, StarScore, SimpleMotion } from "component";
import { useNavigate, useLocation } from "react-router-dom";
import { CacheContext, BaseContext } from "context";
import { elementScrollIntoView } from 'seamless-scroll-polyfill';
import { onErrorImg, useDidMountEffect } from "lib";

//------------------------------ CSS ----------------------------------------
const StyledList = styled.div`
    text-align:center;
`;
const StyledContent = styled.span`
    display:${(props)=> props.block ? 'block' : 'inline-block'};
    width:45%;
    margin:2%;
    vertical-align:top;
    cursor:pointer;
`;
const StyledImg = styled.img`
    width:100%;
    border-radius:0.7em;
`;
const StyledName = styled.div`
    font-size:0.9em;
    text-align:left;
    margin: 0.2em 0;
`;
const StyledTag = styled.div`
    font-size:0.8em;
    text-align:start;
    margin: 0.2em 0;
`;
const StyledPercent = styled.span`
    text-align:start;
    font-weight:500;
`;
const StyledTagPrice = styled.span`
    text-decoration:line-through;
    color:#888;
    text-align:start;
    margin-left:1em;
`;
const StyledPrice = styled.div`
    font-size:1em;
    color:crimson;
    font-weight:500;
    text-align:start;
    margin: 0.2em 0;
`;
const StyledResult = styled.div`
`;
const StyledIsNot = styled.div`
    color:#aaa;
    font-size:0.8em;
    padding-bottom:20%;
    border-bottom:solid 0.5em #eee;    
    padding:10%;
    align-content:center;
`;
const StyledSuggest = styled.div`
    display:grid;
    padding-top:5%;
    color:#aaa;
    font-size:1em;
`;
const StyledSuggestTitle = styled.div`
    display:grid;
    color:black;
    font-size:1em;
    padding-bottom:3%;
`;
const StyledSuggestMsg = styled.div`
    display:grid;
    font-size:0.8em;
    padding-bottom:3%;
`;
const StyledSuggestBtn = styled.a`
    display:grid;
    background:crimson;
    width:85%;
    height:3em;
    justify-self:center;
    border-radius:0.5em;
    align-content:center;
    color:white;
    font-size:0.9em;
`;
const StyledSortBox = styled.div`
    padding:1em 0;
    text-align:start;
`;
const StyledSortOption = styled.span`
    padding:0.4em 0.7em;
    margin-left: 3%;
    border-radius:1em;
    border:solid 0.05em ${(props)=>props.selected ? 'crimson' : '#ddd'};
    color:${(props)=>props.selected ? 'white' : '#999'};
    font-size:0.8em;
    background: ${(props)=>props.selected ? 'crimson' : 'white'};
    cursor:pointer;
`;
/*
const StyledFooterBusinessInfo = styled.div`
    text-align:start;
    padding:6em 2.5em;
    font-size:0.6em;
    background:#f5f5f5;
`;
*/

//------------------------------ COMPONENT ----------------------------------
const ItemList = React.memo(({ category, search, rows=8, loadingCover=false, coverTop=0, selectOpt=null }) => {
    //init
    const observer = useRef();
    const navigate = useNavigate();    
    const { pathname }  = useLocation();
    const lastChk = useRef(false);
    const pageLoading = useRef(false);
    const cacheLoading = useRef(false);
    const sortLoading = useRef(false);

    //context
    const { cache, setCacheHandler } = useContext(CacheContext);
    const { base } = useContext(BaseContext);

    //state
    const [loading, setLoading] = useState(false);
    const [scrollLoading, setScrollLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [goods, setGoods] = useState(null);
    const [sort, setSort] = useState(['regDate', 'desc']);

    //function
    const lastItemElementRef = (node) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            //----INTERSECT THE LAST ITEM IN A PAGE----//
            if (entries[0].isIntersecting) console.log("observing....");
            if (entries[0].isIntersecting && !pageLoading.current && !sortLoading.current) {
                pageLoading.current = true;
                setPage((page) => page+1);
            }
        });
        if (node) observer.current.observe(node);
    }

    const initGoods = async() => {
        //----CASE CACHE CHECKED----//
        if(cache.hasOwnProperty(pathname)){
            console.log('cache is :');
            console.log(cache[pathname]);
            cacheLoading.current = true;
            console.log('cache setting start...');
            setPage(cache[pathname].page);
            setGoods(cache[pathname].goods);
            lastChk.current = cache[pathname].last;
            //setLoading(false);
            return;
        } 

        //----CASE CACHE NOT CHECKED----//
        try {
            setError(null);
            //setGoods([]);
            let params = {
                page : 1,
                rpp : rows,
                geQty : 1, //stock >= 1
                col : sort[0],
                colby : sort[1]                
            }
            if(category) params.ctg = category; //----IS CATEGORY PAGE----//
            if(search){ //----IS SEARCH PAGE----//
                params.srch = search.srch;
                params.kwd = search.kwd;
            }
            if(selectOpt) params = Object.assign(params, selectOpt); //select option

            const result = await apiCall.get("/goods", {params});
            if( result.data.length) setLoading(true);
            setGoods(result.data);
        }catch(e){
            setError(e);
        }
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }

    const addGoods = async() => {
        try {
            let params = {
                page : page,
                rpp : rows,                
                geQty : 1, //stock >= 1    
                col : sort[0],
                colby : sort[1]
            }
            if(category) params.ctg = category; //----IS CATEGORY PAGE----//
            if(search){ //----IS SEARCH PAGE----//
                params.srch = search.srch;
                params.kwd = search.kwd;
            }
            if(selectOpt) params = Object.assign(params, selectOpt); //select option

            const result = await apiCall.get("/goods", {params});
            if(!result.data.length){ //----IS THE LAST INDEX IN ITEM DATAS----//
                lastChk.current = true;
                console.log('lastChked');
            } 
            setGoods([...goods, ...result.data]);
        }catch(e){
            setError(e);
        }
    }

    const sortGoods = async(option, colby) => {
        try {
            setError(null);
            let params = {
                page : 1,
                rpp : rows,
                geQty : 1, //stock >= 1
                col : option,
                colby : colby
            }
            if(category) params.ctg = category; //----IS CATEGORY PAGE----//
            if(search){ //----IS SEARCH PAGE----//
                params.srch = search.srch;
                params.kwd = search.kwd;
            }
            if(selectOpt) params = Object.assign(params, selectOpt); //select option

            const result = await apiCall.get("/goods", {params});
            //if( result.data.length) setLoading(true);
            setGoods(result.data);
            console.log(`query order by ${option} ${colby}`);
            console.log(result.data);
        }catch(e){
            setError(e);
        }
    }

    const moveDesc = useCallback((index, id) => {
        //----SAVE SCROLL CACHE----//
        const cacheData = cache;
        cacheData[pathname].scrollIndex = index;
        cacheData[pathname].sort = sort;
        setCacheHandler(cacheData);
        console.log(`set scroll ${index} to ${pathname}`);
        console.log(`set sort ${sort[0]} / ${sort[1]} to ${pathname}`);
        navigate('/Description', { state: { id: id } });
    }, [pathname, sort]);

    const updateCache = useCallback(() => {
        const cacheData = cache;
        if(!cacheData.hasOwnProperty(pathname)) cacheData[pathname] = new Object;
        cacheData[pathname] = {goods : goods, page: page, last:lastChk.current, scrollIndex:0, sort:sort};
        setCacheHandler(cacheData);
        console.log('save cache :');
        console.log(cacheData);
    }, [goods, page, pathname, sort]);

    const sortExec = (option, colby='desc') => {
        if(!goods || !goods.length) return setSort([option, colby]);

        //init
        setPage(1);
        sortLoading.current = true;
        lastChk.current = false;
        pageLoading.current = false;

        //call goods data
        sortGoods(option, colby);

        //sort set
        setSort([option, colby]);
    };

    //effect
    useEffect(() => {
        console.log('ITEM LIST START!!');

        setPage(1);
        lastChk.current = false;
        pageLoading.current = false;
        initGoods();   
    }, [pathname, search]);

    useEffect(() => {
        if(lastChk.current || page==1 || !pageLoading.current || cacheLoading.current) return;
        console.log('adding goods');
        console.log(page);
        addGoods();
    }, [page]);    

    useEffect(() => {
        if(!goods) return;
        if(!goods.length){
            console.log('set default sort');
            return setSort(['regDate', 'desc']);
        } 
        if(pageLoading.current){ //case add goods
            updateCache(); 
            console.log('goods added');
            console.log(`page : ${page}`);
            pageLoading.current = false;
            return;
        }
        if(sortLoading.current){//case sort goods
            updateCache(); 
            console.log('goods sorted');
            sortLoading.current = false;
            return;
        }
        if(cacheLoading.current){ //case cache set
            console.log('cache sort : ');
            console.log(cache[pathname].sort);
            setSort([cache[pathname].sort[0], cache[pathname].sort[1]]); //sort cache

            console.log('cache scroll : ');
            console.log(cache[pathname].scrollIndex);

            //----MOVE TO SCROLL TARGET----//
            
            if(cache[pathname].scrollIndex > 1 ){
                setScrollLoading(true);
                setTimeout(() => setScrollLoading(false), 500);
            }
            if(cache[pathname].scrollIndex) elementScrollIntoView(document.getElementById(`target${cache[pathname].scrollIndex}`),{behavior: "smooth", block: "end", inline: "center"});  
            
            console.log(`scroll TO target${cache[pathname].scrollIndex}`);
            const cacheData = cache;
            cacheData[pathname].scrollIndex = 0;
            setCacheHandler(cacheData);
            cacheLoading.current = false;            
            console.log(`set scroll ${cache[pathname].scrollIndex}`);
            console.log('cache setting end!');
            return; 
        }else{ //case initiation
            console.log('set default sort');
            setSort(['regDate', 'desc']); //if not cache -> sort option : 'regDate'
        }
        updateCache(); 
        console.log('goods changed');
    }, [goods]);        

    useEffect(() => { //move scroll top if search keyword changes
        const targetZero = document.getElementById(`target0`);
        if(targetZero) setTimeout(() => elementScrollIntoView(targetZero,{block: "end", inline: "center"}), 300); //set scroll after loading (time : 500)
    }, [search]);

    useDidMountEffect(() => { //inject sort cache
        console.log(`sort changed to ${sort[0]} / ${sort[1]}`);
        console.log('try to save sort cache');
        const cacheData = cache;
        if(!cacheData.hasOwnProperty(pathname)) return;
        cacheData[pathname].sort = sort;
        setCacheHandler(cacheData);
        console.log(`set sort cache to ${sort[0]} / ${sort[1]}`);
    }, [sort]);

    //memo
    const goodsGear = useMemo(() => {
        if(!goods) return;
        return(
        <StyledList id="itemWindow">      
            {goods.map((item, index)=>(                
                <StyledContent 
                    data-id = {item.goodsId}
                    id={`target${index}`} 
                    key={index} onClick = {() => moveDesc(index, item.goodsId)} 
                    block={index%2 == 0 && index == goods.length-1 ? true : false} 
                >
                    <SimpleMotion>
                        <StyledImg src ={`${process.env.REACT_APP_SERVER_URL}/${item.timg1}`} onError={onErrorImg}/>                            
                        <StyledName>{item.goodsName}</StyledName>
                        <StyledTag>
                            <StyledPercent>{Math.round(100-item.goodsPrice/item.consumerPrice*100)}%</StyledPercent>
                            <StyledTagPrice>{priceForm(item.consumerPrice)}</StyledTagPrice>
                        </StyledTag>
                        <StyledPrice ref={index==goods.length-1 ? lastItemElementRef : null}>{priceForm(item.goodsPrice)}</StyledPrice>                        
                        <StarScore nick={`g${item.goodsId}`} score={item.avgScore} size="0.8em" extraInfo={`(${item.cnt})`}/> 
                    </SimpleMotion>
                </StyledContent> 
            ))}      
        </StyledList>
        )
    }, [goods, sort]);

    const nthGear = useMemo(() => {
        return (
            <StyledResult>
            <StyledIsNot>해당 검색 결과가 없습니다.</StyledIsNot>
            <StyledSuggest>
                <StyledSuggestTitle>찾으시는 상품이 없으신가요?</StyledSuggestTitle>
                <StyledSuggestMsg>상품 제안을 통해 원하는 상품을 직접 올딜에 <br />입점시켜 보세요!</StyledSuggestMsg>
                <StyledSuggestBtn href='http://seller.customdx.kr/Join'>상품 제안하기</StyledSuggestBtn>
            </StyledSuggest>
            </StyledResult>
        )
    }, [])

    const lastGear = useMemo(() => {
        /*
        return (lastChk.current) ? (
            <StyledFooterBusinessInfo>
                법인명 : {base.companyName} <br/>
                대표자 : {base.companyOwner} <br/>
                사업자 등록번호 : {base.saupjaNo} <br/>
                통신판매업 신고번호 : {base.tolsinNo} <br/>
                주소 : {base.companyAddr} <br/>
                이메일 : {base.companyEmail} <br/>
                Copyright©{base.shopId} Corp.All right reserved.<br />
                <br />
                <br />
                <br />                
            </StyledFooterBusinessInfo>                        
        ) : null;
        */

        return (
            (lastChk.current) ? 
            <div style={{'fontSize':'0.7em', 'color':'#bbb', 'marginTop':'30px'}}>마지막 상품입니다.</div> : 
            null
        )
    }, [lastChk.current])    
    
    const sortGear = useMemo(() => {
        return(
            <StyledSortBox>
                <StyledSortOption onClick={() => sortExec('regDate')} selected={sort[0]=='regDate'}>최신순</StyledSortOption>
                <StyledSortOption onClick={() => sortExec('orderQty')} selected={sort[0]=='orderQty'}>주문 많은순</StyledSortOption>
                <StyledSortOption onClick={() => sortExec('viewCnt')} selected={sort[0]=='viewCnt'}>조회순</StyledSortOption>
                <StyledSortOption onClick={() => sortExec(`goodsPrice${base.shopGrade}`, 'asc')} selected={sort[0]==`goodsPrice${base.shopGrade}`}>낮은 가격순</StyledSortOption>
            </StyledSortBox>
        )
    }, [sort, goods]);

    //render
    return (
        <div style={{position:"relative"}}>  
            {scrollLoading ? <CustomLoading opacity={0.5} cover={loadingCover} coverTop={coverTop}/> : null}
            {/*loading ? <ItemListLoading /> : null*/}
            {sortGear}
            {goods && goods.length > 0 ? goodsGear : null} 
            {goods && goods.length < 1 && !cache.hasOwnProperty(pathname) ? nthGear : null} 
            {lastGear}
        </div>
    )

});

export default ItemList;

