
//------------------------------ MODULE -------------------------------------
import styled from "styled-components";

//------------------------------ CSS ----------------------------------------
const MainLoading = styled.div`
    position:fixed;
    background:white;
    height:100%;
    width:100%;
    z-index:4;

    background-repeat: no-repeat;

    background-image:
        linear-gradient( 90deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0) 90% ), /* animation */
        linear-gradient( #eee 100%, transparent 0 ), /* 사각1 */
        linear-gradient( #eee 100%, transparent 0 ), /* 사각2 */
        linear-gradient( #eee 100%, transparent 0 ), /* 사각3 */
        linear-gradient( #eee 100%, transparent 0 ), /* 사각4 */
        linear-gradient( #eee 100%, transparent 0 ); /* 사각4 */

    background-size:
        50% 100%,
        100% 17%,
        100% 14%,
        100% 20%,
        44% 30%,
        44% 30%;

    background-position:
        -50% 0,
        0 0,
        0 22.5%,
        0 44.5%,
        7% 84%,
        93% 84%;

    animation: shineM 1s infinite;

    @keyframes shineM {
        to {
            background-position: 
                150% 0,
                0 0,
                0 22.5%,
                0 44.5%,
                7% 84%,
                93% 84%;
        }
    }
`;

export default MainLoading;