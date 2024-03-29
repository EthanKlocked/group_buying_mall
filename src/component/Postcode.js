//------------------------------ MODULE -------------------------------------
import React from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode';
import styled from "styled-components";

//------------------------------ CSS ----------------------------------------
const StyledPostcodeEmbed = styled(DaumPostcodeEmbed)`
`;

//------------------------------ COMPONENT ----------------------------------
const Postcode = ({ complete }) => {
    const props = {};

    const handleComplete = (data) => {
        let fullAddress = data.address;
        const zonecode = data.zonecode;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        complete(fullAddress, zonecode);
    };

    return <StyledPostcodeEmbed submitMode={false} onComplete={handleComplete} {...props} />;
};

export default Postcode;