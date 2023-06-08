import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {isAndroid, isIOS} from "react-device-detect";
import ReactGA from "react-ga4";

/*
window.addEventListener("beforeunload", () => {
    console.log(1);
    window.localStorage.setItem(
        'lastKnown',
        JSON.stringify({
            conditions:window.location.href,
            data:document.getElementById("home").innerHTML
        })
    )
});
*/

//google analytics connect
ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS);

//fix viewport in android
if(isAndroid){
    let viewheight = window.outerHeight;
    let viewwidth = window.outerWidth;
    let viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute("content", "height=" + viewheight + "px, width=" + viewwidth + "px, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0");
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
