//------------------------------ MODULE -------------------------------------
import React, { useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { apiCall, onErrorImg } from "lib";
import { useNavigate } from "react-router-dom";

//------------------------------ CSS ----------------------------------------

const StyledReviewOrder = styled.div`
    width: 100%;
    padding-bottom: 15em;
`;
const StyledOrder = styled.div`
    margin-bottom: 0.6em;
    background: white;
    padding: 0.3em 1em 0px;
`;
const StyledOrderInfo = styled.div`
    cursor:pointer;
`;
const StyledOrderImg = styled.span`
    display: inline-block;
    text-align: start;
    width: 25%;
    vertical-align: middle;
    img{
        border-radius: 0.3em;
        width: 4.5em !important;
    }
`;
const StyledOrderText = styled.span`
    display: inline-block;
    vertical-align: middle;
    width: 75%;
    text-align: start;
    div{
        text-align: start;
        margin-bottom: 0.2em;
    }
`;
const StyledOrderGoodsName = styled.div`
    font-size: 0.9em;
    border-bottom: 0.05em solid rgb(238, 238, 238);
    padding: 0.3em 0px;
`;
const StyledOrderReg = styled.div`
    font-size: 0.8em;
    padding: 0.5em 0px;
`;
const StyledReviewBtnArea = styled.div`
    padding: 0.5em 0px;
`;
const StyledReviewBtn = styled.div`
    font-size: 0.9em;
    width: 100%;
    margin: auto;
    border-radius: 0.5em;
    border: 0.05em solid crimson;
    color: crimson;
    height: 2em;
    line-height: 2em;
    cursor:pointer;
`;


//------------------------------ COMPONENT ----------------------------------
const ReviewOrder = ({limit, bridgeChk}) => {
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
                self : true, 
                rpp : limit,
                page : page,
                state : 14,
                review : 'n',
            }
            const result = await apiCall.get("/order", {params});
            if(result.data.result == 'success'){ setData(result.data.data) } 
        }catch(e){
            console.log(e);
        }
    }

    const addData = async() => {
        try {
            const params = {
                self : true, 
                rpp : limit,
                page : page,
                state : 14,
                review : 'n',
            }
            const result = await apiCall.get("/order", {params});
            if(result.data.result == 'success'){
                if(!result.data.data.length){ //----IS THE LAST INDEX IN ITEM DATAS----//
                    return lastChk.current = true;
                } 
                setData([...data, ...result.data.data]);
            } 
        }catch(e){
            console.log(e);
        }
        setPageLoading(false);
    }    

    const addDeleted = async(deleted) => {
        const result = await apiCall.get(`/order/${deleted}`);
        if(result.data.res == 'success') setData([result.data.data, ...data]);
    };

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
    }, []);

    useEffect(() => {
        if(page > 1) addData();
    }, [page]); 

    useEffect(() => {
        if(!bridgeChk) return;
        addDeleted(bridgeChk);
    }, [bridgeChk]); 

    //memo
    const OrderGear = useMemo(() => {
        if(!data) return null;
        return data.length ? (            
            data.map((item, index) => (
                <StyledOrder key={index}>
                    <StyledOrderInfo onClick = {() => navigate('/Description', { state: { id: item.goodsInfo.goodsId } })}>
                        <StyledOrderImg><img src ={`${process.env.REACT_APP_SERVER_URL}/${item.goodsInfo.timg1}`} onError={onErrorImg} /></StyledOrderImg>
                        <StyledOrderText>
                            <StyledOrderGoodsName>{item.goodsInfo.goodsName}</StyledOrderGoodsName>
                            <StyledOrderReg>{item.orderDate.substr(0, 10)} 주문 완료</StyledOrderReg>
                        </StyledOrderText>
                    </StyledOrderInfo>
                    <StyledReviewBtnArea ref={index==data.length-1 ? lastItemElementRef : null}>
                        <StyledReviewBtn onClick={() => navigate('/MyPage/ReviewAdd', { state: { order: item, mode: 'add' } })}>구매 후기 작성하기</StyledReviewBtn>
                    </StyledReviewBtnArea>
                </StyledOrder>
            ))
        ) : <span style={{display:'inline-block', paddingTop: '3em', marginBottom : '1.5em', fontSize : '0.8em', color : '#ccc'}}>완료된 주문 건이 없습니다.</span>;
    }, [data])

    //render
    return(
        <StyledReviewOrder>
            {OrderGear}
        </StyledReviewOrder>
    )    
}

export default ReviewOrder;