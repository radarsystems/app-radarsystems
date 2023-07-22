import { createContext, useEffect, useState } from "react";

const TitleContext = createContext()


function TitleProvider(childrens) {

    const [Title, setTitle] = useState()

    useEffect(() => {
        document.title = Title
    }, [Title])


    useEffect(() => {
        setTitle(import.meta.env.VITE_APP_NAME + "App")
    }, [])

    return <TitleContext.Provider value={{ setTitle }} {...childrens}></TitleContext.Provider>
}

export { TitleProvider, TitleContext }