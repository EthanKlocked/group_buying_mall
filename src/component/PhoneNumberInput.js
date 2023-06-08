//------------------------------ MODULE -------------------------------------
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import React, { useState } from "react";

//------------------------------ CSS ----------------------------------------

//------------------------------ COMPONENT ----------------------------------
const PhoneNumberInput = React.memo(() => {
    //state
    const [value, setValue] = useState()

    //render
    return (
    <PhoneInput
        defaultCountry="KR"
        value={value}
        onChange={setValue} />
    )
});

export default PhoneNumberInput;