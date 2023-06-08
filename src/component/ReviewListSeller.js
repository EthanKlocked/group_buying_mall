//------------------------------ MODULE -------------------------------------
import React, { useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { ImgSwiper, Modal, StarScore } from "component";
import { apiCall, timeDiffer, onErrorImg, nameCut, priceForm } from "lib";
import { BsStarFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

//------------------------------ CSS ----------------------------------------

const StyledReview = styled.div`
    width:100%;
    padding-bottom:3em;
`;
const StyledStarAvg = styled.div`
    padding-left:5%;
    padding-bottom:3%;
    border-bottom:solid 0.3em #f5f5f5;
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
        margin-right:0.5em;
        width:30%;
        border-radius:0.3em;
        cursor:pointer;
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
const ReviewListSeller = ({sellerId=null, limit, loadingHandler}) => {
    //init
    const navigate = useNavigate();    

    //ref
    const observer = useRef();
    const lastChk = useRef(false);

    //state
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [pageLoading, setPageLoading] = useState(false);
    const [imgBox, setImgBox] = useState(null);
    const [avg, setAvg] = useState(null);


    //function
    const initData = async() => {
        try {
            loadingHandler(true);
            const params = {
                seller: sellerId,
                rpp : limit,
                page : page
            }
            const result = await apiCall.get("/review", {params});
            if(result.data.res == 'success'){ 
                setData(result.data.data) 
                setAvg(result.data.avg);
            } 
            loadingHandler(false);
        }catch(e){
            console.log(e);
        }
    }

    const addData = async() => {
        try {
            const params = {
                seller: sellerId,
                rpp : limit,
                page : page,
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
        setImgBox(newArr);
    }

    //effect
    useEffect(() => {
        initData();
    }, []);

    useEffect(() => {
        if(page > 1) addData();
    }, [page]); 

    //memo
    const averageGear = useMemo(() => {
        return (
            <StyledStarAvg>
                <StarScore size="1.5em" nick="avg" score={avg} scoreDisplay={true}/>
            </StyledStarAvg>
        )
    }, [avg]);

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

export default ReviewListSeller;