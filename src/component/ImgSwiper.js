//------------------------------ MODULE -------------------------------------
import { Swiper, SwiperSlide } from "swiper/react"; // basic
import { Navigation, Pagination, Autoplay} from 'swiper';
import { useState, useEffect } from "react";
import styled from "styled-components";
import "swiper/css"; //basic
import "swiper/css/navigation";
import "swiper/css/pagination";
import React from "react";
import {onErrorImg} from "lib";
import noImg from 'data/img/noimg.png';

//------------------------------ CSS ----------------------------------------
const StyledSwiper = styled(Swiper)`
    width:100%;
    .swiper-pagination{
        position:absolute;
        display:${(props) => props.slidecnt > 1 ? 'flex' : 'none'};
        justify-content: space-around;
        opacity:0.5;    
        color:white;
        background:black;
        width:3em;
        font-size:0.7em;
        margin-left:88%;
        border-radius:5em;
    }
`;
const StyledImg = styled.img`
    width:100%;
`;
//------------------------------ COMPONENT ----------------------------------
const ImgSwiper = React.memo(({imgBox, loadingImg=null, auto=false, loop=false}) => {
    
    //state 
    const [loading, setLoading] = useState(true);
    const [first, setFirst] = useState(loadingImg);    

    useEffect(() => {
        if(!loading) setFirst(imgBox[0]);
    }, [loading]);

    //render
    return (imgBox && imgBox.length>0) ? (
        <>
        <StyledSwiper
            slidecnt={imgBox.length}
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            scrollbar={{ draggable: true }}
            pagination={{
                type: "fraction",
            }}
            autoplay={
                auto ? 
                {
                    delay: 2000,
                    disableOnInteraction: false
                } : false
            }
            loop={imgBox.length > 1 ? loop : false}
        >
            {imgBox && imgBox.length > 0 ? imgBox.map((item, index)=>(
                <SwiperSlide key={index}>
                    <StyledImg src={index == 0 && loadingImg ? first : item} onLoad={index == 0 && loadingImg ? () => setLoading(false) : null} onError={onErrorImg} />
                </SwiperSlide>
            )) : 
            <SwiperSlide>
                <StyledImg src={noImg}/>
            </SwiperSlide>            
            }            
        </StyledSwiper>
        </>
    ) : null    
});

export default ImgSwiper;