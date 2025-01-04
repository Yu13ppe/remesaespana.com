import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../Hooks/useLocalStorage";

export const DataContext = createContext();

export function DataContextProvider(props) {
    const [accessToken, setAccessToken] = useLocalStorage("token", '');
    const [accessAdminToken, setAccessAdminToken] = useLocalStorage("130328073103", '');
    const [logged, setLogged] = useLocalStorage('log', false);
    const [currencyPrice, setCurrencyPrice] = useState([]);
    const url = 'https://apiremesa.up.railway.app'; 
    // https://apiremesa.up.railway.app
    const value = {
        logged, setLogged, 
        accessToken, setAccessToken,
        accessAdminToken, setAccessAdminToken,
        currencyPrice, setCurrencyPrice,
        url
    };

    return (
        <DataContext.Provider value={value}>
            {props.children}
        </DataContext.Provider>
    );
}

export function useDataContext() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataContext must be used within a DataContextProvider');
    }
    return context;
}