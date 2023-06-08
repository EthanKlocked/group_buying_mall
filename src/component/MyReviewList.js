//------------------------------ MODULE -------------------------------------
import React, { useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { StarScore } from "component";
import { apiCall, onErrorImg, nameCut } from "lib";
import { useNavigate } from "react-router-dom";

//------------------------------ CSS ----------------------------------------
const StyledReview = styled.div`
    width:100%;
    padding-bottom:10em;
`;
const StyledItemInfo = styled.div`
    margin-bottom:0.6em;
    background:white;
    padding:1em;
    padding-top:0.5em;
`;
const StyledOrderInfo = styled.div`
    text-align:start;
    padding: 0.4em 0;
    border-bottom:0.05em solid #eee;
    cursor:pointer;
`;
const StyledOrderImg = styled.span`
    display:inline-block;
    text-align:start;
    width:25%;
    vertical-align:middle;
    img{
        width:4.5em !important;
        border-radius:0.3em;
    }
`;
const StyledOrderText = styled.span`
    display:inline-block;
    vertical-align:middle;
    width:75%;
    text-align:start;
    div{
        text-align:start;
        margin-bottom:0.2em;
    }
`;
const StyledOrderName = styled.div`
    font-size:0.9em;
    border-bottom:0.05em solid #eee;
    padding: 0.3em 0;
`;
const StyledOrderComment = styled.div`
    font-size:0.8em;
    padding: 0.5em 0;
`;
const StyledReviewInfo = styled.div`
`;
const StyledReviewInfoStar = styled.div`

`;
const StyledReviewInfoImg = styled.div`
    text-align:start;
    padding-top:1em;
    img{
        cursor:pointer;
        margin-right:0.5em;
        width:30%;
        border-radius:0.3em;
    }
`;
const StyledReviewInfoText = styled.p`
    color:#555;
    font-size:0.8em;
    vertical-align:top;
    text-align:start;
    white-space: pre-wrap;
    word-break: break-all;
    padding-top:1em;
`;
const StyledGoodsOption = styled.div`
    font-size:0.7em;
    color:#aaa;
    text-align:start;
`;
const StyledReviewControl = styled.div`
    font-size:0.8em;
    color:#999;
    text-align:start;
    padding-top:1em;
`;
const StyledReviewLike = styled.span`
    visibility:hidden;
`;
const StyledReviewUpdate = styled.span`
    float:right;
    margin-right:0.8em;
    cursor:pointer;
`;
const StyledReviewDelete = styled.span`
    float:right;
    cursor:pointer;
`;

//------------------------------ COMPONENT ----------------------------------
const MyReviewList = ({limit, wideImg, confirmHandler, bridgeHandler}) => {
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
                rpp : limit,
                page : page,
                type : 'self'
            }
            const result = await apiCall.get("/review", {params});
            if(result.data.res == 'success'){ setData(result.data.data) } 
        }catch(e){
            console.log(e);
        }
    }

    const addData = async() => {
        try {
            const params = {
                rpp : limit,
                page : page,
                type : 'self'
            }
            const result = await apiCall.get("/review", {params});
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

    const setImgOrder = (firstOne, imgArr) => {
        let newArr = imgArr.filter((el, i) => el && i!=firstOne);
        newArr.unshift(imgArr[firstOne]);
        wideImg(newArr);
    }

    const confirmControl = (rId, dataIndex, orderId, goodsId) => {
        const deleteMethod = async() => {
            const params = { targetGoods : goodsId};
            const result = await apiCall.delete(`/review/${rId}`, {params});
            if(result.data == 'success'){
                const copiedData = [...data];
                copiedData.splice(dataIndex, 1);
                setData(copiedData);
                bridgeHandler(orderId);
            }
        }
        const confirmObj = {title : '후기 삭제 안내', desc : "reviewDeleteConfirm", exec : deleteMethod}
        confirmHandler(confirmObj);
    }

    //effect
    useEffect(() => {
        initData();
    }, []);

    useEffect(() => {
        if(page > 1) addData();
    }, [page]); 

    //memo
    const ReviewGear = useMemo(() => {
        if(!data) return null;
        return data.length ? (            
            data.map((item, index) => (
                <StyledItemInfo key={index} lenChk={data.length-1 == index}>
                    <StyledOrderInfo onClick = {() => navigate('/Description', { state: { id: item.goods.goodsId } })}>
                        <StyledOrderImg>
                            <img src ={`${process.env.REACT_APP_SERVER_URL}/${item.goods.timg1}`} onError={onErrorImg} />
                        </StyledOrderImg>
                        <StyledOrderText>
                            <StyledOrderName>{nameCut(item.goods.goodsName, 35)}</StyledOrderName>
                            <StyledOrderComment>{item.order.orderDate.substr(0, 10)} 주문 완료</StyledOrderComment>
                        </StyledOrderText>
                    </StyledOrderInfo>
                    <StyledReviewInfo>
                        <StyledReviewInfoStar>
                            <StarScore nick={item.reviewId} score={item.ratingAvg} extraInfo={item.regdate.substr(0, 10)}/>
                        </StyledReviewInfoStar>
                        <StyledGoodsOption>옵션: {item.goodsOptName}</StyledGoodsOption>
                        <StyledReviewInfoImg>
                            {
                                item.imgArr.map((imgItem, imgIndex) => (
                                    imgItem ? <img key={imgIndex} src={imgItem} onClick={() => setImgOrder(imgIndex, item.imgArr)} /> : null                                                                            
                                ))
                            }                            
                        </StyledReviewInfoImg>
                        <StyledReviewInfoText ref={index==data.length-1 ? lastItemElementRef : null}>{item.content}</StyledReviewInfoText>
                    </StyledReviewInfo>
                    <StyledReviewControl>
                        <StyledReviewLike>0명에게 도움이 되었어요</StyledReviewLike>
                        <StyledReviewDelete onClick={() => confirmControl(item.reviewId, index, item.odId, item.goods.goodsId)}>삭제하기</StyledReviewDelete>
                        <StyledReviewUpdate onClick={() => navigate('/MyPage/ReviewAdd', { state: { review: item, mode: 'update' } })}>수정하기</StyledReviewUpdate>
                    </StyledReviewControl>
                </StyledItemInfo>
            ))
        ) : <span style={{display:'inline-block', paddingTop: '3em', marginBottom : '1.5em', fontSize : '0.8em', color : '#ccc'}}>등록된 후기가 없습니다.</span>;
    }, [data])

    //render
    return(
        <StyledReview>
            {ReviewGear}
        </StyledReview>
    )    
}

export default MyReviewList;