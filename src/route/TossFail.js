//------------------------------ MODULE -------------------------------------
import { useEffect, useMemo} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Modal } from "component";
import { msgData } from "static";
import { apiCall } from "lib";

//------------------------------ CSS ----------------------------------------

//------------------------------ COMPONENT ----------------------------------
const TossFail = () => {
    //init
    const navigate = useNavigate(); 
    const [searchParams]=useSearchParams();
    const orderId = searchParams.get('orderId');

    //function
    const failExtra = async() => {
        try {
            const params = { 
                'orderNum' : orderId,
                'teamId' : 'reset',
            }
            const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
            const orderUpdateResult = await apiCall.put("/order", {params}, {headers}); //remove teamId
        }catch(e){
            console.log(e);
        }
    }

    //effect
    useEffect(() => {
        failExtra();
    }, []);

    //memo
    const alertGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "70%", 
                    height : "8em", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "1em", 
                    buttonName : ["홈으로"]
                }} 
                type={1} 
                data={{desc : msgData['orderFail'], title : "오류메시지"}}
                state={true} 
                closeEvent={() => {
                    return navigate('/', {replace : true })
                }}
            />     
        )        
    }, []);    

    //render
    return (
        <>
            {alertGear}
        </>
    )
}

export default TossFail;