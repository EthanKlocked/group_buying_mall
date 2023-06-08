//------------------------------ MODULE -------------------------------------
import { Swiper, SwiperSlide } from "swiper/react"; 
import { Navigation, Pagination, Autoplay} from 'swiper';
import styled from "styled-components";
import "swiper/css"; 
import "swiper/css/navigation";
import "swiper/css/pagination";
import React from "react";

//------------------------------ CSS ----------------------------------------
const StyledSwiper = styled(Swiper)`
    width:100%;
`;

//------------------------------ COMPONENT ----------------------------------
const BasicSwiper = React.memo(({content, auto=false, cnt=1}) => {
    return (
        <>
        <StyledSwiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={cnt}
            scrollbar={{ draggable: true }}
        >
            {content.map((item, index)=>(
                <SwiperSlide key={index}>
                    {item}
                </SwiperSlide>
            ))}            
        </StyledSwiper>
        </>
    )    
});

export default BasicSwiper;