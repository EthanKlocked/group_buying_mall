//------------------------------ MODULE -------------------------------------
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Title } from "component";
import { apiCall, nameCut, priceForm, touchSlide } from "lib";
import { orderStateData } from "static";

//------------------------------ CSS ----------------------------------------
const StyledCancelList = styled.div`
    height:100%;
    overflow:hidden;
`;
const StyledContent = styled.div`
    padding-top:4em;
    overflow:auto;
    height:100%;
    &::-webkit-scrollbar {
        display: none;
    }
`;
const StyledEmpty = styled.div`
    height:8em;
`;
const StyledNoneData = styled.div`
    margin-top:3em;
    color:#ccc;
    font-size:0.8em;
`;
const StyledStatus = styled.span`
    font-size:0.8em;
    background:#ccc;
    position:absolute;
    right:2em;
    padding:0.2em 0.5em;
    border-radius:0.3em;
    bottom:0.5em;
`;
const StyledGoods = styled.div`
    position:relative;
    height:6em;
    text-align:start;
    padding: 1em 0;
    border-bottom: solid 0.1em #ccc;
    cursor:pointer;
`;
const StyledGoodsImgBox = styled.span`
    display:inline-block;
    width:30%;
    height:95%;
    margin-left:1em;
`;
const StyledGoodsImg = styled.img`
    height:100%;
    margin:0.1em;
`;
const StyledGoodsContentBox = styled.span`
    display:inline-block;
    margin-left:1em;
    width:55%;
    vertical-align:top;
    div{
        text-align:start;
    }
`;
const StyledGoodsDate = styled.div`
    font-size:1em;
    padding-bottom:0.3em;
    border-bottom:0.05em solid #eee;
    margin-bottom:0.3em;
`;
const StyledGoodsName = styled.div`
    font-size:0.8em;
    font-weight:550;
    padding-bottom:0.3em;
`;
const StyledGoodsOption = styled.div`
    font-size:0.8em;
    color:#888;
`;
const StyledGoodsCnt = styled.div`
    font-size:0.8em;
    color:#888;
`;
const StyledGoodsPrice = styled.div`
    font-size:0.8em;
    color:#888;
`;

//------------------------------ COMPONENT ----------------------------------
const CancelList = () => {
    //init
    const navigate = useNavigate();

    //ref
    const observer = useRef();
    const lastChk = useRef(false);

    //state
    const [data, setData] = useState(null);
    const [rows, setRows] = useState(5);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);

    //function
    const initData = async() => {
        try{
            //init
            setData(null);
            setError(false);
            setLoading(true);

            //get data
            const params = { 
                self : true, 
                state : [
                    '21','22','23','26','27','29','31','32','33','36','37','42'
                ], 
                page : page, 
                rpp : rows,
                col : 'rcentDate' 
            };
            const orderResult = await apiCall.get(`/order`, {params});

            //set data
            if(orderResult.data.result == 'success') setData(orderResult.data.data);
        }catch(e){
            setError(e);
            console.log(e);
        }
    };

    const addItems = async() => {
        try {
            const params = {
                self : true, 
                state : [
                    '21','22','23','26','27','29','31','32','33','36','37','42'
                ], 
                page : page,
                rpp : rows,
                col : 'rcentDate'                 
            }
            const orderResult = await apiCall.get(`/order`, {params});
            if(orderResult.data.result == 'success'){
                if(!orderResult.data.data.length){ //----IS THE LAST INDEX IN ITEM DATAS----//
                    return lastChk.current = true;
                } 
                setData([...data, ...orderResult.data.data]);
            } 
        }catch(e){
            setError(e);
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
    }, []);

    useEffect(() => {
        if(page > 1) addItems();
    }, [page]);    

    useEffect(() => {
        if(data) touchSlide('cancelListTouch', 'y');
    }, [data])

    //render
    if(!data) return null;
    return (
        <StyledCancelList>
            <Title text={`취소/교환/반품 내역`}  />
            <StyledContent id="cancelListTouch">
                {!data.length ? 
                    <StyledNoneData>취소/교환/반품 내역이 존재하지 않습니다.</StyledNoneData> 
                    : 
                    (data.map((item, index) => (
                        <StyledGoods key={index} onClick = {() => navigate('/MyPage/OrderDesc', { state: { orderId: item.odId } })}>
                            <StyledStatus>{orderStateData[String(item.state)]}</StyledStatus>
                            <StyledGoodsImgBox>
                                <StyledGoodsImg src={`${process.env.REACT_APP_SERVER_URL}/${item.goodsInfo.simg1}`}/>
                            </StyledGoodsImgBox>
                            <StyledGoodsContentBox>
                                <StyledGoodsName>{nameCut(item.goodsInfo.goodsName, 23)}</StyledGoodsName>
                                <StyledGoodsOption>옵션 : {item.goodsInfo.optionName}</StyledGoodsOption>
                                <StyledGoodsCnt>주문수량 : {item.qty}개</StyledGoodsCnt>
                                <StyledGoodsPrice ref={index==data.length-1 ? lastItemElementRef : null}>결제금액 : {priceForm(item.amount)}</StyledGoodsPrice>
                            </StyledGoodsContentBox>
                        </StyledGoods>
                    )))
                }
                <StyledEmpty />
            </StyledContent>
        </StyledCancelList>
    )
}

export default CancelList;