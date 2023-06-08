//------------------------------ MODULE -------------------------------------
import { useState, useRef, useContext, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Title, Modal, MobileDatePicker } from "component";
import { apiCall } from "lib";
import AvatarEditor from 'react-avatar-editor';
import { OrderContext, SelfContext } from "context";
import { msgData } from "static";
import defaultImg from 'data/img/defaultProfile5.jpg';

//------------------------------ CSS ----------------------------------------
const StyledAuth = styled.div`
    height:100%;
`;
const StyledContent = styled.div`
    padding:4.5em 6%;
    height:80%;
    display:grid;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1.2fr 1fr 2fr 0.7fr 7fr 2fr;
`;
const StyledTitle = styled.div`
    display:grid;
    grid-column: 1 / span 3;
    justify-content:left;
    align-content:center;
    font-size:0.8em;
    font-weight:bold;
    margin:1% 0;
`;
const StyledInputBox = styled.div`
    display:grid;
    grid-column: 1 / span 3;
    border-radius:0.5em;
    padding: 2%;    
    align-content:center;
    background:#eee;
`;
const StyledInput = styled.input`
    padding-left:1%;  
    background:#eee;
    font-size:1em;
    ::placeholder{
        font-size:1em;
        color:#aaa;
    };
    height:1.45em;
`;
const StyledDateBox = styled.div`
    display:grid;
    grid-column: 1 / span 3;
    justify-self:left;
    cursor:pointer;
`;
const StyledToggle1 = styled.div`
    display:grid;
    align-items:center;
    ${(props) => props.gender == "m" ? 
        'background:crimson; color:white; border: solid 0.1em crimson;' :
        'background:white; color:#888; border: solid 0.1em #aaa;'
    }
    width:70%;
    font-size:0.8em;
    height:2em;
    border-radius:0.5em;
    height:2.25em;
    cursor:pointer;
`;
const StyledToggle2 = styled.div`
    display:grid;
    align-items:center;
    ${(props) => props.gender == "w" ? 
        'background:crimson; color:white; border: solid 0.1em crimson;' :
        'background:white; color:#888; border: solid 0.1em #aaa;'
    }    
    width:70%;
    height:2.25em;
    font-size:0.8em;
    border-radius:0.5em;
`;
const StyledUploadTitle = styled.div`
    display:grid;
    grid-column: 1 / span 2;
    justify-content:start;
    font-size:0.8em;
    font-weight:bold;
    margin-bottom:3%;
    align-self:center;
`;
const StyledButton = styled.div`
    display:grid;
    justify-self:right;
    align-content:center;
    color:white;
    background:crimson;
    width:70%;
    font-size:0.8em;
    border-radius:0.5em;
    align-self:center;
    height:2.5em;
    cursor:pointer;
`;
const StyledImgBox = styled.div`
    display:grid;
    grid-column: 1 / span 3;
    justify-items:center;
    align-content:center;
    padding:2%;
    height:90%;
    grid-row-gap:5%;
    canvas{
        border-radius:50%;
    }
`;
const StyledSubmit = styled.div`
    display:grid;
    grid-column: 1 / span 3;
    background:crimson;
    align-content:center;
    color:white;
    font-size:0.8em;
    border-radius:0.5em;
    height:2.5em;
    cursor:pointer;
`;
const StyledSubTitle = styled.div`
    display:grid;
    padding-top:1%;
    height:5%;
    justify-self:left;
    font-size:0.5em;
    color:crimson;
    grid-column: 1 / span 3;
`;

