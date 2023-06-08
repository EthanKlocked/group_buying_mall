//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { Link } from "react-router-dom";

//------------------------------ CSS ----------------------------------------
const StyledErrorBox = styled.div`
    display:grid;
    height: 100%;
    width: 100%;
    background: white;
    text-align:center;
    padding-top:10%;
`;

const Styled404 = styled.div`
    display:grid;
    font-size : 700%;
    padding:1%;
`;

const StyledLink = styled.div`
    display:grid;
    font-size: 20px;
    width: 150px;
    height: 30px;
    text-align:center;
    margin:auto;
    background:#0b57d0;
    color: white;
    border-radius:20px;
`;

//------------------------------ COMPONENT ----------------------------------
const PageNotFound = () => {
    //render
    return (
        <>
            <StyledErrorBox>
                <Styled404>
                    404
                </Styled404>
                <h1>Page Not Found :)</h1>
                <p>The requested URL was not found on this server.</p>
            </StyledErrorBox>
            <StyledLink>
                <Link to="/" style={{'color':'white'}}> Back To Home </Link>
            </StyledLink>            
        </>
    );     
}

export default PageNotFound;