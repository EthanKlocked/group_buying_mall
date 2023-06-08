//------------------------------ MODULE -------------------------------------
import { createContext, useState } from 'react';

//------------------------------ COMPONENT ----------------------------------

const CacheContext = createContext({
    cache: new Object(),
    setCacheHandler: () => {},
});

const CacheContextProvider = ({ children }) => {
    //state
    const [cache, setCache] = useState(new Object());    

    //func
    const setCacheHandler = (c) => setCache(c);

    //render
    return (
        <CacheContext.Provider value = {{ cache, setCacheHandler }}>
            { children }
        </CacheContext.Provider>
    );
}

export { CacheContext, CacheContextProvider };