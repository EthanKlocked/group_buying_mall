//------------------------------ MODULE -------------------------------------
import React, { useState, useMemo } from "react";
import DatePicker from 'react-mobile-datepicker';
import styled from "styled-components";
import { CgSelect } from "react-icons/cg";

//------------------------------ CSS ----------------------------------------
const StyledCgSelect = styled(CgSelect)`
    color:crimson;
    vertical-align:text-bottom;
`;

//------------------------------ COMPONENT ----------------------------------
const MobileDatePicker = React.memo(({dt, callback}) => {
    //init
    const monthMap = {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '10': '10',
        '11': '11',
        '12': '12',
    };
     
    const dateConfig = {
        'year': {
            format: 'YYYY년',
            caption: 'Year',
            step: 1,
        },
        'month': {
            format: value => String(monthMap[value.getMonth() + 1])+'월',
            caption: 'Mon',
            step: 1,
        },
        'date': {
            format: 'DD일',
            caption: 'Day',
            step: 1,
        },
    };

    //state
    const [isOpen, setIsOpen] = useState();
    const [time, setTime] = useState(dt);

    //function
    const handleClick = () => {
        setIsOpen(true);
    }
 
    const handleCancel = () => {
        setIsOpen(false);
    }
 
    const handleSelect = (time) => {
        setTime(time);
        setIsOpen(false);
        if(callback) callback(`${String(time.getFullYear())}-${String(time.getMonth()+1)}-${String(time.getDate())}`);
    }    

    //memo
    const selectMark = useMemo(() => {
        return (
            <StyledCgSelect size="1.5em"/>
        )
    }, [])

    //render
    return (
        <>
            <a
                data-birth={time ? `${String(time.getFullYear())}-${String(time.getMonth()+1)}-${String(time.getDate())}` : null}
                className="select-btn"
                onClick={handleClick}
            >
                {time ? `${String(time.getFullYear())}년 ${String(time.getMonth()+1)}월 ${String(time.getDate())}일` : '클릭하여 선택 해 주세요'}
                {selectMark}
            </a>
            <DatePicker
                dateConfig={dateConfig}
                value={time ? time : undefined}
                isOpen={isOpen}
                onSelect={handleSelect}
                onCancel={handleCancel} 
                confirmText="선택"
                cancelText="취소"
            />        
        </>
    ); 
});

export default MobileDatePicker;