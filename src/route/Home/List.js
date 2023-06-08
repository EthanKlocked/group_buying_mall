//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { ItemList } from "component";
import React from "react";

//------------------------------ CSS ----------------------------------------
const StyledList = styled.div`    
`;

//------------------------------ COMPONENT ----------------------------------
const List = React.memo(({categoryId, rows=8}) => { 
    //render
    return (
        <>
        <StyledList>
            <ItemList category={categoryId}/>
        </StyledList>
        </>
    );
});

export default List;