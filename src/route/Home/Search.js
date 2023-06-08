//------------------------------ MODULE -------------------------------------
import React, { useContext, useMemo } from "react";
import { SrchContext, CacheContext, BaseContext } from "context";
import { ItemList } from "component";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { categoryData } from "static";
import { BiCategoryAlt } from "react-icons/bi";

//------------------------------ CSS ----------------------------------------
const StyledSearch = styled.div`
    margin: 2em 0;
`;
const StyledKeywordContainer = styled.div`
    display:grid;
    width:90%;
    grid-template-columns: repeat(5, 20%);
    align-content:start;
    justify-content:center;
    justify-self:center;
    margin:auto;
`;
const StyledKeywordTitle = styled.div`
    display:grid;
    font-size:0.8em;
    font-weight:bold;
    padding:3% 3% 3% 3%;
    justify-content:left;
    grid-column: 1 / 6;
`;
const StyledKeyword = styled.div`
    display:grid;
    align-content:center;
    margin:3% 8%;
    padding:7% 5%;
    font-weight:500;
    color:#E73737;
    border: solid 0.1em #E73737;
    font-size:0.7em;
    border-radius:0.7em;
`;
const StyledCategoryContainer = styled.div`
    margin: 0 2em;
`;
const StyledCategoryTitle = styled.div`
    font-size:1.2em;
    font-weight:bold;
    color:#555;
    text-align:start;
    padding-bottom: 1em;
`;
const StyledCategoryList = styled.div`
    display:grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap:13%;
`;
const StyledCategoryItem  = styled.div`
    cursor:pointer;
    font-weight:550;
    padding: 0.8em 0;
    span{
        display:block;
        color:#999;
        font-size:0.9em;
    }
    svg{
        padding-bottom: 0.3em;
        font-size:1.7em;
        color:#172b4d;
    }
`;

//------------------------------ COMPONENT ----------------------------------
const Search = React.memo(({categoryId}) => {
    //init
    const keyword = [
        "골프",
        "고양이",
        "테스트",
        "강아지",
        "스티치",
        "엔젤",
        "페어딜",
        "올딜",
        "해비타",
        "꼬부기",
    ];
    const { pathname }  = useLocation();
    const navigate = useNavigate();    

    //context
    const { srch, setSrchHandler } = useContext(SrchContext);
    const { cache, setCacheHandler } = useContext(CacheContext);
    const { base } = useContext(BaseContext);
    const menuCategory = Object.entries(base.useCtg);

    //state
    //const [srchCnt, setSrchCnt] = useState(true);

    //function
    const clickSearch = (keyword) => {
        const cacheData = cache;
        if(cacheData.hasOwnProperty('/Home/Search')) delete cacheData['/Home/Search'];
        setCacheHandler(cacheData);

        document.getElementById('srchTextInput').value = keyword;
        setSrchHandler({srch : 'name', kwd : keyword});
    }

    const categoryMove = (target) => { //category navigate exec
        window.location.replace(target);
        //navigate(target);
    }

    //memo
    const recommendGear = useMemo(() => {
        return (
            <StyledKeywordContainer>
                <StyledKeywordTitle>{base.shopName}의 추천 검색어</StyledKeywordTitle>
                {keyword.map((item, index)=>(
                    <StyledKeyword onClick={() => clickSearch(item)} key={index}>{item}</StyledKeyword>
                ))}
            </StyledKeywordContainer>
        )        
    }, []);

    const categoryListGear = useMemo(() => {
        return (
            <StyledCategoryContainer>
                <StyledCategoryTitle>카테고리 바로가기</StyledCategoryTitle>
                <StyledCategoryList>
                    {menuCategory.map((item, index) => (                    
                        <StyledCategoryItem key={index} onClick={() => {categoryMove(`${process.env.REACT_APP_HOST}/Home/List${index}`)}}>
                            {
                                item[0]=='all' ? (
                                    <>
                                    <BiCategoryAlt/>
                                    <span>전체</span>
                                    </>
                                ) 
                                : (
                                    categoryData.hasOwnProperty(item[1].info.ctgId) ? (
                                        <>
                                        {categoryData[item[1].info.ctgId].icon}
                                        <span>{categoryData[item[1].info.ctgId].name}</span>
                                        </>
                                    )
                                    : item[1].info.title
                                )
                            }
                        </StyledCategoryItem>                                 
                    ))}
                </StyledCategoryList>
            </StyledCategoryContainer>
        )
    })

    //render
    return srch || cache.hasOwnProperty(pathname)? 
    <ItemList search={srch}/>
    :
    (
        <StyledSearch>            
            {/*recommendGear*/}
            {categoryListGear}
        </StyledSearch>
    )
});

export default Search;