//------------------------------ MODULE -------------------------------------
import React, { useState, useMemo, useRef, useCallback } from 'react'
import styled from "styled-components";

//------------------------------ CSS ----------------------------------------
const StyledTimer = styled.div`        
    display:grid;
    font-size 0.9em;
    color:#E73737;
`;

//------------------------------ COMPONENT ----------------------------------
const Timer = React.memo(({max, stop, type}) => {
    //ref
    const time = useRef(max);
    const timerId = useRef(null);

    //state
    const [hour, setHour] = useState(parseInt(time.current/3600));
    const [min, setMin] = useState(parseInt(time.current%3600/60));
    const [sec, setSec] = useState(time.current%60);

    //func
    const timerExec = useCallback(() => {
        setHour(parseInt(time.current/3600));
        setMin(parseInt(time.current%3600/60));
        setSec(time.current%60);
        time.current -= 1;
    }, [time]);
    const addZero = (num) => {
        return num > 9 ? num : `0${num}`;
    }

    //effect
    useMemo(() => {
        setTimeout(() => {
            timerExec();    
        });
        timerId.current = setInterval(() => {
            timerExec();
        }, 1000)
    }, []);

    useMemo(() => {
        if(time.current<0){
            clearInterval(timerId.current);
            stop();
        }
    },[sec]);

    //render
    return (
        <>
            {type == 'h' ? 
                <StyledTimer>{addZero(hour)}:{addZero(min)}:{addZero(sec)}</StyledTimer>
                : 
                <StyledTimer>{min}:{addZero(sec)}</StyledTimer>
            }
            
        </>
    );     
});

export default Timer;