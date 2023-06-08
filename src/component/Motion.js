//------------------------------ MODULE -------------------------------------
import { motion , AnimatePresence } from 'framer-motion';
import styled from "styled-components";
import React from 'react';

//------------------------------ CSS ----------------------------------------
const StyledMotion = styled(motion.div)`
    width:${(props) => props.w};
    height:${(props) => props.h};

    ${(props) => props.sink ? 
        'display:grid; align-self:end;' : 
        null
    }

    overflow: hidden;
    ${(props)=>props.overflow=='y' ? 'overflow-y: scroll;' : ''};
    ${(props)=>props.overflow=='x' ? 'overflow-x: scroll;' : ''};
    ${(props)=>{
        if(props.position){
            return 'position:absolute; top:0; left:0; z-index:5;'
        }
    }};
`;

//------------------------------ COMPONENT ----------------------------------
const Motion = React.memo(({ 
        isOn=1,
        isVisible, 
        children, 
        overflow='y', 
        position=null, 
        w='100%', 
        h='100%', 
        duration=0.4,
        sink=null,
        initial={ x:300, opacity:1 },
        animate= { x:0, opacity:1 },
        exit={ x:500, opacity: 1}
    }) => isOn ? (        
        <AnimatePresence>
            {isVisible && (
                <StyledMotion
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    transition={{ ease: "easeOut", duration: duration }}
                    overflow = {overflow}
                    position = {position}
                    w={w}
                    h={h}
                    sink={sink}
                >
                    {children}
                </StyledMotion>
            )}
        </AnimatePresence>
    ) : <>{children}</>
);

export default Motion;

