const kakaoShare = (obj) => {
    //init
    const Kakao = window.Kakao;
    if(!Kakao.isInitialized()) Kakao.init(process.env.REACT_APP_KAKAO_J_KEY);

    //set & send
    Kakao.Share.sendDefault(obj);
}

export default kakaoShare;