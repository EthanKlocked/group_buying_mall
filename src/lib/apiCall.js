import axios from "axios";
import { msgData } from "static";

axios.defaults.withCredentials = true;

const apiCall = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}/api_f`,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
    withCredentials: true,
});

apiCall.interceptors.request.use(
    function (config) {
        if(config.method=="put"||config.method=="post") config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

        delete apiCall.defaults.headers.common.Authorization;
        delete apiCall.defaults.headers.common.RefreshToken; 

        const token = localStorage.getItem("token");
        if (config.headers && token) {
            const { access } = JSON.parse(token);
            config.headers["Authorization"] = `${access}`;
            return config;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }    
);

apiCall.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.log(error);
        const { config, response: { status } } = error;
        const originalRequest = config;
        console.log(status);
        if (status === 401) {            
            const token = localStorage.getItem("token");
            const { refresh } = JSON.parse(token);

            const params = { data : refresh };
            const result = await apiCall.get(`/refresh`, {params});            
            if(result.data['res'] == "SUCCESS"){
                localStorage.setItem('token', JSON.stringify(result.data.token));
                apiCall.defaults.headers.common.Authorization = `Bearer ${result.data.token.access}`;
                originalRequest.headers.Authorization = `Bearer ${result.data.token.access}`;
            }else{
                localStorage.clear();
                delete apiCall.defaults.headers.common.Authorization;
                delete originalRequest.headers.Authorization;
                delete apiCall.defaults.headers.common.RefreshToken;
                delete originalRequest.headers.RefreshToken;

                if(window.location.href.includes('MyPage')||window.location.href.includes('Order')){ //----CASE REALTIME TOKEN CHECK----//
                    if(!alert(msgData['loginExpired'])) window.location.replace(`${process.env.REACT_APP_HOST}/Login`);
                } 
            }
            return apiCall(originalRequest);
        }else if(status === 410){
            localStorage.clear();
            delete apiCall.defaults.headers.common.Authorization;
            delete originalRequest.headers.Authorization;
            delete apiCall.defaults.headers.common.RefreshToken;
            delete originalRequest.headers.RefreshToken;                
            if(window.location.href.includes('MyPage')||window.location.href.includes('Order')){ //----CASE REALTIME TOKEN CHECK----//
                if(!alert(msgData['loginExpired'])) window.location.replace(`${process.env.REACT_APP_HOST}/Login`);
            }
            return apiCall(originalRequest);
        }else if(status === 403){
            localStorage.clear();
            delete apiCall.defaults.headers.common.Authorization;
            delete originalRequest.headers.Authorization;
            delete apiCall.defaults.headers.common.RefreshToken;
            delete originalRequest.headers.RefreshToken;                
            return apiCall(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default apiCall;
