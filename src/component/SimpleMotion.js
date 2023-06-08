//------------------------------ MODULE -------------------------------------
import { motion, AnimatePresence } from 'framer-motion';
import styled from "styled-components";
import React, { useState, useEffect } from 'react';

//------------------------------ CSS ----------------------------------------
const StyledMotion = styled(motion.div)`
    display: ${(props) => props.display};
    ${(props) => props.pagecover ? "height:100%; overflow: hidden;" : null}
`;

//------------------------------ COMPONENT ----------------------------------
const SimpleMotion = React.memo(({children, isVisible = 1, duration=0.35, pagecover=1, display="block"}) => {
    //render
    return (
        <AnimatePresence>
            {isVisible && (
                <StyledMotion
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: duration,
                    }}
                    pagecover={pagecover}
                    display={display}
                >
                    {children}
                </StyledMotion>
            )}
        </AnimatePresence>
    );
});

export default SimpleMotion;