//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { FcCollaboration, FcCurrencyExchange, FcShipped, FcUndo } from "react-icons/fc";
import linkIcon from 'data/img/linkIcon.png';

//------------------------------ CSS ----------------------------------------
const StyledModalTitle = styled.div`
    display:grid;
    font-weight:bold;
    font-size:1.5em;
    padding-bottom:5%;
`;
const StyledModalIcon = styled.div`
    display:grid;
    justify-content:center;
    padding-bottom:10%;
`;
const StyledModalContent = styled.div`
    display:grid;
    font-size:1em;
    margin-bottom:15%;
`;

//------------------------------- DATA --------------------------------------
const guideData = [
    (
        <>
        <StyledModalTitle>
            alldeal 팀구매 안내
            <br/>
            <br/>
        </StyledModalTitle>
        <StyledModalIcon><FcCollaboration size="6em"/></StyledModalIcon>
        <StyledModalContent>
            팀 구매로 할인 혜택을 받아보세요!
            <br/>
            전상품 상시 무료 배송은 덤!
        </StyledModalContent>
        </>
    ),
    (
        <>
        <StyledModalTitle>
            팀구매 버튼으로 
            <br/>
            먼저 결제 하세요.
        </StyledModalTitle>
        <StyledModalIcon><FcCurrencyExchange size="6em"/></StyledModalIcon>
        <StyledModalContent>
            팀 구매 열기 혹은 참여하기 버튼을!
            <br/>
            누르고 결제를 진행하세요.
        </StyledModalContent>
        </>
    ),
    (
        <>
        <StyledModalTitle>링크를 공유해 함께 구매할 새 팀원을 데려오세요.</StyledModalTitle>
        <StyledModalIcon>
            <img src={linkIcon}/>
        </StyledModalIcon>
        <StyledModalContent>
            참여한 팀원 각자 공유 버튼을 눌러 
            <br/>
            링크를 공유하고, 새 팀원을 데려오세요.
        </StyledModalContent>
        </>
    ),
    (
        <>
        <StyledModalTitle>
            24시간 내에 팀 구매를 
            <br/>
            성공해요.
        </StyledModalTitle>
        <StyledModalIcon><FcShipped size="6em"/></StyledModalIcon>
        <StyledModalContent>
            팀원이 모두 모이면 개별 배송지로
            <br/>
            무료 배송이 시작돼요.
        </StyledModalContent>
        </>
    ),
    (
        <>
        <StyledModalTitle>
            팀 구매 실패 시, 
            <br/>
            환불 가능해요.
        </StyledModalTitle>
        <StyledModalIcon><FcUndo size="6em"/></StyledModalIcon>
        <StyledModalContent>
            실패 시, 모인 팀원과 재도전하거나
            <br/>
            각자 결제를 취소할 수 있어요.
        </StyledModalContent>
        </>
    )
];

export default guideData;