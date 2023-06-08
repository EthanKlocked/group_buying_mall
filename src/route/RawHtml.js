//------------------------------ MODULE -------------------------------------
import { useLocation, } from "react-router-dom";
import styled from "styled-components";
import { Title } from "component";
import { stripslashes } from "lib";

//------------------------------ CSS ----------------------------------------
const StyledRawHtml = styled.div`
    overflow:hidden;
    height:100%;
    p{
        text-align:start;
    }
`;
const StyledContent = styled.div`
    margin:4.5em 1em;
    overflow-y:auto;
    height:calc(100% - 6em);
`;

//------------------------------ COMPONENT ----------------------------------
const RawHtml = () => {
    //init
    const { state } = useLocation();

    //render
    return (
        <>
        <StyledRawHtml>
            <Title text={state.title}/>
            <StyledContent>
                <div dangerouslySetInnerHTML={{__html:stripslashes(state.content)}} />
            </StyledContent>
        </StyledRawHtml>
        </>
    )
}

export default RawHtml;