//------------------------------ MODULE -------------------------------------
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Title, StarScore } from "component";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { apiCall, priceForm, onErrorImg } from "lib";

//------------------------------ CSS ----------------------------------------
const StyledMyCatch = styled.div`
    overflow-y:hidden;
    width:100%;
    height:100%;
`;
const StyledContent = styled.div`
    margin-top:3.7em;
    overflow-y:auto;
    height:calc(100% - 6em);
`;
const StyledItem = styled.div`
    text-align:start;
    padding:0.5em;
    cursor:pointer;
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
const MyCatch = () => {
    //init
    const navigate = useNavigate();    

    //state
    const [data, setData] = useState(null);

    //function
    const initData = async() => {
        try {
            //catchedItemData
            const browse = JSON.parse(sessionStorage.getItem('browse'));
            let catchedResult = {data:[]};
            if(browse && browse[0]){
                const params = {
                    dataArr : browse
                }
                catchedResult = await apiCall.get("/goods/any/getArrayOrdered", {params});
            }
            setData(catchedResult.data);
        }catch(e){
            console.log(e);
        }
    }

    //effect
    useEffect(() => {
        initData();
    }, [])

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
                            <StyledItemPrice >{priceForm(item.goodsPrice)}</StyledItemPrice>                        
                            <StarScore nick={`view${item.goodsId}`} score={item.avgScore} size="0.8em" extraInfo={`(${item.cnt})`}/> 
                        </StyledItemInfo>
                    </StyledItem> 
                ))
            ) : <span style={{display:'inline-block', paddingTop: '3em', marginBottom : '1.5em', fontSize : '0.8em', color : '#ccc'}}>조회 내역이 존재하지 않습니다.</span>
        )
    }, [data]);

    //render
    return (
        <StyledMyCatch>
            <Title text='조회 내역'/>
            <StyledContent className={window.self != window.top ? 'iframeScroll' : null}>
                {itemList}
            </StyledContent>
        </StyledMyCatch>
    )
}

export default MyCatch;