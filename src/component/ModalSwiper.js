//------------------------------ MODULE -------------------------------------
import { Swiper, SwiperSlide } from "swiper/react"; // basic
import { Navigation, Pagination, Autoplay} from 'swiper';
import styled from "styled-components";
import "swiper/css"; //basic
import "swiper/css/navigation";
import "swiper/css/pagination";
import React from 'react';

//------------------------------ CSS ----------------------------------------
const StyledSwiper = styled(Swiper)`
    width:100%;
    .swiper-pagination{
        display:flex;
        justify-content:space-evenly;
        bottom:0;
    }
    .swiper-pagination-bullet{
        background:red;
        width:20px;
        height:20px;
    }
`;

//------------------------------ COMPONENT ----------------------------------
const ModalSwiper = React.memo(({guideBox, auto=false}) => {
    return (
        <>
        <StyledSwiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            scrollbar={{ draggable: true }}
            pagination={{
                clickable: true,
            }}
        >
            {guideBox.map((item, index)=>(
                <SwiperSlide key={index}>
                    {item}
                </SwiperSlide>
            ))}            
        </StyledSwiper>
        </>
    )    
});

export default ModalSwiper;