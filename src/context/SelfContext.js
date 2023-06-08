//------------------------------ MODULE -------------------------------------
import { createContext, useState } from 'react';

//------------------------------ COMPONENT ----------------------------------

const SelfContext = createContext({
    self: new Object(),
    setSelfHandler: () => {},
});

const SelfContextProvider = ({ children }) => {
    //state
    const [self, setSelf] = useState(null);    

    //func
    const setSelfHandler = (o) => setSelf(o);

    //render
    return (
        <SelfContext.Provider value = {{ self, setSelfHandler }}>
            { children }
        </SelfContext.Provider>
    );     
}

export { SelfContext, SelfContextProvider };