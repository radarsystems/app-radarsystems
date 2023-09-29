import { useContext, useEffect } from "react";
import HeaderLeft from "../Components/HeaderLeft";
import { HeaderTop } from "../Components/HeaderTop";
import "../Styles/css/Home.css"
import { AuthContext } from "../Context/AuthContext";
import { GetCookie } from "../Functions/Global";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Global({ Element, CompanyNeed }) {

    const { UserInfo } = useContext(AuthContext)

    const Navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [cookie, setCookie] = useState('wait')

    useEffect(() => {

        let company = GetCookie('company')

        if (!company) {
            Navigate("/companys")
            setCookie(false)
        }

    }, [])

    return (
        <>
            <div className="app">
                <HeaderLeft />
                <HeaderTop />


                <div className="page">

                    {CompanyNeed ?
                        UserInfo?.company?.id_company ? <Element /> :
                            cookie == false ?
                                <div className="center-loading">
                                    <img src="/img/icons/oficina.png" alt="" />
                                    <p>No has seleccionado ninguna empresa</p>
                                </div>
                                : <div className="center-loading">
                                    <div className="circle"></div>
                                </div>
                        : <Element />}

                </div>
            </div>
        </>
    )
}