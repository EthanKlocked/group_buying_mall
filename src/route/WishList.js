//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { GoodsSwiper, StarScore, SimpleMotion } from "component";
import { apiCall, priceForm, onErrorImg, touchSlide } from "lib";
import { useNavigate } from "react-router-dom";

//------------------------------ CSS ----------------------------------------
const StyledContainer = styled.div`
    height: 100%;
    overflow:hidden;
    img{
        width:100%;
        border-radius:0.5em;
    }
`;
const StyledHeader = styled.div`
    height:3.5em;
    width:100%;
    z-index:3;
    background:white;
    position:fixed;
    line-height:3.5em;
    vertical-align:middle;
    border-bottom:solid 1px #eee;
`;
const StyledContent = styled.div`
    margin:3.5em 0;
    overflow:auto;
    height:100%;
    &::-webkit-scrollbar {
        display: none;
    }
`;
const StyledSection1 = styled.div`
    border-bottom:solid 0.4em #eee;
`;
const StyledSection2 = styled.div`
`;
const StyledSectionTitle = styled.div`
    text-align:start;
    font-weight:bold;
    padding:0.8em 0.5em;
    border-bottom:solid 1px #eee;
`;
const StyledSectionContent = styled.div`
    text-align:start;
`;
const StyledCatchedItem = styled.div`
    text-align:start;
    padding:0.5em;
    cursor:pointer;
`;
const StyledItemImg = styled.span`
    display:inline-block;
    width:30%;
`;
const StyledItemInfo = styled.span`
    display:inline-block;
    width:67%;
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
const StyledEmpty = styled.div`
    height:8em;
`;
const StyledNoneList = styled.div`
    color:#aaa;
    font-size:0.8em;
    height:10em;
    line-height:10em;
`;
//------------------------------ COMPONENT ----------------------------------
const WishList = React.memo(() => {
    //init
    const navigate = useNavigate();    

    //state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wishList, setWishList] = useState([]);
    const [catchedList, setCatchedList] = useState(null);

    //effect
    useEffect(() => {
        initData();
        touchSlide('wishTouch', 'y');
    }, []);

    //function
    const initData = async() => {
        try {
            //wishItemData
            const wishResult = await apiCall.get("/goods/any/wishList");
            setWishList(wishResult.data);

            //catchedItemData
            const browse = JSON.parse(sessionStorage.getItem('browse'));
            let catchedResult = {data:[]};
            if(browse && browse[0]){
                const params = { dataArr : browse };
                catchedResult = await apiCall.get("/goods/any/getArrayOrdered", {params});
            }
            setCatchedList(catchedResult.data);
        }catch(e){
            setError(e);
        }
        setLoading(false);
    }

    const moveDesc = useCallback((id) => {
            navigate('/Description', { state: { id: id } });
    }, []);

    //memo
    const wishGear = useMemo(() => {
        return !wishList.length ? null : (
            <StyledSection1>
                <StyledSectionTitle>내가 찜한 상품</StyledSectionTitle>
                <StyledSectionContent>
                    <GoodsSwiper goodsBox={wishList}/>
                </StyledSectionContent>
            </StyledSection1>            
        )
    }, [wishList])

    const catchedGear = useMemo(() => {
        if(!catchedList) return null;
        return (
            <StyledSection2>
                <StyledSectionTitle>내가 본 상품</StyledSectionTitle>
                <StyledSectionContent>     
                    {
                        catchedList.length ? (
                            catchedList.map((item, index)=>(                
                                <StyledCatchedItem 
                                    key={index} onClick = {() => moveDesc(item.goodsId)} 
                                    block={index%2 == 0 && index == catchedList.length-1 ? true : false} 
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
                                        <StyledItemPrice>{priceForm(item.goodsPrice)}</StyledItemPrice>                        
                                        <StarScore nick={`view${item.goodsId}`} score={item.avgScore} size="0.8em" extraInfo={`(${item.cnt})`}/> 
                                    </StyledItemInfo>
                                </StyledCatchedItem> 
                            ))
                        ) : 
                        <StyledNoneList>
                            상품 조회 이력이 없습니다.
                        </StyledNoneList>
                    }
                    <StyledEmpty />
                </StyledSectionContent>
            </StyledSection2>            
        )
    }, [catchedList])

    //render
    return (
        <>
        <SimpleMotion>
            <StyledContainer>
                <StyledHeader>
                    내 관심상품
                </StyledHeader>
                <StyledContent id="wishTouch">
                    {wishGear}
                    {catchedGear}
                </StyledContent>
            </StyledContainer>
        </SimpleMotion>
        </>
    );      
});

export default WishList;