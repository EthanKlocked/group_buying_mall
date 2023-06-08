//------------------------------ MODULE -------------------------------------
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { apiCall, onErrorImg } from "lib";
import { useNavigate } from "react-router-dom";

//------------------------------ CSS ----------------------------------------
const StyledQaList = styled.div`
`;
const StyledQaItem = styled.div`
    padding:0 1em;
    border-bottom:solid #f5f5f5 0.5em;
`;
const StyledGoods = styled.div`
    border-bottom:solid 0.05em #eee;
    text-align:start;
    padding:1em 0;
    cursor:pointer;
`;
const StyledGoodsImg = styled.span`
    display:inline-block;
    width: 25%;
    img{
        width:100%;
        border-radius:0.3em;
    }
`;
const StyledGoodsText = styled.span`
    display:inline-block;
    margin-left:5%;
    width: 70%;
    vertical-align:top;
    text-align:start;
`;
const StyledTitle = styled.div`
    font-weight:bold;
    text-align:start;
    padding-top:0.5em;
    font-size:0.9em;
`;
const StyledRegdate = styled.span`
    padding-top:1em;
    text-align:start;
    display:block;
    font-size:0.85em;
`;
const StyledQaQuestion = styled.p`
    color:#555;
    line-height:2em;
    font-size:0.8em;
    vertical-align:top;
    text-align:start;
    white-space: pre-wrap;
    word-break: break-all;
    padding:1em 0;
    border-bottom:solid 0.05em #eee;
`;
const StyledQaAnswer = styled.p`
    color:#555;
    line-height:2em;
    font-size:0.8em;
    vertical-align:top;
    text-align:start;
    white-space: pre-wrap;
    word-break: break-all;
    padding:1em 0;
    border-bottom:solid 0.05em #eee;
`;

//------------------------------ COMPONENT ----------------------------------
const MyQaList = ({memberId, limit}) => {
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
                userId : memberId, 
                rpp : limit,
                page : page,
            }
            const result = await apiCall.get("/qa", {params});
            if(result.data.res == 'success'){ setData(result.data.data) } 
        }catch(e){
            console.log(e);
        }
    }

    const addData = async() => {
        try {
            const params = {
                userId : memberId, 
                rpp : limit,
                page : page,
            }
            const result = await apiCall.get("/qa", {params});
            if(result.data.res == 'success'){
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

    //render
    return(
        <StyledQaList>
            {
                data ? 
                (
                    data.length ? data.map((item, index) => (
                        <StyledQaItem key={index}>
                            <StyledGoods onClick = {() => navigate('/Description', { state: { id: item.goodsInfo.goodsId } })}>
                                <StyledGoodsImg>
                                    <img src ={`${process.env.REACT_APP_SERVER_URL}/${item.goodsInfo.timg1}`} onError={onErrorImg}/>
                                </StyledGoodsImg>
                                <StyledGoodsText>
                                    {item.goodsInfo.goodsName}
                                </StyledGoodsText>
                            </StyledGoods>

                            <StyledTitle>문의내용</StyledTitle>
                            <StyledQaQuestion>
                                {item.gs_qa_content}
                                <StyledRegdate>{item.gs_qa_reg_dt}</StyledRegdate>
                            </StyledQaQuestion>
                            {
                                item.gs_qa_answer ? (
                                    <>
                                    <StyledTitle>답변내용</StyledTitle>
                                    <StyledQaAnswer ref={index==data.length-1 ? lastItemElementRef : null}>
                                        {item.gs_qa_answer}
                                        <StyledRegdate>{item.gs_qa_answer_dt}</StyledRegdate>
                                    </StyledQaAnswer>
                                    </>
                                ) : <div style={{color:'#aaa', fontSize:'0.8em', textAlign:'start', padding:'1em 0' }}>답변을 기다리고 있습니다.</div>

                            }
                            
                        </StyledQaItem>
                    )) : <span style={{display:'inline-block', paddingTop: '3em', marginBottom : '1.5em', fontSize : '0.8em', color : '#ccc'}}>등록된 상품문의가 없습니다.</span>
                ) : null
            }        
        </StyledQaList>
    );
}

export default MyQaList;