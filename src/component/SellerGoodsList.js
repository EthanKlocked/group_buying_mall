//------------------------------ MODULE -------------------------------------
import React, { useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { StarScore, ItemList } from "component";
import { apiCall, nameCut, priceForm, numberForm } from "lib";
import { useNavigate } from "react-router-dom";

//------------------------------ CSS ----------------------------------------
const StyledSeller = styled.div`
    width:100%;
    overflow-x:hidden;
`;
const StyledSellerProfile = styled.div`
    padding-bottom:0.5em;
    text-align:start;
`;
const StyledSellerProfileInfo = styled.span`
    display:inline-block;
    height:5em;
    width:40%;
    vertical-align:middle;
    text-align:start;
`;
const StyledSellerName = styled.div`
    padding-bottom:1em;
    font-weight:bold;
    text-align:start;
    color:crimson;
`;
const StyledSellerStar = styled.div`
`;
const StyledSellerProfileGoods = styled.span`
    display:inline-block;
    vertical-align:middle;
    float:right;
`;
const StyledSellerButton = styled.div`
    padding:0.5em 2em;
    font-size:0.9em;
    border: 0.05em solid crimson;
    color:crimson;
    border-radius:0.3em;
    margin-bottom:0.5em;
    cursor:pointer;
`;
const StyledSellerCnt = styled.div`
    text-align:start;
    font-size:0.8em;
    color:#aaa;
    margin-top:0.3em;
`;
const StyledSellerCntTitle = styled.span`
`;
const StyledSellerCntValue = styled.span`
    float:right;
`;
const StyledSellerGoods = styled.div`
    display:inline-flex;
    justify-content:${(props) => props.cnt < 3 ? "flex-start" : "space-between"};
    column-gap:${(props) => props.cnt < 3 ? "1.5em" : null};
`;
const StyledSellerGoodsItem = styled.span`
    display:inline-block;
    width:23%;
    text-align:start;
    cursor:pointer;
`;
const StyledSellerGoodsImg = styled.span`
    img{
        width:100%;
    }
`;
const StyledSellerGoodsName = styled.div`
    font-size:0.75em;
    line-height:1.3em;
    text-align:start;
`;
const StyledSellerGoodsPrice = styled.div`
    text-align:start;
    line-height:1.5em;
    font-size:0.95em;
    font-weight:bold;
`;
const StyledSellerMainProfile = styled.div`
`;
const StyledSellerMainInfo1 = styled.div`
    padding:1em;
`;
const StyledSellerMainSection = styled.span`
    display:inline-block;
    width:50%;
`;
const StyledSellerMainInfo2 = styled.div`
`;
const StyledSellerMainNumber = styled.div`
    font-weight:bold;
    font-size:1.2em;
`;
const StyledSellerMainTitle = styled.div`
    font-size:0.8em;
`;
const StyledSellerMainName = styled.span`
    color:crimson;
    font-size:1.2em;
    font-weight:bold;
    margin-right:2em;
`;
const StyledSellerMainScore = styled.span`
    display:inline-block;
    width:50%;
`;
const StyledSellerMainButton = styled.div`
    margin:1em;
    border-radius:0.3em;
    border: solid 0.05em #ccc;
    color: #555;
    padding:0.5em;
    font-size:0.9em;
    cursor:pointer;
`;
const StyledSellerMainGoods = styled.div`
`;


//------------------------------ COMPONENT ----------------------------------
const SellerGoodsList = ({sellerId, nowGoods=null, limit=null}) => {
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
            const params = new Object();
            if(limit) params.rpp = limit;

            if(!nowGoods) params.page = page;
            else params.exceptionGoods = nowGoods;

            const result = await apiCall.get(`/seller/${sellerId}`, {params});
            if(result.data.res == 'success') setData(result.data.data);
        }catch(e){
            console.log(e);
        }
    } 

    const movePage = (gsId) => {
        window.scrollTo(0,0);
        //navigate('/Description', { state: { id: gsId } });
        navigate('/InterceptPage?goal=/Description', { state: { id: gsId }, replace: true });
    }

    //effect
    useEffect(() => {
        initData();
    },[]);

    //memo 
    const simpleList = useMemo(() => {
        return data ? (
            <StyledSeller>
                <StyledSellerProfile>
                    <StyledSellerProfileInfo>
                        <StyledSellerName>
                            {data.name}
                        </StyledSellerName>
                        <StyledSellerStar>
                            <StarScore nick={`seller${data.name}`} score={data.review.avg} extraInfo={`(${numberForm(data.review.cnt)})`}/>
                        </StyledSellerStar>
                    </StyledSellerProfileInfo>
                    <StyledSellerProfileGoods>
                        <StyledSellerButton onClick={() => {navigate('/SellerPage', { state: { id: sellerId, name: data.name } })}}>
                            판매자 상품 더보기
                        </StyledSellerButton>
                        <StyledSellerCnt>
                            <StyledSellerCntTitle>
                                판매 상품
                            </StyledSellerCntTitle>
                            <StyledSellerCntValue>
                                {data.goodsCnt} 개
                            </StyledSellerCntValue>
                        </StyledSellerCnt>
                        <StyledSellerCnt>
                            <StyledSellerCntTitle>
                                총 주문량
                            </StyledSellerCntTitle>
                            <StyledSellerCntValue>
                                {data.orderCnt} 개
                            </StyledSellerCntValue>                        
                        </StyledSellerCnt>
                    </StyledSellerProfileGoods>
                </StyledSellerProfile>
                <StyledSellerGoods cnt={data.goods.length}>
                    {
                        data.goods.map((item, index) => (
                            <StyledSellerGoodsItem key={index} onClick={() => {movePage(item.goodsId)}}>
                                <StyledSellerGoodsImg>
                                    <img src={`${process.env.REACT_APP_SERVER_URL}/${item.timg1}`}/>
                                </StyledSellerGoodsImg>
                                <StyledSellerGoodsName>{nameCut(item.goodsName, 15)}</StyledSellerGoodsName>
                                <StyledSellerGoodsPrice>{priceForm(item.goodsPrice)}</StyledSellerGoodsPrice>
                            </StyledSellerGoodsItem>
                        ))
                    }
                </StyledSellerGoods>
            </StyledSeller>
        ) : null;
    }, [data])

    const mainList = useMemo(() => {
        return data ? (
            <StyledSeller>
                <StyledSellerMainProfile>
                    <StyledSellerMainInfo1>
                        <StyledSellerMainSection>
                            <StyledSellerMainNumber>{numberForm(data.goodsCnt)}</StyledSellerMainNumber>
                            <StyledSellerMainTitle>상품</StyledSellerMainTitle>
                        </StyledSellerMainSection>
                        <StyledSellerMainSection>
                            <StyledSellerMainNumber>{numberForm(data.orderCnt)}</StyledSellerMainNumber>
                            <StyledSellerMainTitle>주문량</StyledSellerMainTitle>
                        </StyledSellerMainSection>
                    </StyledSellerMainInfo1>
                    <StyledSellerMainInfo2>
                        <StyledSellerMainName>{data.name}</StyledSellerMainName>
                        <StyledSellerMainScore>
                            <StarScore size="1.5em" nick={`seller${data.name}`} score={data.review.avg} extraInfo={`(${numberForm(data.review.cnt)})`}/>
                        </StyledSellerMainScore>
                    </StyledSellerMainInfo2>
                    <StyledSellerMainButton onClick={() => {navigate('/SellerReview', { state: { id: sellerId, name: data.name } })}}>모든 구매후기 보기</StyledSellerMainButton>
                </StyledSellerMainProfile>
                <StyledSellerMainGoods>
                    <ItemList selectOpt={{seller:sellerId}} loadingCover={true}/>
                </StyledSellerMainGoods>
            </StyledSeller>
        ) : null;
    }, [data])

    //render
    return(
        <>
            {nowGoods ? simpleList : mainList}
        </>
    )
}

export default SellerGoodsList;