//------------------------------ MODULE -------------------------------------
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Title } from "component";
import { useState, useEffect} from "react";
import { apiCall, priceForm } from "lib";

//------------------------------ CSS ----------------------------------------
const StyledOrderDesc = styled.div`
    height:100%;
    overflow:hidden;
`;
const StyledContent = styled.div`
    padding-top:3.5em;
    height:100%;
    background:#eee;
`;
const StyledSection = styled.div`
    margin-bottom:0.8em;
    background:white;
    padding:1em 1.5em;
`;
const StyledSectionTitle = styled.div`
    text-align:start;
    padding-bottom:0.5em;
`;
const StyledGoods = styled.div`
    height:100%;
    cursor:pointer;
`;
const StyledGoodsImgBox = styled.span`
    text-align:start;
    display:inline-block;
    width:30%;
    height:100%;
    vertical-align:top;
    img{
        height : 5.5em;
        padding-top:0.3em;
    }
`;
const StyledGoodsInfo = styled.span`
    display:inline-block;
    width:70%;
    div{
        text-align:start;
        font-size:0.8em;
        margin-bottom:0.2em;
    }
`;
const StyledGoodsName = styled.div`
    font-size:1em !important; 
    padding-bottom:0.2em;
    border-bottom:0.05em solid #eee;
`;
const StyledGoodsDate = styled.div`
`;
const StyledGoodsOption = styled.div`
`;
const StyledGoodsCnt = styled.div`
`;
const StyledGoodsPrice = styled.div`
    color:#aaa;
`;
const StyledGoodsDelPrice = styled.div`
    color:#aaa;
`;
const StyledGoodsPayAmount = styled.div`
`;
const StyledAddress = styled.div`
    height:5em;
`;
const StyledPayment = styled.div`
`;
const StyledGoodsfield = styled.span`
`;
const StyledGoodsValue = styled.span`
    float:right;
    font-weight:bold;
`;
const StyledDeliveryInfo = styled.div`
`;
const StyledEachRow = styled.div`
    text-align:start;
    font-size:0.8em;
    color:#aaa;
    padding-bottom:0.2em;
`;

//------------------------------ COMPONENT ----------------------------------
const OrderDesc = () => {
    //init
    const { state } = useLocation();
    const navigate = useNavigate();

    //state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    //function
    const initData = async() => {
        try {
            setError(null);
            setLoading(true);
            setData(null);
            const orderResult = await apiCall.get(`/order/${state.orderId}`);
            if(orderResult.data.res == 'success') setData(orderResult.data.data);
        }catch(e){
            setError(e);
        }
        setLoading(false);
    }

    //effect
    useEffect(() => {
        initData();
    }, []);

    //render
    return !data? null : (
        <StyledOrderDesc>
            <Title text="주문 상세" />
            <StyledContent>
                <StyledSection>
                    <StyledSectionTitle>주문 상품</StyledSectionTitle>
                    <StyledGoods onClick = {() => navigate('/Description', { state: { id: data.goodsInfo.goodsId } })}>
                        <StyledGoodsImgBox>
                            <img src={`${process.env.REACT_APP_SERVER_URL}${data.goodsInfo.timg1}`} />
                        </StyledGoodsImgBox>
                        <StyledGoodsInfo>
                            <StyledGoodsName>{data.goodsInfo.goodsName}</StyledGoodsName>
                            <StyledGoodsDate>{data.orderDate.substr(0, 10)} 주문 완료</StyledGoodsDate>
                            <StyledGoodsOption>
                                <StyledGoodsfield>옵션 : </StyledGoodsfield>
                                {data.goodsInfo.optionName}
                            </StyledGoodsOption>
                            <StyledGoodsCnt>
                                <StyledGoodsfield>주문수량 :  </StyledGoodsfield>
                                {data.qty}개
                            </StyledGoodsCnt>
                            <StyledGoodsPrice>
                                <StyledGoodsfield>총 상품 가격 : </StyledGoodsfield>
                                <StyledGoodsValue>{priceForm(data.goodsPrice)}</StyledGoodsValue>
                            </StyledGoodsPrice>
                            <StyledGoodsDelPrice>
                                <StyledGoodsfield>배송비 : </StyledGoodsfield>
                                <StyledGoodsValue>{priceForm(data.deliveryCharge)}</StyledGoodsValue>
                            </StyledGoodsDelPrice>
                            <StyledGoodsDelPrice>
                                <StyledGoodsfield>포인트 사용 : </StyledGoodsfield>
                                <StyledGoodsValue>{'(-)'+priceForm(data.point)}</StyledGoodsValue>
                            </StyledGoodsDelPrice>                            
                            <StyledGoodsPayAmount>
                                <StyledGoodsfield>상품 결제 금액 : </StyledGoodsfield>
                                <StyledGoodsValue>{priceForm(data.amount)}</StyledGoodsValue>
                            </StyledGoodsPayAmount>
                        </StyledGoodsInfo>
                    </StyledGoods>
                </StyledSection>
                <StyledSection>
                    <StyledSectionTitle>배송지</StyledSectionTitle>
                    <StyledAddress>
                        <StyledDeliveryInfo>
                            <StyledEachRow>{data.receiverName} {data.receiverCellphone}</StyledEachRow>
                            <StyledEachRow>{data.receiverAddr1}</StyledEachRow>
                            <StyledEachRow>{data.receiverAddr2}</StyledEachRow>
                            <StyledEachRow>{data.receiverDeliveryMsg}</StyledEachRow>
                        </StyledDeliveryInfo>
                    </StyledAddress>                    
                </StyledSection>
                <StyledSection>
                    <StyledSectionTitle>결제수단</StyledSectionTitle>
                    <StyledPayment>
                        <StyledEachRow>결제 방법 : {data.paymethod == 'card' ?'카드결제':'카카오페이'}</StyledEachRow>
                    </StyledPayment>
                </StyledSection>
            </StyledContent>        
        </StyledOrderDesc>
    )
}

export default OrderDesc;