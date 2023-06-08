//------------------------------ MODULE -------------------------------------
import React, { useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { StarScore } from "component";
import { apiCall, timeDiffer, onErrorImg, nameCut, priceForm } from "lib";
import { BsStarFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

//------------------------------ CSS ----------------------------------------

const StyledReview = styled.div`
    width:100%;
    padding-bottom:10em;
`;
const StyledItemInfo = styled.div`
    border-bottom:${(props) => !props.lenChk ? 'solid 0.6em #f5f5f5' : 'none'};
    padding:1em;
`;
const StyledProfileInfo = styled.div`
    text-align:start;
`;
const StyledProfileImg = styled.span`
    display:inline-block;
    width:1.5em !important;
    height:1.5em !important;
    border-radius:50% !important;
    overflow:hidden;
    vertical-align:middle !important;
    img{
        width:100%;
        height:100%;
        object-fit:cover;                
    }
`;
const StyledProfileName = styled.span`
    margin-left:0.5em;
    font-size:0.8em;
`;

const StyledProfileTime = styled.span`
    margin-left:1em;
    font-size:0.8em;
    color:#aaa;
`;

const StyledGoodsInfo = styled.div`
    text-align:start;
    padding: 0.5em 0;
    cursor:pointer;
`;
const StyledGoodsImg = styled.span`
    display:inline-block;
    text-align:start;
    width:30%;
    vertical-align:middle;
    img{
        width:6em !important;
        border-radius:0.3em;
    }
`;
const StyledGoodsText = styled.span`
    display:inline-block;
    vertical-align:middle;
    width:70%;
    text-align:start;
    div{
        text-align:start;
        margin-bottom:0.2em;
    }
`;
const StyledGoodsName = styled.div`
    font-size:0.9em;
`;
const StyledGoodsPrice = styled.div`
    font-size:0.8em;
    text-decoration:line-through;
    color:#888;
`;
const StyledGoodsRealPrice = styled.div`
    color:crimson;
    font-weight:bold;
`;
const StyledGoodsReview = styled.div`
    font-size:0.8em;
    span{
        padding-right:0.2em;
    }
`;
const StyledGoodsReviewIcon = styled.span`
    svg{
        vertical-align:middle;
    }
`;
const StyledGoodsReviewScore = styled.span`
    color:#888;
    font-weight:bold;
    vertical-align:middle;
`;
const StyledGoodsReviewScoreCnt = styled.span`
    color:#888;
    vertical-align:middle;
`;
const StyledGoodsCnt = styled.div`
    font-size:0.8em;
    color:#aaa;
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

//------------------------------ COMPONENT ----------------------------------
const ReviewList = ({limit, dayCnt, wideImg}) => {
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
                recent : dayCnt
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
                recent : dayCnt
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

    //effect
    useEffect(() => {
        initData();
    }, []);

    useEffect(() => {
        if(page > 1) addData();
    }, [page]); 

    //memo
    const goodsReviewGear = useMemo(() => {
        if(!data) return null;
        return data.length ? (            
            data.map((item, index) => (
                <StyledItemInfo key={index} lenChk={data.length-1 == index}>
                    <StyledProfileInfo>
                        <StyledProfileImg><img src={item.memberInfo.img} /></StyledProfileImg>
                        <StyledProfileName>{item.memberInfo.name}</StyledProfileName>                        
                        <StyledProfileTime>{timeDiffer(new Date(item.regdate.replace(/-/g, '/')), new Date)}</StyledProfileTime>
                    </StyledProfileInfo>
                    <StyledGoodsInfo onClick = {() => navigate('/Description', { state: { id: item.goods.goodsId } })}>
                        <StyledGoodsImg>
                            <img src ={`${process.env.REACT_APP_SERVER_URL}/${item.goods.timg1}`} onError={onErrorImg} />
                        </StyledGoodsImg>
                        <StyledGoodsText>
                            <StyledGoodsName>{nameCut(item.goods.goodsName, 18)}</StyledGoodsName>
                            <StyledGoodsPrice>{priceForm(item.goods.consumerPrice)}</StyledGoodsPrice>
                            <StyledGoodsRealPrice>{priceForm(item.goods.goodsPrice)}</StyledGoodsRealPrice>
                            <StyledGoodsReview>
                                <StyledGoodsReviewIcon><BsStarFill color="#FFD228"/></StyledGoodsReviewIcon>
                                <StyledGoodsReviewScore>{Number.isInteger(item.eachAvg) ? `${item.eachAvg}.0` : item.eachAvg}</StyledGoodsReviewScore>
                                <StyledGoodsReviewScoreCnt>({item.eachCnt})</StyledGoodsReviewScoreCnt>
                            </StyledGoodsReview>
                            <StyledGoodsCnt>{item.buyCnt ? item.buyCnt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0}명 구매완료</StyledGoodsCnt>
                        </StyledGoodsText>
                    </StyledGoodsInfo>
                    <StyledReviewInfo>
                        <StyledReviewInfoStar><StarScore nick={item.reviewId} score={item.ratingAvg}/></StyledReviewInfoStar>
                        <StyledReviewInfoImg>
                            {
                                item.imgArr.map((imgItem, imgIndex) => (
                                    imgItem ? <img key={imgIndex} src={imgItem} onClick={() => setImgOrder(imgIndex, item.imgArr)} /> : null                                                                            
                                ))
                            }                            
                        </StyledReviewInfoImg>
                        <StyledReviewInfoText ref={index==data.length-1 ? lastItemElementRef : null}>{item.content}</StyledReviewInfoText>
                    </StyledReviewInfo>
                </StyledItemInfo>
            ))
        ) : <span style={{display:'inline-block', paddingTop: '3em', marginBottom : '1.5em', fontSize : '0.8em', color : '#ccc'}}>등록된 리뷰가 없습니다.</span>;
    }, [data])

    //render
    return(
        <StyledReview>
            {goodsReviewGear}
        </StyledReview>
    )    
}

export default ReviewList;