//------------------------------ MODULE -------------------------------------
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useMemo, useRef } from "react";
import { apiCall } from 'lib';
import { OrderContext, SelfContext } from "context";
import { Modal } from "component";
import styled from "styled-components";
import { msgData } from "static";
import AvatarEditor from 'react-avatar-editor';
import defaultImg from 'data/img/defaultProfile5.jpg';

//------------------------------ CSS ----------------------------------------
const StyledLoadingMsg = styled.div`
    margin-top: 15em;
    text-align:center;
    color:#aaa;
    font-size:1.2em;
`;

//------------------------------ COMPONENT ----------------------------------
const Kakao = () => {
    //context
    const { setOrderHandler } = useContext(OrderContext);
    const { setSelfHandler } = useContext(SelfContext);

    //init
    const navigate = useNavigate();
    const KAKAO_API_KEY = process.env.REACT_APP_KAKAO_KEY;
    const KAKAO_REDIRECT = process.env.REACT_APP_KAKAO_REDIRECT;
    const SearchParams = new URLSearchParams(useLocation().search);
    const hostId = SearchParams.get('state');   
    const authCode = SearchParams.get('code');    
    const editor = useRef(null);

    //state
    const [alert, setAlert] = useState(false);
    const [confirm, setConfirm] = useState(null);

    //function
    const login = async(token, type, nick=null) => {
        try{
            window.localStorage.setItem('token', JSON.stringify(token));

            const orderSet = localStorage.getItem("orderSet");
            if(orderSet){
                localStorage.removeItem("orderSet");
                const orderInfo = JSON.parse(orderSet);
                setOrderHandler({ready : null, set : orderInfo}); //----ORDER CONTEXT SET----//
                const selfResult = await apiCall.get(`/self/self`);           
                setSelfHandler(selfResult.data); //----SELF CONTEXT SET----//
                navigate('/Order', {replace : true });
                return false;
            }
    
            let resultUrl = type == 'login' ? '/' : '/Login/Welcome';
            navigate(resultUrl, { replace : true, state: { name: nick } });
        }catch{
            setAlert(true);
        }
    }

    const kakaoConnect = async(kakaoId, userId) => {
        try{
            const params = {
                kakaoId : kakaoId,
                userId : userId,
            }
            const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
            const result = await apiCall.put("/login/any/kakaoConnect", {params}, {headers});    
            if(result.data.result == "success"){
                login(result.data.token, result.data.type);
            }else{
                setAlert(true);
            }   
        }catch{
            setAlert(true);
            return false;
        }
    }

    const getKakaoToken = async() => {
        try{
            const editedImg = editor.current.getImageScaledToCanvas().toDataURL();
            let params = {
                client_id: KAKAO_API_KEY,
                redirect_uri: KAKAO_REDIRECT,
                code: authCode,
                defaultImg: editedImg
            }
            const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
            const result = await apiCall.post("/login/type/kakao", {params}, {headers});
    
            //account integration
            if(result.data.res == "DUPLICATE"){ 
                const kakaoId = result.data.kakaoId;
                const userId = result.data.userId;
                setConfirm({
                    msg : "kakaoIdConnect",
                    title : "kakaoIntegration",
                    exec : () => kakaoConnect(kakaoId, userId)
                });
                return;
            }
            if(result.data.res == "SUCCESS"){
                //point process         
                apiCall.put("/member/any/point", { type : 'join', id: result.data.id, phone: result.data.phone }, {headers});
                if(hostId) apiCall.put("/member/any/point", { type : 'invite', id: hostId, phone: result.data.phone }, {headers});

                //login
                login(result.data.token, result.data.type, result.data.nick);
            }else{
                setAlert(true);
                return false; 
            }            
        }catch{
            setAlert(true);
            return false; 
        }
    }

    //effect
    useEffect(() => {
        if(!authCode) return navigate('/Login', {replace : true }); //case canceled

        setTimeout(() => { //wait default image uploaded to canvas...
            getKakaoToken();
        }, 200)
    }, []);
    
    //memo
    const alertGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "70%", 
                    height : "18%", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "0.8em", 
                    buttonName : ["확인"]
                }} 
                type={1} 
                data={{desc : msgData['loginProblem']}}
                state={alert} 
                closeEvent={() => {
                    setAlert(false);
                    navigate('/Login', {replace : true });
                }}
            />
        )
    }, [alert]);

    const confirmGear = useMemo(() => {
        return confirm ? (
            <Modal 
                option={{
                    width : "75%", 
                    height : "10em",
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "0.8em", 
                    noClose : true,
                    buttonName : ["확인","취소"]
                }} 
                type={2}
                proEvent = {() => {
                    confirm.exec();
                    return true;
                }}
                consEvent = {() => {
                    setAlert(true);
                    return true;
                }}
                data={{desc : msgData[confirm.msg], title : msgData[confirm.title]}}
                state={confirm} 
                closeEvent={() => setConfirm(null)}
            />
        ) : null;
    }, [confirm]);    

    const defaultImageGear = useMemo(() => {
        return (
            <AvatarEditor
                style={{display:"none"}}
                ref={editor}
                image={defaultImg}
                width={150}
                height={150}
                border={0}
                color={[255, 255, 255, 1.0]}
                borderRadius={75}
                scale={1}
                rotate={0}
            />
        )
    }, [])

    //render
    return(
        <>
            {authCode ? <StyledLoadingMsg>카카오톡으로 로그인 중입니다...</StyledLoadingMsg> : null}
            {alertGear}
            {confirmGear}
            {defaultImageGear}
        </>  
    )
};

export default Kakao;