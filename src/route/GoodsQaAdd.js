//------------------------------ MODULE -------------------------------------
import { useState, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Title, Modal } from "component";
import { apiCall } from "lib";
import { msgData } from "static";

//------------------------------ CSS ----------------------------------------
const StyledGoodsQaAdd = styled.div`
    height:100%;
    width:100%;
    overflow:hidden;
`;
const StyledContent = styled.div`
    margin-top:3.5em;
    height:100%;
    background:#f5f5f5;
`;
const StyledTextBox = styled.textarea`
    display:inline-block;
    width:94%;
    height:18em;
    border:none;
    border-bottom: solid 1px #eee;
    text-align:start;
    padding:1em;
    resize:none;
    outline:none;
    font-size:1em;
`;
const StyledAddButton = styled.div`
    width:93%;
    height:2.5em;
    line-height:2.5em;
    background:crimson;
    font-size:0.9em;
    color:white;
    margin:0.5em auto;
    border-radius:0.3em;
    cursor:pointer;
`;
const StyledTextInfo = styled.div`
    color:#aaa;
    width:93%;
    margin:0.8em auto;
    font-size:0.8em;  
    text-align:start;
`;

//------------------------------ COMPONENT ----------------------------------
const GoodsQaAdd = () => {
    //init
    const { state } = useLocation();
    const navigate = useNavigate();

    //ref
    const textInput = useRef();

    //state
    const [alert, setAlert] = useState(null);

    const save = async() => { 
        try{
            if(!textInput.current.value) return setAlert('needQa');
            const params = {
                goodsId : state.goodsId,
                content : textInput.current.value
            }
            const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
            const result = await apiCall.post("/qa", {params}, {headers});    
            console.log(result);
            if(result.data == 'success'){
                setAlert('qaAdded');
            }else{
                setAlert('error');
            }
        }catch(e){
            setAlert('error');
            console.log('code error');
        }
    };

    //memo
    const textGear = useMemo(() => {
        return (
            <StyledGoodsQaAdd>
                <Title text='상품문의'/>
                <StyledContent>                
                    <StyledTextBox 
                        ref={textInput} 
                        placeholder="문의 내용을 입력 해 주세요." 
                    />
                    <StyledAddButton onClick={save}>등록하기</StyledAddButton>
                    <StyledTextInfo>
                        - 상품 문의의 경우 앱 내 상품문의에서 모든 고객님이 확인 가능합니다. 주민번호, 전화번호, 이메일 등 개인정보를 남기면 타인에 의해 도용될 수 있으니 개인정보는 상품문의에 남기지 말아주세요.
                    </StyledTextInfo>
                </StyledContent>
            </StyledGoodsQaAdd>
        )
    }, []);

    const alertGear = useMemo(() => {
        return(
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
                data={{desc : msgData[alert]}}
                state={alert} 
                closeEvent={() => {
                    if(alert == 'qaAdded') navigate(-1);
                    setAlert(false);
                    return true;    
                }}
            />     
        )        
    }, [alert]);       

    //render
    return (
        <>
        {textGear}
        {alertGear}
        </>
    );
}

export default GoodsQaAdd;