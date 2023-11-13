//------------------------------ MODULE -------------------------------------
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useMemo, useRef } from "react";
import { apiCall, cripto } from 'lib';
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
const RoadShow = () => {
    //context
    const { setOrderHandler } = useContext(OrderContext);
    const { setSelfHandler } = useContext(SelfContext);

    //init
    const navigate = useNavigate();
    const SearchParams = new URLSearchParams(useLocation().search);
    const code = SearchParams.get('code');
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

    const connect = async(snsId, userId) => {
        try{
            const params = {
                roadshowId : snsId,
                userId : userId,
            };
            const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
            const result = await apiCall.put("/login/any/roadshowConnect", {params}, {headers});    
            if(result.data.result == "success") login(result.data.token, result.data.type);
            else setAlert(true);
        }catch(e){
            setAlert(true);
            return false;
        }
    }
    
    const check = async(data) => {
        try{
            //init
            const decodedUrl = decodeURIComponent(data);
            const editedImg = editor.current.getImageScaledToCanvas().toDataURL();

            //send
            const params = {
                code : decodedUrl,
                img : editedImg
            };
            const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
            const result = await apiCall.post("/login/type/roadshow", {params}, {headers});
            if(result.data.result == "duplicate"){ //case connect
                const snsId = result.data.snsId;
                const userId = result.data.userId;
                setConfirm({
                    msg : "roadshowConnect",
                    title : "roadshowIntegration",
                    exec : () => connect(snsId, userId)
                });
                return;
            }
            if(result.data.result == "success"){ //case join & login
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
        if(!code) return navigate('/Login', {replace : true }); //case canceled

        setTimeout(() => { //wait default image uploaded to canvas...
            check(code);
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
            <StyledLoadingMsg>로드쇼 앱으로 로그인 중입니다...</StyledLoadingMsg>
            {alertGear}
            {confirmGear}
            {defaultImageGear}
        </>  
    )    
};

export default RoadShow;