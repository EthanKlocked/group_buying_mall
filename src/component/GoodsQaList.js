//------------------------------ MODULE -------------------------------------
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { apiCall } from "lib";

//------------------------------ CSS ----------------------------------------
const StyledQaList = styled.div`
`;
const StyledQaItem = styled.div`
    padding:0 1em;
`;
const StyledQaQuestion = styled.p`
    color:#555;
    font-size:0.95em;
    vertical-align:top;
    text-align:start;
    white-space: pre-wrap;
    word-break: break-all;
    padding:1em 0;
    border-bottom:solid 0.05em #eee;
`;
const StyledQaAnswer = styled.p`
    color:#aaa;
    font-size:0.95em;
    vertical-align:top;
    text-align:start;
    white-space: pre-wrap;
    word-break: break-all;
    padding:1em 0;
    border-bottom:solid 0.05em #eee;
`;

//------------------------------ COMPONENT ----------------------------------
const GoodsQaList = ({goodsId, limit}) => {
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
                goodsId : goodsId, 
                rpp : limit,
                page : page,
            }
            const result = await apiCall.get("/qa", {params});
            console.log(result);
            if(result.data.res == 'success'){ setData(result.data.data) } 
        }catch(e){
            console.log(e);
        }
    }

    const addData = async() => {
        try {
            const params = {
                goodsId : goodsId, 
                answerYn : 'y',
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
                            <StyledQaQuestion>
                                Q. {item.gs_qa_content}
                            </StyledQaQuestion>
                            <StyledQaAnswer ref={index==data.length-1 ? lastItemElementRef : null}>
                                A. {item.gs_qa_answer || "답변을 기다리는 중 입니다."}
                            </StyledQaAnswer>
                        </StyledQaItem>
                    )) : <span style={{display:'inline-block', paddingTop: '3em', marginBottom : '1.5em', fontSize : '0.8em', color : '#ccc'}}>등록된 상품문의가 없습니다.</span>
                ) : null
            }        
        </StyledQaList>
    );
}

export default GoodsQaList;