//------------------------------ MODULE -------------------------------------
import { useLocation, } from "react-router-dom";
import styled from "styled-components";
import { Title, MyQaList } from "component";

//------------------------------ CSS ----------------------------------------
const StyledMyQa = styled.div`
    overflow:hidden;
    height:100%;
`;
const StyledContent = styled.div`
    margin:3.5em 0;
    overflow-y:auto;
    height:calc(100% - 3em);
`;

//------------------------------ COMPONENT ----------------------------------
const MyQa = () => {
    //init
    const { state } = useLocation();
    console.log(state.memberId);

    //render
    return (
        <StyledMyQa>
            <Title text='문의내역'/>
            <StyledContent>
                <MyQaList limit={10} memberId={state.memberId}/>
            </StyledContent>
        </StyledMyQa>
    )
}

export default MyQa;