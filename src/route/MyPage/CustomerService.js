//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { Title } from "component";
import { RiKakaoTalkFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

//------------------------------ CSS ----------------------------------------
const StyledCustomerService = styled.div`
    overflow:hidden;
    height:100%;
`;
const StyledContent = styled.div`
    margin:3.5em 0;
    overflow-y:auto;
    height:calc(100% - 3em);
`;
const StyledSection = styled.div`
    padding:2%;
`;
const StyledSectionTitle = styled.div`
    text-align:start;
    font-weight:bold;
    width:95%;
    margin:auto;
`;
const StyledMainText = styled.div`
    font-size:0.9em;
    color:#555;
    padding:1.5em 0;
    font-weight:bold;
`;
const StyledSubText = styled.div`
    font-size:0.7em;
    padding: 0.3em 0;
    color:#999;
`;
const StyledButtonArea = styled.div`
`;
const StyledButton = styled.span`
    display:inline-block;
    background:crimson;
    color:white;
    border-radius:0.3em;
    font-weight:550;
    line-height:2.3em;
    margin:0.5em;
    width:45%;
    cursor:pointer;
`;
const StyledkakaoLink = styled.div`
    background: #FEE500;
    height:3em;
    width:95%;
    margin:auto;
    line-height:3em;
    font-weight:550;
    position:relative;
`;
const StyledKakaoIcon = styled.div`
    position:absolute;
    left:1em;
    top:0.5em;
`;

//------------------------------ COMPONENT ----------------------------------
const CustomerService = () => {
    //init
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    //render
    return (
        <StyledCustomerService>
            <Title text='고객센터'/>
            <StyledContent>
                <StyledSection>
                    <StyledMainText>alldeal 또는 주문하신 상품 관련 문의가 있으신가요?</StyledMainText>
                    <StyledSubText>{`[상품 문의하기]에서 판매자에게`}</StyledSubText>
                    <StyledSubText>{`정확하고 빠른 답변을 받으실 수 있어요`}</StyledSubText>
                </StyledSection>
                {token ? (
                    <StyledSection>
                        <StyledButtonArea>
                            <StyledButton onClick={() => navigate('/MyPage/MyCatch')}>내 조회 내역 바로가기</StyledButton>
                            <StyledButton onClick={() => navigate('/MyPage/OrderInfo', { state: { orderState: 2 } })}>내 주문 현황 바로가기</StyledButton>
                        </StyledButtonArea>
                    </StyledSection>
                ) : null}

                <StyledSection style={{'display' : 'none'}}>
                    <StyledSectionTitle>자주 묻는 질문</StyledSectionTitle>
                    QuestionArea
                </StyledSection>
                <StyledSection>
                    <StyledkakaoLink>
                        <StyledKakaoIcon>
                            <RiKakaoTalkFill size="1.8em"/>
                        </StyledKakaoIcon>                        
                        <a href={process.env.REACT_APP_KAKAO_CHANNEL} target="_blank">카카오톡으로 1:1 문의하기</a>
                    </StyledkakaoLink>
                </StyledSection>
            </StyledContent>
        </StyledCustomerService>
    )
}

export default CustomerService;