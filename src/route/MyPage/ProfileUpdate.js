//------------------------------ MODULE -------------------------------------
import { useCallback, useState, useMemo, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AvatarEditor from 'react-avatar-editor';
import { Title, MobileDatePicker, Modal } from "component";
import { apiCall } from "lib";
import { SelfContext } from "context";
import { msgData } from "static";

//------------------------------ CSS ----------------------------------------
const StyledProfile = styled.div`
    height:100%;
`;
const StyledContent = styled.div`
    padding:4.5em 6% 0 6%;
`;
const StyledInfo = styled.div`
    display:grid;
    margin:2% 1%;
`;
const StyledInfoTitle = styled.span`
    margin:0 1%;
    text-align:start;
    font-size:0.8em;
    font-weight:bold;
    vertical-align:center;
`;
const StyledInput = styled.input`
    background:#eee;
    padding:0.5em 2%;
    margin: 1%;
    border-radius:0.5em;
    font-size:0.8em;
`;
const StyledCalendar = styled.div`
    display:grid;
    margin:0 1%;
    justify-content:start;
    cursor:pointer;
`;
const StyledImportant = styled.div`
    display:grid;
    grid-template-columns: repeat(2, 1fr);
    margin:1%;
`;
const StyledImportantText = styled.div`
    margin:1%;
    text-align:start;
    font-size:0.8em;
    color:#555;
`;
const StyledImportantLink = styled.div`
    display:grid;
    background:crimson;
    border-radius: 0.5em;
    color:white;
    margin:1%;
    width:50%;
    justify-self:end;
    font-size:0.8em;
    align-items:center;
    padding:0.4em;
    cursor:pointer;
`;
const StyledToggleBox = styled.div`
    display:grid;
    margin:1%;
    grid-template-columns: repeat(4, 1fr);
    height:100%;
`;
const StyledToggle = styled.label`
    display:grid;
    margin:2%;
    width:80%;
    font-size:0.8em;
    border-radius:0.5em;    
    border: solid 0.1em #aaa;
    align-items:center;
    padding:0.3em 0.2em;
    cursor:pointer;
`;
const StyledRadio = styled.input`
    display:none;
    &:checked + ${StyledToggle} {
        background: crimson;
        color:white;
        border: solid 0.1em crimson;
    }
`;
const StyledImageTitle = styled.div`
    display:grid;
    grid-template-columns: repeat(2, 1fr);
`;
const StyledImageText = styled.div`
    display:grid;
    justify-items:start;
    margin:2%;
    font-size:0.8em;
    font-weight:bold;
`;
const StyledImageUpload = styled.div`
    display:grid;
    margin:2%;
    background:crimson;
    padding:0.4em;
    width:80%;
    justify-self:end;
    align-items:center;
    border-radius:0.5em;
    color:white;
    font-size:0.8em;
    cursor:pointer;
`;
const StyledImageContent = styled.div`
    display:grid;     
    margin:2%;
    width:120px;
    height:120px;
    justify-self:center;
    justify-items:center;
    grid-column: 1 / span 2;
    canvas{
        border-radius:50%;
    }
`;
const StyledSubmit = styled.div`
    display:grid;
    color:white;  
    background:crimson;
    align-items:center;
    font-size:0.8em;
    padding:0.7em;
    border-radius:0.5em;
    cursor:pointer;
`;
const StyledEmpty = styled.div`
    height:5em;
`;
const StyledSubtitle = styled.span`
    color:crimson;
    font-weight:normal;
    font-size:0.5em;
    margin-left:3em;
    display:${(props) => props.chk ? 'inline':'none'}
`;

//------------------------------ COMPONENT ----------------------------------
const ProfileUpdate = () => {
    //context
    const { self } = useContext(SelfContext);

    //init
    const navigate = useNavigate();    

    //ref
    const name = useRef();
    const phone = useRef();
    const email = useRef();
    const birth = useRef();
    const m = useRef();
    const w = useRef();
    const editor = useRef(null);
    const imgInput = useRef();
    
    //state
    const [imgName, setImgName] = useState(self.img);
    const [nameChk, setNameChk] = useState(false);
    const [modal, setModal] = useState(false);

    //function 
    const movePrivate = useCallback((type) => {
        navigate('/MyPage/PrivateInfoUpdate', {state: { type: type} });
    }, [])

    const onImgInputBtnClick = (e) => {
        e.preventDefault();
        imgInput.current.click();
    }

    const save = async() => {
        try{
            if(editor){
                const editedImg = editor.current.getImageScaledToCanvas().toDataURL() || null;
                if(!name.current.value){
                    return setNameChk(true);
                }else{
                    setNameChk(false);
                }
                const params = {
                    cellphone : phone.current.innerHTML,
                    emailser : email.current.innerHTML=='없음' ? null : email.current.innerHTML,
                    img : editedImg,
                    name : name.current.value,
                    birth : birth.current.children[0].dataset.birth,
                    gender : m.current.checked ? 'm' : 'w'
                }
                const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
                const result = await apiCall.put("/member", {params}, {headers});    
                return (result.data == '000' || result.data == '001') ? setModal(true) : console.log(result.data);
            }else{
                console.log('editor error');
            } 
        }catch(e){
            console.log('code error');
        }
    }

    //memo
    const nameGear = useMemo(() => {
        return(
            <StyledInfo>
                <StyledInfoTitle>
                    사용자 이름
                    <StyledSubtitle chk={nameChk}>{msgData['needName']}</StyledSubtitle>
                </StyledInfoTitle>
                <StyledInput ref={name} defaultValue={self.name} />
            </StyledInfo>
        )
    }, [nameChk]);

    const defaultGear = useMemo(() => {
        return (
            <>
            <StyledInfo>
                <StyledInfoTitle>휴대폰 번호</StyledInfoTitle>
                <StyledImportant>
                    <StyledImportantText ref={phone}>{self.cellphone || '없음'}</StyledImportantText>
                    <StyledImportantLink onClick = {() => movePrivate('phone')}>변경</StyledImportantLink>
                </StyledImportant>
            </StyledInfo>
            <StyledInfo>
                <StyledInfoTitle>이메일 주소</StyledInfoTitle>
                <StyledImportant>
                    <StyledImportantText ref={email}>{self.email || '없음'}</StyledImportantText>
                    <StyledImportantLink onClick = {() => movePrivate('mail')}>변경</StyledImportantLink>
                </StyledImportant>
            </StyledInfo>
            <StyledInfo>
                <StyledInfoTitle>생년월일</StyledInfoTitle>
                <StyledCalendar ref={birth}><MobileDatePicker dt={self.birth ? new Date(self.birth) : null}/></StyledCalendar>
            </StyledInfo>
            <StyledInfo>
                <StyledInfoTitle>성별</StyledInfoTitle>
                <StyledToggleBox>
                    <StyledRadio ref={m} id="m" type="radio" name="gender" defaultChecked={self.gender=="m"}/>
                    <StyledToggle htmlFor="m" >남자</StyledToggle>
                    <StyledRadio ref={w} id="w" type="radio" name="gender" defaultChecked={self.gender=="w"}/>
                    <StyledToggle htmlFor="w">여자</StyledToggle>
                </StyledToggleBox>            
            </StyledInfo>
            </>
        )
    });

    const imageGear = useMemo(() => {
        return(
            <StyledInfo>
                <StyledImageTitle>
                    <StyledImageText>사진</StyledImageText>
                    <StyledImageUpload onClick={onImgInputBtnClick}>사진 업로드</StyledImageUpload>
                    <StyledImageContent>
                    <input style={{ display:"none" }} ref={imgInput} type='file' accept='image/*' onChange={ (e) => setImgName(e.target.files[0]) } />
                    {imgName ? 
                        <>
                        <AvatarEditor
                            ref={editor}
                            image={imgName}
                            width={120}
                            height={120}
                            border={0}
                            color={[255, 255, 255, 1.0]}
                            borderRadius={75}
                            scale={1}
                            rotate={0}
                        />
                        </> : null                
                    }                            
                    </StyledImageContent>
                </StyledImageTitle>
            </StyledInfo>
        )
    }, [imgName]);

    const modalGear = useMemo(() => {
        return (
            <Modal 
                option={{
                    width : "70%", 
                    height : "8em", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "1em", 
                    buttonName : ["확인"]
                }} 
                type={1}
                data={{desc : msgData['profileUpdate']}}
                state={modal} 
                closeEvent={() => navigate(-1)}
            />        
        )
    }, [modal])

    //render
    return(
        <>
        <StyledProfile>
            <Title text="프로필 수정"/>
            <StyledContent>
                {nameGear}
                {defaultGear}
                {imageGear}
                <StyledSubmit onClick={save}>프로필 수정하기</StyledSubmit>
                <StyledEmpty />
            </StyledContent>
        </StyledProfile>        
        {modalGear}
        </>
    )
}

export default ProfileUpdate;