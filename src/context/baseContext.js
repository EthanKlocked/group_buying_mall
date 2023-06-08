//------------------------------ MODULE -------------------------------------
import { createContext, useState } from 'react';

//------------------------------ COMPONENT ----------------------------------

const BaseContext = createContext({
    base: new Object(),
    setBaseHandler: () => {},
});

const BaseContextProvider = ({ init, children }) => {
    //state
    const [base, setBase] = useState(init);    

    //func
    const setBaseHandler = (b) => setBase(b);

    //render
    return (
        <BaseContext.Provider value = {{ base, setBaseHandler }}>
            { children }
        </BaseContext.Provider>
    );     
}

export { BaseContext, BaseContextProvider };