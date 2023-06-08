//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { MdClose } from "react-icons/md";
import React, { useMemo, useState, useEffect } from 'react';
import { Motion } from 'component';
import { useNavigate } from "react-router-dom";

//------------------------------ CSS ----------------------------------------
const StyledContainer = styled.div`
    display:grid;
    position:fixed;
    top:0;
    left:0;
    margin-left:auto;
    width:100%;
    height:100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index:5;
    justify-items:center;
    align-items:center;
    overflow:hidden;
`;
const StyledContents = styled.div`
    display:grid;
    width:${(props) => props.w};
    height:${(props) => props.h};
    grid-template-rows: 1fr 1fr 200fr 1fr;
    padding:3% 5% 7% 5%;
    background:white;
    overflow-y:hidden;
    border-radius:${(props)=> props.sink ? "15px 15px 0 0" : "15px"};
    align-self: ${(props)=> props.sink ? "end" : "center"}
`;
const StyledTitle = styled.div`
    display:grid;
    grid-template-columns: 1fr 8fr 1fr;
    font-weight:550;
`;
const StyledClose = styled.div`
    display:grid;
    background:white;
    justify-content:end;
    svg{
        cursor:pointer;
    }
`;
const StyledBody = styled.div`
    display:grid;
    overflow-y:${(props) => props.ov};
    margin:5%;
    background:white;
    font-size:${(props) => props.fs};
    text-align:${(props) => props.ta};
    align-content:${(props) => props.ac};
`;
const StyledButtonArea = styled.div`
    display:grid;
    padding:5% 5% 0 5%;
    grid-template-columns: 1fr ${(props)=>props.type==2 ? "1fr":null};
    grid-column-gap:10%;
`;
const StyledButton = styled.div`
    display:grid;
    font-size:0.8em;
    background:${(props) => props.bg};
    color:white;
    align-content:center;
    padding:0.6em;
    border-radius:0.5em;
    ${(props)=>props.type==1 ? "display:none;" : null}
    font-weight:${(props) => props.weight};
    cursor:pointer;
`;

//------------------------------ COMPONENT ----------------------------------
const Modal = ({ 
    data, 
    state, 
    type, 
    option, 
    noClose=false, 
    vUse=null, 
    closeEvent=(() => {console.log('need closeEvent')}), 
    proEvent=(() => true), consEvent=(() => true),
    pre=false 
}) => {
    //init
    const navigate = useNavigate(); 
    const setOption = option ? option : {
        width : "70%", 
        height : "70%", 
        textAlign : "center", 
        alignContent : "center",
        fontSize : "0.1em", 
        buttonName : ["확인", "취소"],
        buttonStyle : 'normal',
        overflow: null,
        sink: false,
        motion: false,
    };

    //state
    const [v, setV] = useState(true);

    //func
    const close = () => {
        if(vUse) return vUse.closeEvent();

        let delay = 0;
        if(setOption.motion){
            setV(false);
            delay=100;
        } 
        setTimeout(() => {
            closeEvent();
            setV(true);
        }, delay);
    }

    const pro = () => {
        if(proEvent) {
            const chk = proEvent();
            if(!chk) return;
        }
        close();
    }

    const cons = () => {
        if(consEvent) {
            const chk = consEvent();
            if(!chk) return;
        }        
        close();
    }

    //effect
    useEffect(() => {
        if(state){ //body scroll block
            document.body.style.cssText = `
                position: fixed; 
                top: -${window.scrollY}px;
                width: 100%;
            `;
        }else if(document.body.style.position == 'fixed'){
            const scrollY = document.body.style.top;
            document.body.style.cssText = '';
            window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
        }
    }, [state]);    

    useEffect(() => { //scroll task clean up
        return () => {
            if(document.body.style.position == 'fixed') document.body.style.cssText = '';
        }
    }, []);    

    //memo
    const modalGear = useMemo(() => {
        return (
            <StyledContents w={setOption.width} h={setOption.height} sink={setOption.sink} onClick={(e) => e.stopPropagation()}>
                <StyledClose>{!noClose ? <MdClose size="1.2em" onClick={() => close()}/> : null}</StyledClose>
                {(data.title) ? 
                    <StyledTitle>
                    <div />
                    {data.title}
                    </StyledTitle>
                    :
                    <div />                
                }
                <StyledBody className={window.self != window.top ? 'iframeScroll' : null} bodyType={type} fs={setOption.fontSize} ta={setOption.textAlign} ac={setOption.alignContent} ov={setOption.overflow}>
                    {pre ? <pre style={{textAlign:"start", whiteSpace:"pre-wrap"}}>{data.desc}</pre> : data.desc}
                </StyledBody>
                {(type != 0 ) ? 
                    <StyledButtonArea type={type}>
                        <StyledButton onClick={pro} bg="crimson" weight={setOption.buttonStyle}>{setOption.buttonName[0]}</StyledButton>
                        <StyledButton type={type} onClick={cons} bg="grey" weight={setOption.buttonStyle}>{setOption.buttonName[1]}</StyledButton>
                    </StyledButtonArea>
                    : 
                    null
                }
            </StyledContents>
        )
    })

    //render
    return state ? (
        !setOption.motion ? (
            <StyledContainer onClick={() => !noClose ? close() : null}>
                {modalGear}
            </StyledContainer>
        ) : (
            <StyledContainer onClick={() => !noClose ? close() : null}>
                <Motion 
                    isVisible={vUse ? vUse.v : v} 
                    w="100%" 
                    h="100%" 
                    sink={setOption.sink}
                    initial={{y:300, opacity:1}}
                    animate= {{y:0, opacity:1}}
                    exit={{y:500, opacity: 1}}
                    overflow="none"                    
                >
                    {modalGear}
                </Motion>
            </StyledContainer>
        )
    ) : (
        null
    );
};

export default Modal;

