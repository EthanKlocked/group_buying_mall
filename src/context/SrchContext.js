//------------------------------ MODULE -------------------------------------
import { createContext, useState } from 'react';

//------------------------------ COMPONENT ----------------------------------

const SrchContext = createContext({
    data: new Object(),
    setSrchHandler: () => {},
});

const SrchContextProvider = ({ children }) => {
    //state
    const [srch, setSrch] = useState(null);    

    //func
    const setSrchHandler = (d) => setSrch(d);

    //render
    return (
        <SrchContext.Provider value = {{ srch, setSrchHandler }}>
            { children }
        </SrchContext.Provider>
    );     
}

export { SrchContext, SrchContextProvider };