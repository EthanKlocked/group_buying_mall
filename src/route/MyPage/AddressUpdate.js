//------------------------------ MODULE -------------------------------------
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Title,  } from "component";
import { useCallback, useState, useMemo, useEffect, useContext } from "react";
import { apiCall } from "lib";
import { RiDeleteBin6Line } from "react-icons/ri";
import { SelfContext } from "context";

//------------------------------ CSS ----------------------------------------
const StyledAddressUpdate = styled.div`
    height:100%;
`;
const StyledContent = styled.div`
    height:100%;
    background:#eee;
    padding-top:3.8em;
`;
const StyledList = styled.div`
`;
const StyledItem = styled.div`
    margin-bottom: 0.5em;
    background:white;
    padding:0.5em 1em;
    text-align:start;
    position:relative;
`;
const StyledItemBody = styled.label`
    display: inline-block;
    width:90%;
`;
const StyledItemTop = styled.div`
    text-align:start;
    span{
        margin:0 0.5em;
        line-height:2em;
    }
    input[type="radio"]:checked {
        background-color: crimson;
        border-color: crimson;
        color: white;
    }
    input[type="radio"] {
        -webkit-appearance: none;
        width: 1.7em;
        height:1.7em;
        vertical-align:text-top;
    }    
`;
const StyledItemDelete = styled.span`
    color:#888;
    position:absolute;
    top:0.5em;
    right:0.5em;
`;
const StyledItemInfo = styled.div`
    font-size:0.8em;
    color:#aaa;
    div{
        text-align:start;
    }
`;
const StyledAddBtn = styled.div`
    border:solid 1px #ccc;
    border-radius:0.5em;
    margin-top:1%;
    padding:1em;
    font-size:0.8em;
    background:white;
    cursor:pointer;
`;
const StyledAddIcon = styled.span`
    font-size:1.5em;
    line-height:21px;
    display:inline-block;
    height:26px;
`;
const StyledAddText = styled.span`
    margin-left:0.5em;
    line-height:26px;
    display:inline-block;
    height:26px;
`;
const StyledDefaultSetting = styled.div`
    text-align:start;
    margin:5%;
    font-size:0.8em;
    input[type="checkbox"]:checked {
        background-color: crimson;
        border-color: crimson;
        color: white;
    }
    input[type="checkbox"] {
        -webkit-appearance: none;
        width: 1.5em;
        height:1.5em;
        border-radius:50%;
    }
`;
const StyledDefaultLabel = styled.label`
    vertical-align:middle;
    margin-left:0.5em;
    color:#aaa;
`;
const StyledDefaultCheckbox = styled.input`
    vertical-align:middle;
`;
const StyledSubmit = styled.div`
    color:white;
    height:2.5em;
    border-radius:0.5em;
    line-height:2.5em;
    background:crimson;
    position:fixed;
    bottom: 1%;
    margin: 2%;
    left: 0;
    right: 0;
    cursor:pointer;
`;
const StyledEmpty = styled.div`
    height:5em;
    background:#eee;
`;
const StyledSimpleLoading = styled.div`
    height:100%;
    width:100%;
    position:fixed;
    background:white;
`;

//------------------------------ COMPONENT ----------------------------------
const AddressUpdate = () => {
    //context
    const { self, setSelfHandler } = useContext(SelfContext);

    //init
    const navigate = useNavigate();

    //state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);    
    const [data, setData] = useState(null);    
    const [selected, setSelected] = useState(self.addrId);    

    //function
    const initData = async() => {
        try {
            setError(null);
            setLoading(true);
            setData(null);
            
            const result = await apiCall.get("/address");
            if(!result.data.length) return setData([]);
            
            if(Array.isArray(result.data) && !result.data.find(element => element.id == self.addrId)){
                setSelected(result.data[result.data.length-1].id);
            } 
            if(self.isNew) setSelected(result.data[0].id);
            setData(result.data.reverse());
        }catch(e){
            setError(e);
        }
    }

    const moveAdd = useCallback(() => {
        navigate('/MyPage/AddressAdd');
    }, []);

    const deleteAddr = async(id) => {
        try {
            const result = await apiCall.delete(`/address/${id}`);
            if(result.data="000") initData();
        }catch(e){
            setError(e);
        }
    };

    const defaultSave = async() => {
        try {
            const params = {
                addrId : selected,
            }
            const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
            const result = await apiCall.put("/self", {params}, {headers});    
            if(result.data == '000'){
                //const updateData = await apiCall.get(`/self/self`);
                //setSelfHandler(updateData.data); //----SELF CONTEXT UPDATE----//
            } 
            navigate(-1);
        }catch(e){
            setError(e);
        }
    }

    //effect
    useEffect(() => {
        initData();
    }, [])

    //memo
    const itemGear = useMemo(() => {
        return data ? (
            data.map((item, index)=>(                
                <StyledItem key={index}>
                    <StyledItemBody htmlFor={index} onClick={() => setSelected(item.id)}>
                        <StyledItemTop>
                            <input 
                                type="radio" 
                                name="addr" 
                                id={index} 
                                defaultChecked={selected == item.id}
                            />
                            <span>{item.recipient}</span>
                            <span>{item.tel}</span>
                        </StyledItemTop>
                        <StyledItemInfo>
                            <div>{item.address1}</div>
                            <div>{item.address2}</div>
                            <div>{`공동현관 비밀번호 : ${item.password || ''}`}</div>
                            <div>{`배송 수령 방법 : ${item.extraInfo || ''}`}</div>
                        </StyledItemInfo>
                    </StyledItemBody>
                    <StyledItemDelete onClick={() => deleteAddr(item.id)}><RiDeleteBin6Line size="1.2em"/></StyledItemDelete>
                </StyledItem>
            ))                         
        ) : null;
    }, [data]);

    const addBtnGear = useMemo(() => {
        return (
            <StyledItem>
                <StyledAddBtn onClick={moveAdd}>
                    <StyledAddIcon>
                        +
                    </StyledAddIcon>
                    <StyledAddText>
                        새 배송지 추가하기
                    </StyledAddText>
                </StyledAddBtn>
            </StyledItem>
        )
    }, []);

    const defaultGear = useMemo(() => {
        return (
            <StyledDefaultSetting>
                <StyledDefaultCheckbox id="m" type="checkbox" defaultChecked={true} disabled/>
                <StyledDefaultLabel htmlFor="m">현재 배송지를 기본 배송지로 설정</StyledDefaultLabel>
            </StyledDefaultSetting>                
        )
    }, []);

    //render
    if(!data) return <StyledSimpleLoading />;
    return(
        <StyledAddressUpdate>
            <Title text="배송지 관리"/>
            <StyledContent>
                <StyledList>
                    {itemGear}
                    {addBtnGear}
                </StyledList>
                {defaultGear}
                <StyledEmpty />
            </StyledContent>
            <StyledSubmit onClick={defaultSave}>확인</StyledSubmit>
        </StyledAddressUpdate>
    )
}

export default AddressUpdate;