//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { FaQuestionCircle } from "react-icons/fa";
import React, {useState, useMemo} from "react";
import {Modal} from "component";

//------------------------------ CSS ----------------------------------------
const StyledQuestionIcon = styled.span`
    font-size:1.2em;
    color:#555;
    cursor:pointer;
    svg{
        vertical-align:middle;
    }
`;

//------------------------------ COMPONENT ----------------------------------
const QuestionIcon = React.memo(({title = null, content=null, style={}}) => {
    //state
    const [modal, setModal] = useState(false);

    //memo
    const infoGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "80%", 
                    height : "40%", 
                    textAlign : "left", 
                    alignContent : "start",  
                    fontSize : "0.2em", 
                    buttonName : ["확인"],
                    overflow: 'auto'
                }} 
                type={1}
                pre={true}
                data={{title:title, desc:content}} 
                state={modal} 
                closeEvent={() => setModal(false)}
            />
        )
    }, [modal]);

    //render
    return (
        <StyledQuestionIcon style={style} onClick={() => setModal(true)}>
            <FaQuestionCircle />
            {infoGear}
        </StyledQuestionIcon>
    );
});

export default QuestionIcon;