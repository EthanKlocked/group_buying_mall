//------------------------------ MODULE -------------------------------------
import React from 'react'
import styled from "styled-components";

//------------------------------ CSS ----------------------------------------
const StyledContent = styled.div`   
    display:grid;
`;
const StyledCheckList = styled.div`        
    grid-template-columns: 2fr 1fr;
    display:grid;
`;
const StyledCheckArea = styled.div`   
    grid-template-columns: 1fr 8fr;
    display:grid;
    cursor:pointer;
`;
const StyledCheckBox = styled.input`        
    align-self:center;
`;
const StyledCheckText = styled.div`        
    display:grid;
    font-weight:${(props)=>props.weight};
    font-size:${(props)=>props.size};
    align-self:center;
    justify-self:left;
    grid-template-columns: 1fr auto;
    column-gap: 1em;
`;
const StyledDetail = styled.div`
    display:grid;
    font-size:0.7em;
    align-self:center;
    cursor:pointer;
`;

//------------------------------ COMPONENT ----------------------------------
const CheckList = React.memo(({list, allChk, eachHandler, allHandler, openModal}) => {
    //render
    return (
        <>
            <StyledContent>
                <StyledCheckList onClick={() => allHandler()}>
                    <StyledCheckArea>
                        <StyledCheckBox type="checkbox" checked={allChk} readOnly/>
                        <StyledCheckText weight="bold" size="0.8em" >아래 약관에 모두 동의합니다.</StyledCheckText>
                    </StyledCheckArea>
                </StyledCheckList>
                {list.map((item, index)=>(
                    <StyledCheckList key={index}>
                        <StyledCheckArea onClick={() => eachHandler(index)}>
                            <StyledCheckBox type="checkbox" checked={item.checked} readOnly/>
                            <StyledCheckText weight="normal" size="0.7em" >{item.title} {item.required ? '(필수)' : '(선택)'}</StyledCheckText>
                        </StyledCheckArea>
                        <StyledDetail onClick={()=>openModal(index)}>자세히 보기</StyledDetail>
                    </StyledCheckList>
                ))}
            </StyledContent>  
        </>
    );     
});

export default CheckList;