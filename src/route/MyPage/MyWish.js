//------------------------------ MODULE -------------------------------------
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Title, StarScore } from "component";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { apiCall, priceForm, onErrorImg } from "lib";

//------------------------------ CSS ----------------------------------------
const StyledMyWish = styled.div`
    overflow-y:hidden;
    width:100%;
    height:100%;
`;
const StyledContent = styled.div`
    padding-top:4.5em;
    overflow-y:auto;
    height:calc(100% - 6em);
`;
const StyledItem = styled.div`
    text-align:start;
    padding:0.5em;
`;
const StyledItemImg = styled.span`
    display:inline-block;
    width:30%;
    img{
        width:100%;
    }
`;
const StyledItemInfo = styled.span`
    display:inline-block;
    width:65%;
    margin-left:3%;
    vertical-align:top;
`;
const StyledItemName = styled.div`
    text-align:start;
    font-size:0.7em;
    margin-bottom:0.2em;
`;
const StyledItemTag = styled.div`
    text-align:start;
    font-size:0.8em;
    margin-bottom:0.2em;
`;
const StyledPercent = styled.span`
    text-align:start;
    font-weight:bold;
`;  
const StyledTagPrice = styled.span`
    margin-left:2em;
    text-decoration:line-through;
    text-align:start;
    color:#888;
`;
const StyledItemPrice = styled.div`
    text-align:start;
    font-size:0.9em;
    color:crimson;
    font-weight:500;
    padding-bottom:0.2em;
`;

//------------------------------ COMPONENT ----------------------------------
const MyWish = () => {
    //init
    const navigate = useNavigate();    

    //ref
    const observer = useRef();
    const lastChk = useRef(false);

    //state
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [pageLoading, setPageLoading] = useState(false);

    //function
    const initData = async() => {
        try {
            const params = {
                rpp : 8,
                page : page,
            }
            const wishResult = await apiCall.get("/goods/any/wishList", {params});
            if(wishResult.data) setData(wishResult.data);
        }catch(e){
            console.log(e);
        }
    }

    const addData = async() => {
        try {
            const params = {
                rpp : 8,
                page : page,
            }
            const wishResult = await apiCall.get("/goods/any/wishList", {params});
            if(wishResult.data){
                if(!wishResult.data.length){ //----IS THE LAST INDEX IN ITEM DATAS----//
                    return lastChk.current = true;
                } 
                setData([...data, ...wishResult.data]);
            } 
        }catch(e){
            console.log(e);
        }
        setPageLoading(false);
    }    

    const lastItemElementRef = (node) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => { 
            //----INTERSECT THE LAST ITEM IN A PAGE----//
            if (entries[0].isIntersecting && !pageLoading && !lastChk.current) {
                setPageLoading(true);
                setPage((page) => page+1);
            }
        });
        if (node) observer.current.observe(node);
    }

    //effect
    useEffect(() => {
        initData();
    }, [])

    useEffect(() => {
        if(page > 1) addData();
    }, [page]); 

    //memo
    const itemList = useMemo(() => {
        if(!data) return null;
        return (
            data.length ? (
                data.map((item, index)=>(                
                    <StyledItem 
                        key={index} 
                        onClick = {() => navigate('/Description', { state: { id: item.goodsId } })}
                        block={index%2 == 0 && index == data.length-1 ? true : false} 
                    >
                        <StyledItemImg>
                            <img src ={`${process.env.REACT_APP_SERVER_URL}/${item.timg1}`} onError={onErrorImg} />
                        </StyledItemImg>                            
                        <StyledItemInfo>
                            <StyledItemName>{item.goodsName}</StyledItemName>
                            <StyledItemTag>
                                <StyledPercent>{Math.round(100-item.goodsPrice/item.consumerPrice*100)}%</StyledPercent>
                                <StyledTagPrice>{priceForm(item.consumerPrice)}</StyledTagPrice>
                            </StyledItemTag>
                            <StyledItemPrice ref={index==data.length-1 ? lastItemElementRef : null}>{priceForm(item.goodsPrice)}</StyledItemPrice>                        
                            <StarScore nick={`view${item.goodsId}`} score={item.avgScore} size="0.8em" extraInfo={`(${item.cnt})`}/> 
                        </StyledItemInfo>
                    </StyledItem> 
                ))
            ) : <span style={{display:'inline-block', paddingTop: '3em', marginBottom : '1.5em', fontSize : '0.8em', color : '#ccc'}}>찜한 상품이 존재하지 않습니다.</span>
        )
    }, [data]);

    //render
    return (
        <StyledMyWish>
            <Title text='찜한 상품'/>
            <StyledContent>
                {itemList}
            </StyledContent>
        </StyledMyWish>
    )
}

export default MyWish;