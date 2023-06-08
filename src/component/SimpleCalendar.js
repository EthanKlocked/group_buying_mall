//------------------------------ MODULE -------------------------------------
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { ko } from 'date-fns/esm/locale';

//------------------------------ CSS ----------------------------------------
const StyledDatePicker = styled(DatePicker)`
`;

//------------------------------ COMPONENT ----------------------------------
const SimpleCalendar = React.memo(({dt}) => {
    //state
    const [startDate, setStartDate] = useState(new Date(dt));

    //render
    return (
        <>
        <StyledDatePicker 
            dateFormat="yyyy년 MM월 dd일"
            selected={startDate} 
            onChange={date => setStartDate(date)}
            locale={ko}
        />
        </>
    ); 
});

export default SimpleCalendar;