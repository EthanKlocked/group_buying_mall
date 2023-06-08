//------------------------------ MODULE -------------------------------------
import styled from "styled-components";
import { Title, CustomToggle, Modal, CustomLoading } from "component";
import { useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { msgData } from "static";
import { apiCall } from "lib";
import { SelfContext } from "context";

//------------------------------ CSS ----------------------------------------
const StyledSettingsUpdate = styled.div`
    height:100%;
`;
const StyledContent = styled.div`
    padding:3.5em 5%;
`;
const StyledItem = styled.div`
    padding:1.2em 0;
`;
const StyledItemTitle = styled.span`
    float:left;
    clear:both;
    cursor:pointer;
`;
const StyledItemToggle = styled.span`
    float:right;
`;

//------------------------------ COMPONENT ----------------------------------
const Settings = () => {
    //init
    const navigate = useNavigate();

    //context
    const { self, setSelfHandler } = useContext(SelfContext);

    //state
    const [confirm, setConfirm] = useState(false);
    const [alertObj, setAlertObj] = useState(null);
    const [loading, setLoading] = useState(false);

    //function
    const memberSetting = async(c, v) => {
        const params = new Object();
        params[c] = v;
        const headers = {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
        const result = await apiCall.put(`/member`, {params}, {headers});
    }

    const logout = () => {
        localStorage.clear();
        setSelfHandler(null); //----SELF CONTEXT DELETE----//
        navigate('/Login', { replace : true });
    };

    const leave = async() => {
        const params = { kakaoAdmin : process.env.REACT_APP_KAKAO_ADMIN };
        const result = await apiCall.delete(`/member/${self.id}`, {params});
        
        setLoading(true);
        setTimeout(() =>{
            resultObj.desc = (result.data == 'success') ? '회원탈퇴가 완료되었습니다. 감사합니다.' : '관리자에게 문의 해 주세요.';
            resultObj.title = (result.data == 'success') ? '회원탈퇴 완료' : '에러가 발생하였습니다.';
            setAlertObj(resultObj);
        }, 1000);
        const resultObj = {exec : () => logout()};
    }

    const logoutChk = () => {
        const logoutConfirm = {
            type: 'logout',
            title: null,
            msg : 'logoutConfirm',
            exec : () => logout()
        }
        setConfirm(logoutConfirm);
    }

    const leaveChk = () => {
        const leaveConfirm = {
            type: 'leave',
            title : 'leaveConfirm',
            msg : 'leaveInfo',
            exec : () => leave()
        }
        setConfirm(leaveConfirm);
    }


    //memo
    const confirmGear = useMemo(() => {
        return confirm ? (
            <Modal 
                option={{
                    width : "70%", 
                    height : confirm.type=="leave" ? "10em": "8em",
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : confirm.type=="leave" ? "0.8em" : "1em", 
                    buttonName : ["확인","취소"]
                }} 
                type={2}
                proEvent = {() => {
                    confirm.exec();
                    return true;
                }}
                data={{desc : msgData[confirm.msg], title : confirm.title ? msgData[confirm.title] : null}}
                state={confirm} 
                closeEvent={() => setConfirm(null)}
            />
        ) : null;
    }, [confirm]);    

    const alertGear = useMemo(() => {
        return alertObj ? (
            <Modal 
                option={{
                    width : "17em", 
                    height : "8em",
                    textAlign : "center",
                    alignContent : "center",  
                    fontSize : "0.8em", 
                    buttonName : ["확인"]
                }} 
                type={1}
                data={{desc : alertObj.desc, title: alertObj.title}}
                state={alertObj} 
                closeEvent={() => alertObj.exec()}
            />        
        ) : null
    }, [alertObj])

    //render
    return (
        <StyledSettingsUpdate>
            {loading ? <CustomLoading /> : null}
            <Title text="설정" />
            <StyledContent>
                <StyledItem>
                    <StyledItemTitle>SMS 마케팅 수신</StyledItemTitle>
                    <StyledItemToggle>  
                        <CustomToggle 
                            defaultValue = {self.smsser == 'y' ? true : false}
                            pro={() => memberSetting('smsser', 'y')} 
                            cons={() => memberSetting('smsser', 'n')}
                        />
                    </StyledItemToggle>
                </StyledItem>
                <StyledItem>
                    <StyledItemTitle>이메일 마케팅 수신</StyledItemTitle>
                    <StyledItemToggle>  
                        <CustomToggle 
                            defaultValue = {self.emailser == 'y' ? true : false}
                            pro={() => memberSetting('emailser', 'y')} 
                            cons={() => memberSetting('emailser', 'n')}
                        />
                    </StyledItemToggle>
                </StyledItem>                
                <StyledItem>
                    <StyledItemTitle onClick = {() => leaveChk()}>회원 탈퇴하기</StyledItemTitle>
                </StyledItem>
                <StyledItem>
                    <StyledItemTitle onClick = {() => logoutChk()}>로그아웃</StyledItemTitle>          
                </StyledItem>
            </StyledContent>
            {confirmGear}
            {alertGear}
        </StyledSettingsUpdate>
    )
}

export default Settings;