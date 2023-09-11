//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { kakaoShare, makeInvitation } from "lib";
import { RiKakaoTalkFill } from "react-icons/ri";

//------------------------------ COMPONENT ----------------------------------
const InviteGuest = ({id=null}) => {
    //function
    const send = async() => {
        const invitation = await makeInvitation(id);
        if(!invitation) return null;
        //exec
        kakaoShare(invitation);        
    }

    //render
    return (
        <>
        <StyledButton onClick={() => send()}>
            {`친구 초대하고 포인트 받기`}
        </StyledButton>
        <StyledExtra>
            * 초대받은 대상이 <StyledHighlight>탈퇴</StyledHighlight> 후 <StyledHighlight>재가입</StyledHighlight> 시, 포인트가 <StyledHighlight>중복지급</StyledHighlight>되지 않습니다.
        </StyledExtra>
        </>
    );
};

export default InviteGuest;

//------------------------------ CSS ----------------------------------------
const StyledButton = styled.div`
    background:crimson;
    color:white;
    border-radius:5px;
    text-align:center;
    font-size:1em;
    padding: 5px;
    font-weight:600;
    cursor:pointer;
`;
const StyledExtra = styled.div`
    font-size:0.5em;
    color:#aaa;
    font-weight:500;
    text-align:start;
    margin-top:3px;
`;
const StyledHighlight = styled.span`
    color:crimson;
    font-weight:600;
`;