import { createContext, useEffect, useState } from "react";
import { GetCookie } from "../Functions/Global";
import axios from "axios";
import { API_URL } from "../ExportUrl";

export const AuthContext = createContext()


export const AuthProvider = (params) => {
    const [UserInfo, setUserInfo] = useState({})
    const [Auth, setAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        (async function () {
            let token = GetCookie("token")

            if (token) {
                await axios.get(API_URL + "/api/get/my", { withCredentials: true }).then((response) => { return response.data }).then((data) => {
                    if (data.id_admin) {
                        setAuth(true)
                        setUserInfo(data)
                        setLoading(false)
                    }
                })
            }
        }())


    }, [])

    return <AuthContext.Provider value={{ UserInfo, setUserInfo, Auth, LoadingAuth: loading }}  {...params}></AuthContext.Provider>
}