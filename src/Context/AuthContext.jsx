import { createContext, useEffect, useState } from "react";
import { GetCookie } from "../Functions/Global";
import axios from "axios";
import { API_URL } from "../ExportUrl";
import { useLocation } from "react-router-dom";

export const AuthContext = createContext()


export const AuthProvider = (params) => {
    const [UserInfo, setUserInfo] = useState({})
    const [Auth, setAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {


        function loadCompany() {
            let companyId = GetCookie("company")


            let formData = new FormData()

            formData.append("id_company", companyId);

            if (companyId) {
                axios.post(API_URL + "/api/get/company", formData, { withCredentials: true })
                    .then((response) => { return response.data })
                    .then((data) => {
                        setUserInfo(prevData => {
                            let newData = { ...prevData }
                            newData.company = data
                            return newData
                        })

                    })
            }

        }

        (async function () {
            let token = GetCookie("token")
            let route = window.location.pathname;

            await axios.get(API_URL + "/api/get/my", { withCredentials: true }).then((response) => { return response.data }).then((data) => {
                if (data.id_admin) {
                    setAuth(true)
                    setUserInfo(data)
                    loadCompany()
                    setLoading(false)

                } else {
                    if (route !== "/" && route !== "/auth" && !route.startsWith("/buttonsqr/")) {
                        window.location.href = "/";
                    }

                    setTimeout(() => {
                        setLoading(false)
                    }, 500)


                }
            })

        }())


    }, [])

    return <AuthContext.Provider value={{ UserInfo, setUserInfo, Auth, LoadingAuth: loading }}  {...params}></AuthContext.Provider>
}