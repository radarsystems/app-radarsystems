import { createContext, useState } from "react";

export const AppContext = createContext()


export const AppProvider = (params) => {
    const [App, setApp] = useState({})
    return (
        <AppContext.Provider value={{ App, setApp }} {...params}></AppContext.Provider>
    )
}

