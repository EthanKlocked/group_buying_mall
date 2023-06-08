//------------------------------ MODULE -------------------------------------
import { createContext, useState } from 'react';

//------------------------------ COMPONENT ----------------------------------

const OrderContext = createContext({
    order: new Object(),
    setOrderHandler: () => {},
});

const OrderContextProvider = ({ children }) => {
    //state
    const [order, setOrder] = useState(null);    

    //func
    const setOrderHandler = (o) => setOrder(o);

    //render
    return (
        <OrderContext.Provider value = {{ order, setOrderHandler }}>
            { children }
        </OrderContext.Provider>
    );     
}

export { OrderContext, OrderContextProvider };