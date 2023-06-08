//------------------------------ MODULE -------------------------------------
import React, { useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { ImgSwiper, Modal, StarScore } from "component";
import { apiCall } from "lib";

//------------------------------ CSS ----------------------------------------
const StyledReview = styled.div`
    width:100%;
    overflow-x:hidden;
`;
const StyledStarAvg = styled.div`
    padding-left:5%;
    padding-bottom:3%;
`;
const StyledStarList = styled.div`
    border-top:solid 0.1em #eee;
    width:90%;
    margin:auto;
    padding-top:0.2em;
`;
const StyledStarListRow = styled.div`
    text-align:start;
    margin:0.3em 0;
`;
const StyledStarOrderCnt = styled.span`
    float:right;
    color:crimson;
    font-size:0.8em;
`;
const StyledStarListProfileImg = styled.span`
    display:inline-block;
    overflow:hidden;
    width:1.5em !important;
    height:1.5em !important;
    border-radius:50% !important;
    vertical-align:middle !important;
    img{
        width:100%;
        height:100%;
        object-fit:cover;                
    }
`;
const StyledStarListProfileName = styled.span`
    font-size:0.8em;
    font-weight:550;
    padding-left:1em;
    padding-bottom:0.3em;
`;
const StyledStarListOption = styled.div`
    text-align:start;
    font-size:0.7em;
    color:#aaa;
`;
const StyledStarListContent = styled.div`
    text-align:start;
`;
const StyledStarListImgContainer = styled.div`
    overflow-x:auto;
    overflow-y:hidden;
`;
const StyledStarListImgBox = styled.div`
    text-align:start;
    padding:1em 0 0.5em 0;
    width:max-content;
`;
const StyledStarListContentImg = styled.span`
    display:inline-block;
    width:${(props) => props.size}em;
    height:${(props) => props.size}em;
    img{
        width:${(props) => props.size}em !important;
        border-radius:0.5em !important;
        margin-bottom:0.5em;
    }
    padding-right:0.7em;
    cursor:pointer;
`;
const StyledStarListContentP = styled.p`
    color:#555;
    font-size:0.8em;
    vertical-align:top;
    text-align:start;
    white-space: pre-wrap;
    width:${(props) => props.imgChk ? '70%' : '100%'};
    word-break: break-all;
    padding-bottom:1em;
`;

//------------------------------ COMPONENT ----------------------------------
const ReviewListGoods = ({goodsId=null, limit=null, infiniteScroll=false, sendCnt, size=4}) => {
    //ref
    const observer = useRef();
    const lastChk = useRef(false);

    //state
    const [data, setData] = useState(null);
    const [avg, setAvg] = useState(null);
    const [cnt, setCnt] = useState(null);
    const [imgBox, setImgBox] = useState(null);
    const [page, setPage] = useState(1);
    const [pageLoading, setPageLoading] = useState(false);

    //function
    const initData = async() => {
        try {
            const params = new Object;
            if(goodsId) params.goodsId = goodsId;
            if(limit) params.rpp = limit;
            if(infiniteScroll) params.page = page;

            const result = await apiCall.get("/review", {params});
            if(result.data.res == 'success'){
                setAvg(result.data.avg);
                setData(result.data.data);
                setCnt(result.data.cnt);
                if(sendCnt) sendCnt(result.data.cnt);
            } 
        }catch(e){
            console.log(e);
        }
    }    

    const addData = async() => {
        try {
            const params = new Object;
            if(goodsId) params.goodsId = goodsId;
            if(limit) params.rpp = limit;
            if(infiniteScroll) params.page = page;

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
        setImgBox(newArr);
    }

    //effect
    useEffect(() => {
        initData();
    }, [goodsId]);

    useEffect(() => {
        if(page > 1) addData();
    }, [page]);        

    //memo
    const goodsReviewGear = useMemo(() => {
        if(!data) return null;
        return data.length ? (            
            data.map((item, index) => (
                <StyledStarList key={index}>
                    <StyledStarListRow>
                        <StyledStarListProfileImg><img src={item.memberInfo.img} /></StyledStarListProfileImg>
                        <StyledStarListProfileName>{item.memberInfo.name}</StyledStarListProfileName>
                    </StyledStarListRow>
                    <StyledStarListRow>
                        <StarScore nick={item.reviewId} score={item.ratingAvg} extraInfo={item.regdate.substr(0,10)}/>
                        <StyledStarOrderCnt>{item.reviewCnt > 1 ? `${item.reviewCnt}번 재구매` : null}</StyledStarOrderCnt>
                    </StyledStarListRow>
                    <StyledStarListRow>
                        <StyledStarListOption>옵션 : {item.goodsOptName}</StyledStarListOption>
                    </StyledStarListRow>
                    <StyledStarListRow>
                        <StyledStarListContent>
                            <StyledStarListImgContainer>
                                <StyledStarListImgBox>
                                    {
                                        item.imgArr.map((imgItem, imgIndex) => (
                                            imgItem ? 
                                            <StyledStarListContentImg key={imgIndex} size={size} onClick={() => setImgOrder(imgIndex, item.imgArr)}>
                                                <img src={imgItem} />
                                            </StyledStarListContentImg>
                                            : null                                            
                                        ))
                                    }
                                </StyledStarListImgBox>
                            </StyledStarListImgContainer>
                            {/*<StyledStarListContentText value={item.content} imgChk={item.reviewImg} readOnly /> */}
                            <StyledStarListContentP ref={infiniteScroll && index==data.length-1 ? lastItemElementRef : null}>{String(item.content)}</StyledStarListContentP>
                        </StyledStarListContent>
                    </StyledStarListRow>
                </StyledStarList>
            ))
        ) : <span style={{display:'inline-block', marginBottom : '1.5em', fontSize : '0.8em', color : '#ccc'}}>등록된 리뷰가 없습니다.</span>;
    }, [data])

    const averageGear = useMemo(() => {
        return (
            <StyledStarAvg>
                <StarScore size="1.5em" nick="avg" score={avg} scoreDisplay={true}/>
            </StyledStarAvg>
        )
    }, [avg]);

    const imageGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "20em", 
                    height : "21.5em", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "0.8em", 
                }} 
                type={0} 
                data={{desc : (                
                    <ImgSwiper 
                        imgBox={imgBox} 
                        options={{auto:false}}
                        loop={true}
                    />)
                }}
                state={imgBox} 
                closeEvent={() => {
                    setImgBox(null);
                    return true;    
                }}
            />     
        )        
    }, [imgBox]);

    //render
    return(
        <StyledReview>
            {averageGear}
            {goodsReviewGear}
            {imageGear}
        </StyledReview>
    )
}

export default ReviewListGoods;