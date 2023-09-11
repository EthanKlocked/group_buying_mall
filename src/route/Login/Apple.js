//------------------------------ MODULE -------------------------------------
import { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

//------------------------------ CSS ----------------------------------------
const StyledLoadingMsg = styled.div`
    margin-top: 15em;
    text-align:center;
    color:#aaa;
    font-size:1.2em;
`;

//------------------------------ COMPONENT ----------------------------------
const Apple = () => {
    //init
    const navigate = useNavigate();

    //effect
    useEffect(() => {
        setTimeout(() => {
            navigate('/', { replace : true });
        }, 1000)
    }, []);

    //render
    return <StyledLoadingMsg>애플아이디로 로그인 중입니다...</StyledLoadingMsg>
};

export default Apple;