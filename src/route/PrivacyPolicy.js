//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { Title } from "component";
import { termsData } from "static";
import { useContext } from "react";
import { BaseContext } from "context";
import { stripslashes } from "lib";

//------------------------------ CSS ----------------------------------------
const StyledCompanyInfo = styled.div`
    overflow:hidden;
    height:100%;
    p{
        text-align:start;
    }
`;
const StyledContent = styled.div`
    margin:6em 1.5em;
    overflow-y:auto;
    height:calc(100% - 12em);
    font-size:0.7em;
    pre{
        text-align:start;
        white-space:pre-wrap;
        height:100%;
        padding: 0 1em;
    }
    div{
        text-align:start;
        padding: 0 1em;
    }
`;

//------------------------------ COMPONENT ----------------------------------
const TermsOfUse = () => {
    //init
    const title = termsData.private.title;
    const desc = termsData.private.desc;
    const { base } = useContext(BaseContext);

    //render
    return (
        <>
        <StyledCompanyInfo>
            <Title text={title} windowClose={window.opener}/>
            <StyledContent className={window.self != window.top ? 'iframeScroll' : null}>                
                {base.policy ? (
                    <div dangerouslySetInnerHTML={{__html:stripslashes(base.policy)}} />
                ) : (
                    <pre>
                        {desc}
                    </pre>
                )}
            </StyledContent>
        </StyledCompanyInfo>
        </>
    )
}

export default TermsOfUse;