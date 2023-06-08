//------------------------------ MODULE -------------------------------------
import React, { useState, useRef, useEffect } from 'react';
import styled from "styled-components";
import AvatarEditor from 'react-avatar-editor';
import { MdAddAPhoto } from "react-icons/md";
import { dataURLtoFile } from "lib";

//------------------------------ CSS ----------------------------------------
const StyledImgUpload = styled.span`
    display:inline-block;
    vertical-align:middle;
    height:${(props) => props.h+1}px;
    width:${(props) => props.w+1}px;
    border-radius:0.3em;
    border: solid 0.1em #eee;
    color:#ddd;
    cursor:pointer;
    svg{
        margin-top:30%;
    }
    margin-right:0.5em;
`;

//------------------------------ COMPONENT ----------------------------------
const ImageUploadBox = ({ w=100, h=100, fontSize=10, saveSize=300, imgCallback=() => {}, defaultImg = null }) => { 
    //ref
    const imgInput = useRef();
    const editor = useRef(null);
    const realEditor = useRef(null);

    //state
    const [imgName, setImgName] = useState(null);

    //function
    const onImgInputBtnClick = (e) => {
        imgInput.current.click();
    };

    const fileChange = (e) => { 
        if(e.target.files[0]) setImgName(e.target.files[0]);
    };

    const imageChange = () => imgCallback(realEditor.current.getImageScaledToCanvas().toDataURL() || null);

    //effect
    useEffect(() => {
        if(!defaultImg) return;
        setImgName(dataURLtoFile(defaultImg));
    }, [defaultImg]);

    return (
        <StyledImgUpload onClick={onImgInputBtnClick} w={w} h={h}>
            <input style={{ display:"none" }} ref={imgInput} type='file' accept='image/*' onChange={ fileChange } />
            {imgName ? 
                <>
                    <AvatarEditor
                        ref={editor}
                        image={imgName}
                        width={w}
                        height={h}
                        border={0}
                        borderRadius={3}
                        color={[255, 255, 255, 1.0]}
                        scale={1}
                        rotate={0}
                    />
                    <AvatarEditor
                        style={{display:'none'}}
                        ref={realEditor}
                        image={imgName}
                        width={saveSize}
                        height={saveSize}
                        border={0}
                        borderRadius={3}
                        color={[255, 255, 255, 1.0]}
                        scale={1}
                        rotate={0}
                        onImageReady={imageChange}
                    />                        
                </> 
                : 
                <>
                    <MdAddAPhoto size="2em" />
                    <div style={{fontSize:`${fontSize}px`}}>사진 업로드</div>                    
                </>                
            } 
        </StyledImgUpload>
    );
};

export default ImageUploadBox;