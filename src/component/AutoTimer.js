//------------------------------ MODULE -------------------------------------
import React, {useMemo, forwardRef, useImperativeHandle} from 'react';
import styled from "styled-components";
import { useTimer } from 'react-timer-hook';

//------------------------------ CSS ----------------------------------------
const StyledAutoTimer = styled.span`        
    font-weight:bold;
`;

//------------------------------ COMPONENT ----------------------------------
const AutoTimer = forwardRef(({type="m", timeSet, expireEvent = () => {}}, ref) => {
    //init
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + timeSet);

    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({ expiryTimestamp, onExpire: () => expireEvent() });

    //function
    const timeReset = (resetTime) => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + resetTime);
        restart(time)
    }

    //ref connect
    useImperativeHandle(ref, () => ({ timeReset, pause }));    

    //memo
    const secondsGear = useMemo(() => {
        return (
            <span className="autoTimerS">{seconds<10 && type!="s"?'0':null}{seconds}</span>
        );
    }, [seconds]);

    const minutesGear = useMemo(() => {
        return type!="s" ? (
            <span className="autoTimerM">{minutes<10?'0':null}{minutes} : </span>
        ) : null;
        
    }, [minutes]);    
    
    const hoursGear = useMemo(() => {
        return type=="h" ? (
            <span className="autoTimerH">{hours<10?'0':null}{hours} : </span>
        ) : null;
    }, [hours]);    

    //render
    return (
        <StyledAutoTimer id="autoTimer">
        {hoursGear}
        {minutesGear}
        {secondsGear}
        </StyledAutoTimer>
    );     
});

export default AutoTimer;