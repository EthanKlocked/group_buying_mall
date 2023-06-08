//------------------------------ MODULE -------------------------------------
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { Title, OrderList } from "component";
import { useState } from "react";

//------------------------------ CSS ----------------------------------------
const StyledOrderInfo = styled.div`
    height:100%;
    overflow:hidden;
`;
const StyledContent = styled.div`
    padding-top:3.5em;
    height:100%;
`;
const StyledOrderInfoMenu = styled.div`
    height:4.5em;
    background:#eee;
    line-height:4.5em;    
`;
const StyledOrderInfoTitle = styled.span`
    margin:0.8em;
    font-size:1em;
    font-weight:550;
    color:${(props) => props.selected ? 'red' : '#888'};
    cursor:pointer;
`;
const StyledShortDesc = styled.div`
    font-weight:bold;
    font-size:0.8em;
    padding: 1em; 
    border-bottom:solid 0.1em #eee; 
`;

//------------------------------ COMPONENT ----------------------------------
const OrderInfo = () => {
    //init
    const { state } = useLocation();
    const menuData = [
        {
            state : 2,
            title : '팀모집중',
            desc : '결제가 완료되어 팀을 모집하고 있어요!'
        },
        {
            state : 3,
            title : '상품준비중',
            desc : '팀구매가 성사되어서 판매자가 상품을 준비하고 있어요!'
        },
        {
            state : 13,
            title : '배송중',
            desc : '배송이 시작되었어요, 곧 상품을 만나보실 수 있어요!'
        },
        {
            state : 14,
            title : '배송완료',
            desc : '상품은 잘 받아보셨나요? 문제시 고객센터로 알려주세요!'
        }
    ];
    
    //state
    const [orderState, setOrderState] = useState(state.orderState);

    //render
    return !orderState ? null : (
        <StyledOrderInfo>
            <Title text="내 주문 현황" />
            <StyledContent>
                <StyledOrderInfoMenu>
                    {menuData.map((item, index) => (
                        <StyledOrderInfoTitle key={index} selected={item.state == orderState} onClick={() => setOrderState(item.state)}>
                            {item.title}
                        </StyledOrderInfoTitle>
                    ))}
                </StyledOrderInfoMenu>
                <StyledShortDesc>
                    {menuData.filter((i) => i.state == orderState)[0]['desc']}
                </StyledShortDesc>
                <OrderList orderState={orderState}/>
            </StyledContent>
        </StyledOrderInfo>
    )
}

export default OrderInfo;