//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { RiKakaoTalkFill } from "react-icons/ri";
import React, { useEffect, useMemo } from "react";
import { kakaoShare } from "lib";

//------------------------------ CSS ----------------------------------------
const StyledDiv = styled.div`
    position:fixed;
    right: ${(props) => props.r};
    bottom: ${(props) => props.b};
    z-index:4;
    text-align:center;
    height:2em;
    width:2em;
    border-radius:50%;
    background:#f9e000;
    margin-top:0.2em;
    cursor:pointer;
    svg{
        margin-top:0.25em;
        margin-left:0.05em;
    }
`;

//------------------------------ COMPONENT ----------------------------------
const KakaoShare = React.memo(({type="goods", sendData, b="4em", r="2.5em"}) => {
    //function
    const callGoodsShare = () => {
        //init
        const goods = sendData.goods;
        const join = sendData.join;

        //set
        const sendObj = {
            objectType: 'commerce',
            content: {
                title: join ? '올딜에서 팀 참여 요청이 왔어요!' : '올딜에서 팀을 모집 해 보세요!',
                imageUrl: `${process.env.REACT_APP_SERVER_URL}/${goods.simg1}`,
                link: {
                    mobileWebUrl: `${process.env.REACT_APP_HOST}/Description?id=${goods.goodsId}`,
                    webUrl: `${process.env.REACT_APP_HOST}/Description?id=${goods.goodsId}`,
                },
            },
            commerce: {
                productName: goods.goodsName,
                regularPrice: goods.consumerPrice,
                discountRate: Math.round(100-goods.goodsPrice/goods.consumerPrice*100),
                discountPrice: goods.goodsPrice,
            },
            buttons: [
                {
                    title: '구매하기',
                    link: {
                        mobileWebUrl: `${process.env.REACT_APP_HOST}/Description?id=${goods.goodsId}${join ? `&joinInfo=${join}` : ``}`,
                        webUrl: `${process.env.REACT_APP_HOST}/Description?id=${goods.goodsId}${join ? `&joinInfo=${join}` : ``}`,
                    },
                }
            ],
        };

        //exec
        kakaoShare(sendObj);
    }

    //effect
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.0.0/kakao.min.js";
        script.crossorigin = "anonymous";
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    //memo
    const buttonGear = useMemo(() => {
        return (
            <>
                <StyledDiv 
                    id="webKakaoLink"
                    b={b}
                    r={r}
                    onClick={
                        type=='goods' 
                        ? 
                            () => callGoodsShare() 
                        : 
                            () => {}
                    }
                >
                    <RiKakaoTalkFill size="1.5em"/>
                </StyledDiv>
            </>
        );
    }, [b, r, sendData]);

    //render
    return buttonGear; 
});

export default KakaoShare;