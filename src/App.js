//------------------------------ MODULE -------------------------------------
import 'App.css';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { //routing pages
        Home, 
        TeamOrder, 
        WishList, 
        MyPage, 
        ProfileUpdate,
        PrivateInfoUpdate,
        AddressUpdate,        
        AddressAdd,        
        PaymentUpdate,
        PaymentAdd,
        Settings,
        Login, 
        Search, 
        Main, 
        List, 
        Phone, 
        Kakao,
        Apple,
        Vnoti,
        Auth, 
        Welcome,
        Description,
        Order,
        OrderInfo,
        OrderDesc,
        ReviewAdd,
        Review,
        TossSuccess,
        TossFail,
        CancelList,
        MyReview,
        SellerPage,
        SellerReview,
        GoodsQa,
        GoodsQaAdd,
        MyQa,
        CustomerService,
        MyWish,
        MyCatch,
        RawHtml,
        SellerInfo,
        CompanyInfo,
        PhoneUpdate,
        InterceptPage,
        TermsOfUse,
        PrivacyPolicy,
        MarketingConsent,
        PcWindow,
        FlappyBird
} from "route";
import { Navigation, Upstream, ErrorHandler } from "component";
import React, { useState, useEffect } from "react";
import { apiCall } from "lib";
import { BaseContextProvider, CacheContextProvider, OrderContextProvider, SelfContextProvider } from "context";
import { isMobile } from "react-device-detect";

//------------------------------ COMPONENT -----------------------------------
const App = () => {  
    //state
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState(null);
    const [base, setBase] = useState(null);
    const [error, setError] = useState(null);

    const callBase = async() => {
        try {
            setError(null);
            setCategory(null);
            setLoading(true);
            const result = await apiCall.get("/base/alldeal");
            setBase(result.data);

            //title, description, favicon setting [partner]
            document.title = result.data.title;
            document.querySelector('meta[name="description"]').setAttribute("content", result.data.description);
            const link = document.querySelector("link[rel~='icon']");
            link.rel = 'icon';
            link.href = `${process.env.REACT_APP_SERVER_URL}${result.data.favicon}`;
            document.getElementsByTagName('head')[0].appendChild(link);
        }catch(e){
            setError(e);
        }
        setLoading(false);
    }    

    //effect
    useEffect(() => {
        callBase();
    }, []);

    //if(loading) return <Loading />;
    //if(error) return null; 에러페이지 출력
    if(!base) return null;

    return (
        <>
        {(!isMobile && window.self == window.top)
            ? 
                ( //PC AND NOT IFRAME
                    <PcWindow />
                )
            : 
                ( //MOBILE OR IFRAME
                    <ErrorHandler>
                    <CacheContextProvider>
                    <BaseContextProvider init = {base}>
                    <OrderContextProvider>
                    <SelfContextProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="Home" element={<Home/>} >              
                                {Object.entries(base.useCtg).map((item, index)=>(                
                                    item[0] == 'all' ? 
                                    <Route key={index} path="Main" element={<Main categoryId='all'/>} /> : 
                                    <Route key={index} path={`List${index}`} element={<List categoryId={item[0]}/>} />
                                ))}
                                <Route path="Search" element={<Search categoryId='all'/>} />
                            </Route>
                            <Route path="Login" element={<Login />} />
                            <Route path="Login/Phone" element={<Phone />} />
                            <Route path="Login/Kakao" element={<Kakao />} />
                            <Route path="Login/Apple" element={<Apple />} />
                            <Route path="Login/Vnoti" element={<Vnoti />} />
                            <Route path="Login/Auth" element={<Auth />} />
                            <Route path="Login/Welcome" element={<Welcome />} />
                            <Route path="Login/PhoneUpdate" element={<PhoneUpdate />} />
                            <Route path="MyPage" element={<MyPage />} />
                            <Route path="MyPage/ProfileUpdate" element={<ProfileUpdate />} />
                            <Route path="MyPage/PrivateInfoUpdate" element={<PrivateInfoUpdate />} />
                            <Route path="MyPage/AddressUpdate" element={<AddressUpdate />} />
                            <Route path="MyPage/AddressAdd" element={<AddressAdd />} />
                            <Route path="MyPage/PaymentUpdate" element={<PaymentUpdate />} />
                            <Route path="MyPage/PaymentAdd" element={<PaymentAdd />} />
                            <Route path="MyPage/OrderInfo" element={<OrderInfo />} />
                            <Route path="MyPage/OrderDesc" element={<OrderDesc />} />
                            <Route path="MyPage/ReviewAdd" element={<ReviewAdd />} />
                            <Route path="MyPage/Settings" element={<Settings />} />
                            <Route path="MyPage/CancelList" element={<CancelList />} />
                            <Route path="MyPage/MyReview" element={<MyReview />} />
                            <Route path="MyPage/MyQa" element={<MyQa />} />
                            <Route path="MyPage/CustomerService" element={<CustomerService />} />
                            <Route path="MyPage/MyWish" element={<MyWish />} />
                            <Route path="MyPage/MyCatch" element={<MyCatch />} />
                            <Route path="TeamOrder" element={<TeamOrder />} />
                            <Route path="WishList" element={<WishList />} />
                            <Route path="Description" element={<Description />} />
                            <Route path="Review" element={<Review />} />
                            <Route path="Order" element={<Order />} />
                            <Route path="TossSuccess" element={<TossSuccess />} />
                            <Route path="TossFail" element={<TossFail />} />
                            <Route path="SellerPage" element={<SellerPage />} />
                            <Route path="SellerReview" element={<SellerReview />} />
                            <Route path="GoodsQa" element={<GoodsQa />} />
                            <Route path="GoodsQaAdd" element={<GoodsQaAdd />} />
                            <Route path="RawHtml" element={<RawHtml />} />
                            <Route path="SellerInfo" element={<SellerInfo />} />
                            <Route path="CompanyInfo" element={<CompanyInfo />} />
                            <Route path="InterceptPage" element={<InterceptPage />} />
                            <Route path="TermsOfUse" element={<TermsOfUse />} />
                            <Route path="PrivacyPolicy" element={<PrivacyPolicy />} />
                            <Route path="MarketingConsent" element={<MarketingConsent />} />
                            <Route path="Game/FlappyBird" element={<FlappyBird />} />
                            <Route path="/*" element={<Navigate to="/Home/Main" replace />} />
                        </Routes>
                        <Upstream/>
                        <Navigation/>
                    </BrowserRouter>
                    </SelfContextProvider>
                    </OrderContextProvider>
                    </BaseContextProvider>
                    </CacheContextProvider>
                    </ErrorHandler>
                )
        }
        </>
    )
};

export default App;
