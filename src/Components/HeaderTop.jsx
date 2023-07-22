import { useContext, useEffect, useState } from "react";
import { IoHelpCircleOutline, IoNotificationsOutline, IoSunnyOutline } from "react-icons/io5";
import { AuthContext } from "../Context/AuthContext";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";
import $ from "jquery"

export function HeaderTop() {
    const { UserInfo } = useContext(AuthContext)
    const [theme, setTheme] = useState('dark')

    useEffect(() => {
        $(document.body).attr("theme", "dark")
    }, [theme])

    return (
        <>
            <div className="header-top">
                <div className="right">
                    <div className="company">
                        {
                            UserInfo?.company?.name ?
                                <>
                                    <div className="body">
                                        <img src="img/icons/default_profile.png" alt="" />
                                        <span>{UserInfo?.company?.name}</span>
                                    </div>
                                </>
                                :
                                <Link to="/companys" className="select-company">Seleccionar Empresa</Link>
                        }
                    </div>
                    <button className="option"><IoHelpCircleOutline /></button>
                    <button className="option"><IoSunnyOutline /></button>
                    <button className="option"><IoNotificationsOutline /></button>
                    <div className="user">
                        <img src="img/icons/default-user.jpg" alt="" />
                        <p className="name">
                            {UserInfo.user}
                            <i><MdKeyboardArrowDown /></i>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}