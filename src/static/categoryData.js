//------------------------------ MODULE -------------------------------------
import { ImSpoonKnife } from "react-icons/im";
import { AiOutlineHeart, AiOutlineHome } from "react-icons/ai";
import { MdOutlineSportsGolf, MdOutlineCoffeeMaker } from "react-icons/md";
import { GiClothes, GiLipstick } from "react-icons/gi";

//------------------------------- DATA --------------------------------------
const categoryData = {
    "011" : {
        "name" : "식품",
        "icon" : <ImSpoonKnife/>,
    },
    "012" : {
        "name" : "건강",
        "icon" : <AiOutlineHeart/>,
    },
    "013" : {
        "name" : "패션",
        "icon" : <GiClothes/>,
    },
    "014" : {
        "name" : "뷰티",
        "icon" : <GiLipstick/>,
    },
    "016" : {
        "name" : "홈데코",
        "icon" : <AiOutlineHome/>,
    },
    "018" : {
        "name" : "스포츠",
        "icon" : <MdOutlineSportsGolf/>,
    },
    "019" : {
        "name" : "가전",
        "icon" : <MdOutlineCoffeeMaker/>,
    },
}     

export default categoryData;