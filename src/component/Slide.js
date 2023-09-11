//------------------------------ MODULE -------------------------------------
import React, { useState } from "react";
import styled from "styled-components";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

//------------------------------ CSS ----------------------------------------
const StyledSlider = styled(Slider)`
    display:grid;
    .slick-list {
        display:grid;
        align-items:center;
    }
    .slick-track{
    }
`;
const StyledPageMark = styled.div`
    z-index:1;
    position:relative;
    background:black;
    border-radius:10px;
    font-size:0.8em;
    opacity:0.5;
    color:white;
    width:10%;
    height:100%;
    right:-87%;
    top:-150%;
    align-content:center;
`;

//------------------------------ COMPONENT ----------------------------------
const Slide = React.memo(({imgBox, options}) => {
    //state
    const pageCount = imgBox.length;
    const [nowPage, setNowPage] = useState(1);

    //init
    const settings = { 
        dots: false, 
        arrows: false, 
        infinite: true, 
        speed: 500, 
        slidesToShow: 1, 
        slidesToScroll: 1, 
        autoplay: options.auto, 
        autoplaySpeed: 4000, 
        beforeChange: function (currentSlide, nextSlide) {
            setNowPage(nextSlide+1);
        },
    };

    return (
        <>
        <StyledSlider {...settings}> 
            {imgBox.map((item, index)=>(
                <img key={index} src={item}/>
            ))}
        </StyledSlider>                
        <StyledPageMark>{`${nowPage} / ${imgBox.length}`}</StyledPageMark>
        </>

    )    
});

export default Slide;