//------------------------------ MODULE -------------------------------------
import { Swiper, SwiperSlide } from "swiper/react"; // basic
import { Navigation, Pagination, Autoplay} from 'swiper';
import styled from "styled-components";
import { StarScore } from "component";
import "swiper/css"; //basic
import "swiper/css/navigation";
import "swiper/css/pagination";
import { nameCut, priceForm, onErrorImg } from 'lib';
import { useNavigate } from "react-router-dom";
import React from "react";

//------------------------------ CSS ----------------------------------------
const StyledSwiper = styled(Swiper)`
    width:100%;
`;
const StyledContainer = styled.div`
    padding:8%;
    cursor:pointer;
`;
const StyledImg = styled.img`
    width:100%;
    border-radius:10px;
`;
const StyledName = styled.div`
    width:100%;
    text-align:start;
    font-size:0.5em;
    padding: 2% 0;
`;
const StyledPrice = styled.div`
    text-align:start;
    width:100%;
    font-size:0.8em;
    color:crimson;
    padding: 2% 0;
`;

//------------------------------ COMPONENT ----------------------------------
const GoodsSwiper = React.memo(({goodsBox}) => {
    //init
    const navigate = useNavigate();     

    //function
    const moveDesc = (id) => navigate('/Description', { state: { id: id } });    

    return (
        <>
        <StyledSwiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={3}
            scrollbar={{ draggable: true }}
        >
            {goodsBox.map((item, index)=>(
                <SwiperSlide key={index}>
                    <StyledContainer onClick = {() => moveDesc(item.goodsId)}>
                        <StyledImg src={`${process.env.REACT_APP_SERVER_URL}${item.timg1}`} onError={onErrorImg}/>
                        <StyledName>{nameCut(item.goodsName, 10)}</StyledName>
                        <StyledPrice>{priceForm(item.goodsPrice)}</StyledPrice>
                        <StarScore nick={`wish${item.goodsId}`} score={item.avgScore} size="0.8em" extraInfo={`(${item.cnt})`}/> 
                    </StyledContainer>
                </SwiperSlide>
            ))}            
        </StyledSwiper>
        </>
    )    
});

export default GoodsSwiper;