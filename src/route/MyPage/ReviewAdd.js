//------------------------------ MODULE -------------------------------------
import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Title, Modal, StarScore, ImageUploadBox } from "component";
import { apiCall } from "lib";
import { msgData } from "static";

//------------------------------ CSS ----------------------------------------
const StyledReviewAdd = styled.div`
    height:100%;
    overflow:hidden;
`;
const StyledContent = styled.div`
    padding-top:3.5em;
    height:100%;
`;
const StyledSection = styled.div`
    padding:0.8em;
    text-align:start;
`;
const StyledImgCaution = styled.span`
    //display:inline-block;
    display:none;
    font-size:0.8em;
    text-align:start;
    vertical-align:top;
    margin:1.3em 0 0 0.8em;
`;
const StyledStarTitle = styled.div`
    text-align:start;
    font-size:0.9em;
    font-weight:550;
    margin-bottom:0.2em;
`;
const StyledTextBox = styled.textarea`
    display:inline-block;
    width:94%;
    height:9em;
    border:none;
    border-top: solid 1px #eee;
    border-bottom: solid 1px #eee;
    text-align:start;
    padding:3%;
    resize:none;
    outline:none;
`;
const StyledTextCnt = styled.div`
    margin-bottom:1em;
    text-align:right;
    margin-right:1em;
    font-size:0.8em;
`;
const StyledSubmit = styled.div`
    color:white;
    background:crimson;
    height:2em;
    width:93%;
    margin:auto;
    line-height:2em;
    border-radius:0.3em;
    cursor:pointer;
`;

