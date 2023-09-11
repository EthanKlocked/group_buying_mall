//------------------------------ MODULE -------------------------------------
import {ErrorBoundary} from 'react-error-boundary'
import styled from "styled-components";
import errorCat from "data/img/errorCat3.png";

//------------------------------ CSS ----------------------------------------
const StyledContainer = styled.div`
    position:fixed;
    height:200%;
    width:100%;
`;
const StyledTitle = styled.div`
    margin: 3em 0;
    position: relative;
    z-index: 1;
    font-size: 2em;
    font-weight: bold;
    text-align: start;
    padding: 0 1em;
`;
const StyledDesc = styled.div`
    margin: 5em 0;
    position: relative;
    z-index: 1;
    color: #888;
    padding: 0 2em;
    div{
        text-align:start;
    }
`;
const StyledButton = styled.div`
    margin: 1em 2em;
    font-weight: bold;
    font-size: 1em;
    padding: 0.3em 1em;
    color: white;
    position: relative;
    z-index: 1;
    border-radius: 1em;
    background: crimson;
    width:7em;
    cursor:pointer;
`;
const StyledBackgroundImage = styled.img`
    position: fixed;
    width:100%;
    bottom: 0%;
    left: 0%;
`;
//------------------------------ COMPONENT ----------------------------------
function ErrorFallback({error, resetErrorBoundary}) {
    console.log(error);
    return (
        <StyledContainer role="alert">
            <StyledTitle>
                Error!
            </StyledTitle>
            <StyledDesc>
                <div>페이지 내 요청이 잘못되었습니다!</div>
                <div>문제가 계속될 경우 올딜 관리자에게 문의 해 주세요!</div>
            </StyledDesc>
            <StyledButton onClick={() => window.location.replace(`${process.env.REACT_APP_HOST}`)}>
                홈으로 이동
            </StyledButton>
            <StyledBackgroundImage src={errorCat}/>
        </StyledContainer>
    )
}

const ErrorHandler = ({children}) => {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // reset the state of your app so the error doesn't happen again
            }}
        >
            {children}
        </ErrorBoundary>
    )    
}

export default ErrorHandler;