//------------------------------ MODULE -------------------------------------
import React from "react";
import { priceForm } from "lib";
import styled from "styled-components";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTimer } from 'react-timer-hook';

//------------------------------ CSS ----------------------------------------
const StyledSlider = styled(Slider)`
    display:grid;
    width:85%;
    .slick-list {
        display:grid;
        align-content:end;
    }
    .button{
    }
    .slick-arrow {
        top:46%;
        height:100%;
    }
    .slick-track{
    }
    .slick-prev:before {
        color: #888;
    }
    .slick-next:before {
        color: #888;
    }    
`;
const StyledBox = styled.div`
    display:grid !important;
    justify-items:center;
    padding-top:30%;
`;
const StyledImg = styled.img`
    width:80%;
    border-radius:0.5em;
`;
const StyledTime = styled.div`
    display:grid;
    font-size:0.8em;
    width:80%;
    margin-top:5%;
`;
const StyledPrice = styled.div`
    display:grid;
    font-size:0.8em;
    width:80%;
    margin-top:5%;
`;
const StyledTimer = styled.div`
    display:grid;
    color:crimson;
`;

//------------------------------ COMPONENT ----------------------------------
const Carousel = React.memo(({data}) => {
    //init
    const settings = { 
        dots: false, 
        arrows: true, 
        infinite: false, 
        speed: 500, 
        slidesToShow: 4, 
        slidesToScroll: 1, 
        autoplay: false
    };

    //function
    const Timer = ({ex}) => {
        const expiryTimestamp = new Date();
        expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + ex);
        const {
            seconds,
            minutes,
            hours
        } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });

        return (
            <StyledTimer>{hours}:{minutes < 10 ? `0${minutes}`: minutes}:{seconds < 10 ? `0${seconds}` : seconds}</StyledTimer>
        )
    }

    return (
        <>
        <StyledSlider {...settings}> 
            {data.map((item, index)=>{
                return (
                    <StyledBox key={index}>
                        <StyledImg src={item.img}/>
                        {item.time ? <StyledTime><Timer ex={item.time} /></StyledTime> : null}
                        {item.price ? <StyledPrice>{priceForm(item.price)}</StyledPrice> : null}
                    </StyledBox>
                )
            })}
        </StyledSlider>                
        </>

    )    
});

export default Carousel;