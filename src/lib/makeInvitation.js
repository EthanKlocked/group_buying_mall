import { apiCall } from "lib";

const makeInvitation = async(id=null) => {
    let hostId = id;
    if(!hostId){
        const selfChk = await apiCall.get(`/self/self`);
        hostId = selfChk?.data?.id;
    }
    if(!hostId) return null; //need extra code to error control [case : id is null]

    return {
        //container : '#kakao-link-btn',
        objectType: 'feed',
        content: {
            title: '친구가 포인트를 받고 싶어 해요!',
            imageUrl: 'https://mud-kage.kakao.com/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png',
            link: {
                mobileWebUrl: `${process.env.REACT_APP_HOST}/Login?hostId=${hostId}`,
                webUrl: `${process.env.REACT_APP_HOST}/Login?hostId=${hostId}`,
            },
        },
        itemContent: {
            profileText: 'Kakao',
            profileImageUrl: 'https://mud-kage.kakao.com/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png',
            titleImageUrl: 'https://mud-kage.kakao.com/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png',
            titleImageText: 'Cheese cake',
            titleImageCategory: 'Cake',
            items: [
                {
                    item: 'Cake1',
                    itemOp: '홀리',
                },
                {
                    item: 'Cake2',
                    itemOp: '몰리',
                },
                {
                    item: 'Cake3',
                    itemOp: '과카',
                },
                {
                    item: 'Cake4',
                    itemOp: '몰리',
                },
                {
                    item: 'Cake5',
                    itemOp: '5000원',
                },
            ],
            sum: 'Total',
            sumOp: 'TEST',
        },
        social: {
            likeCount: 999,
            commentCount: 0,
            sharedCount: 25,
        },
        buttons: [
            {
                title: '수락하기',
                link: {
                    mobileWebUrl: `${process.env.REACT_APP_HOST}/Login?hostId=${hostId}`,
                    webUrl: `${process.env.REACT_APP_HOST}/Login?hostId=${hostId}`,
                },
            }
        ],
    };
}

export default makeInvitation;