import axios from "axios";

const vnotiCall = axios.create({
    /*TEST*/
    baseURL: `${process.env.REACT_APP_VNOTI_URL}/api`,
    /*REAL FOR BUILD*/
    //baseURL: `${process.env.REACT_APP_SERVER_URL}/api_v`,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
    withCredentials: false,
});

vnotiCall.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem("vtoken");
        if (config.headers && token) config.headers["Authorization"] = token;
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }    
);

vnotiCall.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.log(error);
        const { config, response: { status } } = error;
        const originalRequest = config;
        console.log(status);
        return Promise.reject(error);
    }
);

export default vnotiCall;