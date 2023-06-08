//------------------------------ MODULE -------------------------------------
import { createContext, useState } from 'react';

//------------------------------ COMPONENT ----------------------------------

const SlideContext = createContext({
    slide: new Object(),
    setSlideHandler: () => {},
});

const SlideContextProvider = ({ children }) => {
    //state
    const [slide, setSlide] = useState(null);    

    //func
    const setSlideHandler = (s) => setSlide(s);

    //render
    return (
        <SlideContext.Provider value = {{ slide, setSlideHandler }}>
            { children }
        </SlideContext.Provider>
    );     
}

export { SlideContext, SlideContextProvider };