//------------------------------ COMPONENT ----------------------------------
const Auth = () => {
    //context
    const { order } = useContext(OrderContext);
    const { setSelfHandler } = useContext(SelfContext);

    //init
    const { state } = useLocation();
    const navigate = useNavigate();
    const nameInput = useRef();
    const imgInput = useRef();
    const editor = useRef(null);
    const marketingOpt = state && state.chkList ? 'y' : 'n';    

    //state
    const [name, setName] = useState(null);
    const [nameMsg, setNameMsg] = useState('empty');
    const [birth, setBirth] = useState(null);
    const [birthMsg, setBirthMsg] = useState('empty');
    const [gender, setGender] = useState(null);
    const [genderMsg, setGenderMsg] = useState('empty');
    const [imgName, setImgName] = useState(defaultImg);
    const [imgMsg, setImgMsg] = useState('empty');
    const [alert, setAlert] = useState(false);
    
    //func
    const passLevel = async() => {
        if(!name) return setNameMsg('needName');
        if(!imgName) return setImgMsg('needImg');
        //if(!birth) return setBirthMsg('needbirth');
        //if(!gender) return setGenderMsg('needGender');
        
        if(editor){
            if(!state) return setAlert(true);
            if(!state.certPhone) return setAlert(true);
            
            const editedImg = editor.current.getImageScaledToCanvas().toDataURL();
            const params = {
                cellphone : state.certPhone,
                emailser : marketingOpt,
                smsser : marketingOpt,
                img : editedImg,
                name : name,
                birth : birth || '2023-1-1',
                gender : gender || 'm',
                snsid2 : state.appleId || null,
                email : state.appleEmail || null,
            }
            const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
            const result = await apiCall.post("/join", {params}, {headers}); //----JOIN----//
            
            if(result.data.res == 'SUCCESS' && result.data.id){ 
                const loginResult = await apiCall.get(`/login/${result.data.id}/phone`); //----LOGIN----//
                if(loginResult.data.res == "SUCCESS"){
                    window.localStorage.setItem('token', JSON.stringify(loginResult.data.token));

                    if(order && order.set){ //----REDIRECT CHECK----//
                        const selfResult = await apiCall.get(`/self/self`);           
                        setSelfHandler(selfResult.data); //----SELF CONTEXT SET----//
                        navigate('/Order', {replace : true });
                        return false;                        
                    }

                    navigate('/Login/Welcome', { replace : true, state: { name: name } });
                }else{
                    setAlert(true);
                }
            }else{
                setAlert(true);
            };
        }else{
            setAlert(true);
        }
    }

    const onImgInputBtnClick = (e) => {
        e.preventDefault();
        imgInput.current.click();
    }

    const birthCallback = (b) => {
        setBirth(b);
        setBirthMsg('empty');
    }

    //effect
    useEffect(()=>{
        if(state.appleName){
            setName(state.appleName);
            nameInput.current.value=state.appleName;
        }
    }, []);

    //memo
    const nameGear = useMemo(() => {
        return(
            <>
                <StyledTitle>사용자 이름 *</StyledTitle>            
                <StyledInputBox><StyledInput ref={nameInput} onChange={(e) => setName(e.target.value)}/></StyledInputBox>
                <StyledSubTitle>{!name ? msgData[nameMsg] : null}</StyledSubTitle>
            </>
        )
    }, [name, nameMsg]);

    const birthGear = useMemo(() => {
        return(
            <>
                <StyledTitle>생년월일</StyledTitle>            
                <StyledDateBox>
                    {/* <NumberInput number={8} expression="생년월일 8자리를 입력 해 주세요." changeHandler={setBirth}/>*/}
                    <MobileDatePicker callback={birthCallback}/>
                </StyledDateBox>            
                <StyledSubTitle>{(!birth) ? msgData[birthMsg] : null}</StyledSubTitle>
            </>
        )

    }, [birth, birthMsg]);

    const genderGear = useMemo(() =>{
        return(
            <>
                <StyledTitle>성별</StyledTitle>
                <StyledToggle1 gender={gender} onClick={()=>setGender("m")}>남자</StyledToggle1>
                <StyledToggle2 gender={gender} onClick={()=>setGender("w")}>여자</StyledToggle2>
                <StyledSubTitle>{!gender ? msgData[genderMsg] : null}</StyledSubTitle>            
            </>
        )
    }, [gender, genderMsg]);

    const imgGear = useMemo(() => {
        return(
            <>
                <StyledUploadTitle>사진 *</StyledUploadTitle>
                <input style={{ display:"none" }} ref={imgInput} type='file' accept='image/*' onChange={ (e) => setImgName(e.target.files[0]) } />
                <StyledButton onClick={onImgInputBtnClick}>사진 업로드</StyledButton>
                <StyledSubTitle>{!imgName ? msgData[imgMsg] : null}</StyledSubTitle>
                <StyledImgBox>
                
                    {imgName ? 
                        <>
                        {/*<StyledHorizontal>이미지를 중심에 맞춰 조정 해 주세요.</StyledHorizontal> */}
                        <AvatarEditor
                            ref={editor}
                            image={imgName}
                            width={150}
                            height={150}
                            border={10}
                            color={[255, 255, 255, 1.0]}
                            borderRadius={75}
                            scale={1}
                            rotate={0}
                        />
                        </> : null                
                    }

                </StyledImgBox>
            </>
        )
    }, [imgName, imgMsg]);

    //render
    return (
        <>
        <StyledAuth>
        <Title text="회원정보 입력"/>
        <StyledContent>
            {nameGear}
            {birthGear}
            {genderGear}
            {imgGear}
            <StyledSubmit onClick={passLevel}>회원가입 완료하기</StyledSubmit>
        </StyledContent>                 
        </StyledAuth>
        <Modal 
            option={{
                width : "73%", 
                height : "20%", 
                textAlign : "center",
                alignContent : "center",  
                fontSize : "0.8em", 
                buttonName : ["확인"]
            }} 
            type={1} 
            data={{desc : msgData['joinProblem']}}
            state={alert} 
            closeEvent={() => {
                setAlert(false);
                navigate('/Phone', { replace : true }); 
            }}
        />               
        </>
    );
}

export default Auth;