//------------------------------ COMPONENT ----------------------------------
const ReviewAdd = () => {
    //init
    const { state } = useLocation();
    const navigate = useNavigate();

    //ref
    const textInput = useRef();

    //state
    const [imgFile, setImgFile] = useState(null);
    const [imgFile2, setImgFile2] = useState(null);
    const [imgFile3, setImgFile3] = useState(null);
    const [star1, setStar1] = useState(0);
    const [star2, setStar2] = useState(0);
    const [text, setText] = useState(null);
    const [alert, setAlert] = useState(null);
    const [complete, setComplete] = useState(null);
    const [defaultImageList, setDefaultImageList] = useState(null);

    const save = async() => { //mode : add
        try{
            if(!star1 || !star2) return setAlert('needStar');
            if(!textInput.current.value) return setAlert('needReview');

            const params = {
                goodsId : state.order.goodsInfo.goodsId,
                goodsName : state.order.goodsInfo.goodsName,
                goodsOptName : state.order.goodsInfo.optionName,
                seller : state.order.goodsInfo.seller,
                rating : star1,
                rating2 : star2,
                ratingAvg : (star1+star2)/2,                
                reviewImg : imgFile,               
                reviewImg2 : imgFile2,               
                reviewImg3 : imgFile3,               
                content : textInput.current.value,               
                seller : state.order.seller,               
                odId : state.order.odId,               
            }
            
            const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
            const result = await apiCall.post("/review", {params}, {headers});    
            if(result.data == 'success'){
                setComplete('reviewAdded');
            }else{
                setComplete('error');
            }
        }catch(e){
            setAlert('error');
            console.log('code error');
        }
    };
    
    const update = async() => {
        if(!star1 || !star2) return setAlert('needStar');
        if(!textInput.current.value) return setAlert('needReview');

        const params = {
            userChk : state.review.userId,
            rating : star1,
            rating2 : star2,
            ratingAvg : (star1+star2)/2,
            reviewImg : imgFile,
            reviewImg2 : imgFile2,
            reviewImg3 : imgFile3,    
            content : textInput.current.value
        }
        const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
        const result = await apiCall.put(`/review/${state.review.reviewId}`, {params}, {headers});    

        if(result.data == 'success'){
            setComplete('reviewAdded');
        }else{
            setComplete('error');
        }        
    }

    const handleSetTab = (e) => {
        if (e.keyCode === 9) {
            e.preventDefault();
            let val = e.target.value;
            let start = e.target.selectionStart;
            let end = e.target.selectionEnd;
            e.target.value = val.substring(0, start) + "\t" + val.substring(end);
            e.target.selectionStart = e.target.selectionEnd = start + 1;
            setText(e);
            return false; //  prevent focus
        }
    };

    //effect
    useEffect(() => { //update setting injection
        if(state.mode != 'update') return;
        textInput.current.value = state.review.content;
        setDefaultImageList(state.review.imgArr);
        setStar1(state.review.rating);
        setStar2(state.review.rating2);
    }, []);

    //memo
    const imageGear = useMemo(() => {
        return(
            <>
            <ImageUploadBox imgCallback={setImgFile} defaultImg={defaultImageList ? defaultImageList[0] : null}/>
            <ImageUploadBox imgCallback={setImgFile2} defaultImg={defaultImageList ? defaultImageList[1] : null}/>
            <ImageUploadBox imgCallback={setImgFile3} defaultImg={defaultImageList ? defaultImageList[2] : null}/>
            <StyledImgCaution>
                이런 내용이 포함되면 좋아요
                <br />
                - 식품 : 맛, 신선도, 배송상태 조리법 등
                <br />
                - 의류 : 평소 사이즈, 착용감, 소재/재질 등
                <br />
                - 화장품 : 평소 피부 타입, 사용감 등
            </StyledImgCaution>
            </>
        )
    }, [defaultImageList]);

    const starGear1 = useMemo(() => {
        return(
            <div style={{'marginBottom' : "1em"}}>
                <StyledStarTitle>배송, 포장 질문 응대 등 판매자에 대한 만족도는 어떠셨나요?</StyledStarTitle>
                <StarScore size="2em" nick="del" score={star1} scoreHandler={setStar1} activeChk = {true}/>
            </div>
        )
    }, [star1]);

    const starGear2 = useMemo(() => {
        return(
            <>
                <StyledStarTitle>이 상품의 품질에 대해 얼마나 만족하셨나요?</StyledStarTitle>
                <StarScore size="2em" nick="goods" score={star2} scoreHandler={setStar2} activeChk = {true}/>
            </>
        )
    }, [star2]);    

    const textGear = useMemo(() => {
        return(
            <>
            <StyledTextBox 
                ref={textInput} 
                placeholder="구매 후기 및 이용 경험을 자세히 작성 해 주세요." 
                onChange={(e) => setText(e.target.value)} 
                onKeyDown={(e) => handleSetTab(e)}
            />
            <StyledTextCnt>글자 수 : {text ? text.length : 0}자</StyledTextCnt>
            </>
        )
    }, [text]);

    const alertGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "70%", 
                    height : "8em", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "1em", 
                    buttonName : ["확인"]
                }} 
                type={1} 
                data={{desc : msgData[alert]}}
                state={alert} 
                closeEvent={() => {
                    setAlert(false);
                    return true;    
                }}
            />     
        )        
    }, [alert]);   

    const completeGear = useMemo(() => {
        return(
            <Modal 
                option={{
                    width : "70%", 
                    height : "7em", 
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "1em", 
                    buttonName : ["확인"]
                }} 
                type={1} 
                data={{desc : msgData[complete]}}
                state={complete} 
                noClose={true}
                closeEvent={() => {
                    navigate(-1);
                }}
            />     
        )        
    }, [complete]);       

    //render
    return (
        <StyledReviewAdd>
            <Title text={`구매 후기 ${state.mode == 'add' ? '작성하기' : '수정하기'}`} />
            <StyledContent>
                <StyledSection style={{height:"6.5em"}}>
                    {imageGear}
                </StyledSection>
                <StyledSection>
                    {starGear1}         
                    {starGear2}
                </StyledSection>
                <div>
                    {textGear}
                </div>
                <StyledSubmit onClick={state.mode == 'add' ? save : update}>구매 후기 작성 완료</StyledSubmit>
            </StyledContent>
            {alertGear}
            {completeGear}
        </StyledReviewAdd>
    )
}

export default ReviewAdd;