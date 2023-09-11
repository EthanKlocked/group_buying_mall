//------------------------------ MODULE -------------------------------------
import { useState, useEffect, useMemo} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Modal, CustomLoading } from "component";
import { apiCall } from "lib";
import { msgData } from "static";

//------------------------------ CSS ----------------------------------------

//------------------------------ COMPONENT ----------------------------------
const TossSuccess = () => {
    //init
    const navigate = useNavigate(); 
    const [searchParams]=useSearchParams();
    const teamId = searchParams.get('teamId');
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const joinChk = searchParams.get('joinChk');
    const optionId = searchParams.get('optionId');

    //state
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [orderConfirm, setOrderConfirm] = useState(false);
    const [orderAlert, setOrderAlert] = useState(false);

    //function
    const certificate = async() => {
        setLoading(true);
        const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
        let params = new Object();

        //duplicate Chk
        params = { 'odNo' : orderId };
        const orderDupChk = await apiCall.get(`/order`, {params});
        if(orderDupChk.data.result == 'success' && orderDupChk.data.data.length>0) return setOrderAlert('orderAlready');

        //soldOut Chk
        let optionQtyChk = await apiCall.get(`/goods/${optionId}/optionStockChk`);
        if(!optionQtyChk.data){
            //order status 1
            params = { 
                'orderNum' : orderId,
                'teamId' : 'reset',
            };
            const soldOutOrderUpdateResult = await apiCall.put("/order", {params}, {headers}); //orderCancel
            if(!alert(msgData['soldOut'])) return navigate('/', {replace : true });
        }

        //Join able Chk
        if(joinChk == 'y'){
            let ExpireChk = await apiCall.get(`/team/${teamId}/ableChk`);
            if(ExpireChk.data != 'able'){
                //order status 1
                params = { 
                    'orderNum' : orderId,
                    'teamId' : 'reset',
                };
                const fullOrderUpdateResult = await apiCall.put("/order", {params}, {headers}); //orderCancel

                if(!alert(msgData['teamFull'])) return navigate('/', {replace : true });
            }
        }
        
        //exec
        let payChk = 'fail';
        try {
            params = {
                paymentKey : paymentKey,
                orderId : orderId,
                amount : amount,
            }
            const token = localStorage.getItem("token");
            const payResult = await apiCall.get("/billing/card/certificate", {params});    
            if(payResult.data == 'success'){
                    /*********** TEAM CHECK ***********/
                    params = { teamId : teamId };
                    const teamUpdateResult = await apiCall.put("/team", {params}, {headers}); //case 1 : ready -> set, case2 : set -> go(order state to 3)
                    if(teamUpdateResult.data != 'success') { //team update failed => order status 1, payback
                        //order status reset process
                        params = { 
                            'orderNum' : orderId,
                            'orderStatus' : '1', // 2 -> 1
                            'teamId' : 'reset',
                        }
                        const orderUpdateResult = await apiCall.put("/order", {params}, {headers}); //orderCancel

                        //payback
                        params.reason = '팀 생성 오류';
                        const cancelResult = await apiCall.get("/billing/payback/cancel", {params}); //billingCancel          
                    }else{
                        payChk = 'success'; //case perfect
                    }
            }else{
                //order status 0
                params = { 
                    'orderNum' : orderId,
                    'orderStatus' : '1', 
                    'teamId' : 'reset',
                }
                const orderUpdateResult = await apiCall.put("/order", {params}, {headers}); //orderCancel
            } 
        }catch(e){
            console.log(e);
        }
        setResult(payChk);
        if(payChk == "success"){
            setOrderConfirm(true);
        }else{
            setOrderAlert('orderFail');
        } 
        setLoading(false);
    }

    //effect
    useEffect(() => {
        certificate();
    }, []);
    
    //memo
    const confirmGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "70%", 
                    height : "8em", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "1em", 
                    buttonName : ["마이페이지","쇼핑 계속하기"]
                }} 
                type={2}
                noClose={true}
                proEvent = {() => {
                    navigate('/MyPage', {replace : true });
                    return true;
                }}
                consEvent = {() => {
                    navigate('/', {replace : true });
                    return true;
                }}
                data={{desc : msgData['orderConfirm']}}
                state={orderConfirm} 
                closeEvent={() => setOrderConfirm(false)}
            />
        )        
    }, [orderConfirm]);

    const alertGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "70%", 
                    height : "8em", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "0.8em", 
                    buttonName : ["홈으로"]
                }} 
                type={1} 
                data={{desc : msgData[orderAlert], title : "오류메시지"}}
                state={orderAlert} 
                closeEvent={() => {
                    return navigate('/', {replace : true })
                }}
            />     
        )        
    }, [orderAlert]);

    //render
    return (
        <>
        {loading?<CustomLoading opacity={0.5}/> : null}
        {confirmGear}
        {alertGear}
        </>
    )
}

export default TossSuccess;