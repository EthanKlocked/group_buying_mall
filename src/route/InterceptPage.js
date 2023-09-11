//------------------------------ MODULE -------------------------------------
import React, { useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";

//------------------------------ COMPONENT ----------------------------------
const InterceptPage = React.memo(() => {
    //init
    const { state } = useLocation();
    const navigate = useNavigate();
    const [searchParams]=useSearchParams();
    const goal = searchParams.get('goal');

    //effect
    useEffect(() => {
        console.log(goal);
        if(!goal) goal = '/';
        navigate(goal, { state: state, replace:true });
    }, []);

    //render
    return null;
});

export default InterceptPage;