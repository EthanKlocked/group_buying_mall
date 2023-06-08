//------------------------------ MODULE -------------------------------------
import styled from "styled-components";

//------------------------------ CSS ----------------------------------------
const itemListLoading = styled.div`
    position:absolute;
    top: 3em;
    background:white;
    height:45em;
    width:100%;
    z-index:4;

    background-repeat: no-repeat;

    background-image:
        linear-gradient( 90deg, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0) 90% ), /* animation */
        linear-gradient( #eee 100%, transparent 0 ), /* 아이템1 */
        linear-gradient( #eee 100%, transparent 0 ), /* 아이템2 */

        linear-gradient( #eee 100%, transparent 0 ), /* 설명 */
        linear-gradient( #eee 100%, transparent 0 ), /* 설명 */

        linear-gradient( #eee 100%, transparent 0 ), /* 퍼센트 */
        linear-gradient( #eee 100%, transparent 0 ), /* 퍼센트 */

        linear-gradient( #eee 100%, transparent 0 ), /* 가격 */
        linear-gradient( #eee 100%, transparent 0 ), /* 가격 */

        linear-gradient( #eee 100%, transparent 0 ), /* 아이템3 */
        linear-gradient( #eee 100%, transparent 0 ), /* 아이템4 */

        linear-gradient( #eee 100%, transparent 0 ), /* 설명 */
        linear-gradient( #eee 100%, transparent 0 ), /* 설명 */

        linear-gradient( #eee 100%, transparent 0 ), /* 퍼센트 */
        linear-gradient( #eee 100%, transparent 0 ), /* 퍼센트 */

        linear-gradient( #eee 100%, transparent 0 ), /* 가격 */
        linear-gradient( #eee 100%, transparent 0 ), /* 가격 */

        linear-gradient( #eee 100%, transparent 0 ), /* 사각4 */
        linear-gradient( #eee 100%, transparent 0 ); /* 사각4 */

    background-size:
        50% 100%,

        44% 25%, /*----아이템----*/
        44% 25%, 

        44% 2%, /*설명*/
        44% 2%,

        25% 2%, /*퍼센트*/
        25% 2%,

        20% 2%, /*가격*/
        20% 2%,

        44% 25%, /*----아이템----*/
        44% 25%, 

        44% 2%, /*설명*/
        44% 2%,

        25% 2%, /*퍼센트*/
        25% 2%,

        20% 2%, /*가격*/
        20% 2%,
        
        44% 25%, /*----아이템----*/
        44% 25%;        

    background-position:
        -50% 0,

        5% 2%, /*----아이템----*/
        93% 2%,

        5% 28%,
        93% 28%,        

        4% 31%,
        69.5% 31%,        

        4% 34%,
        65% 34%,        

        5% 51%, /*----아이템----*/
        93% 51%,

        5% 66%,
        93% 66%,              

        4% 69%,
        69.5% 69%,        

        4% 72%,
        65% 72%,    

        5% 100%, /*----아이템----*/
        93% 100%;

    animation: shine 1s infinite;

    @keyframes shine {
        to {
            background-position: 
                150% 0,

                5% 2%, /*----아이템----*/
                93% 2%,
        
                5% 28%,
                93% 28%,        
        
                4% 31%,
                69.5% 31%,        
        
                4% 34%,
                65% 34%,        
        
                5% 51%, /*----아이템----*/
                93% 51%,
        
                5% 66%,
                93% 66%,              
        
                4% 69%,
                69.5% 69%,        
        
                4% 72%,
                65% 72%,    
        
                5% 100%, /*----아이템----*/
                93% 100%;
        }
    }
`;

export default itemListLoading;

