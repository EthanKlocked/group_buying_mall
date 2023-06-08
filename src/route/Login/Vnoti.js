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
const Vnoti = () => {
    //context
    const { setOrderHandler } = useContext(OrderContext);
    const { setSelfHandler } = useContext(SelfContext);

    //init
    const navigate = useNavigate();
    const VNOTI_SECRET = 'df6j9afxxtbxl16ofcjtiubn1jqme9rf';
    const VNOTI_IV = 'oywx885ouh2d3v84';    
    const SearchParams = new URLSearchParams(useLocation().search);
    const vnotiCode = SearchParams.get('vcode');
    const editor = useRef(null);
    let vnotiToken;

    //state
    const [alert, setAlert] = useState(false);
    const [confirm, setConfirm] = useState(null);

    //function
    const login = async(token, type, nick=null) => {
        try{
            window.localStorage.setItem('token', JSON.stringify(token));
            window.localStorage.setItem('vtoken', vnotiToken);

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

    const vnotiConnect = async(vnotiId, userId) => {
        try{
            const params = {
                vnotiId : vnotiId,
                userId : userId,
            }
            const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
            const result = await apiCall.put("/login/any/vnotiConnect", {params}, {headers});    
            if(result.data.result == "success") login(result.data.token, result.data.type);
            else setAlert(true);
        }catch(e){
            setAlert(true);
            return false;
        }
    }
    
    const vnotiCheck = async(data) => {
        try{
            //init
            const decrypted = cripto("de", VNOTI_SECRET, VNOTI_IV, data);
            const jsonDecoded = JSON.parse(decrypted);
            const {id, name, cellphone} = jsonDecoded;
            vnotiToken = jsonDecoded.token;
            const editedImg = editor.current.getImageScaledToCanvas().toDataURL();

            //check
            if(!id || !cellphone || !name) return setAlert(true);

            //send
            const params = {
                id : id,
                name : name,
                cellphone : cellphone,
                img : editedImg
            }
            const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
            const result = await apiCall.post("/login/type/vnoti", {params}, {headers});
            if(result.data.result == "duplicate"){ //case connect
                const vnotiId = result.data.vnotiId;
                const userId = result.data.userId;
                setConfirm({
                    msg : "vnotiIdConnect",
                    title : "vnotiIntegration",
                    exec : () => vnotiConnect(vnotiId, userId)
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
        if(!vnotiCode) return navigate('/Login', {replace : true }); //case canceled

        setTimeout(() => { //wait default image uploaded to canvas...
            vnotiCheck(vnotiCode);
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
            <StyledLoadingMsg>브이노티 앱으로 로그인 중입니다...</StyledLoadingMsg>
            {alertGear}
            {confirmGear}
            {defaultImageGear}
        </>  
    )    
};

export default Vnoti;