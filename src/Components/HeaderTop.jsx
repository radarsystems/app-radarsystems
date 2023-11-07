import { useContext, useEffect, useState } from "react";
import { IoHelpCircleOutline, IoMoonOutline, IoNotificationsOutline, IoSunnyOutline } from "react-icons/io5";
import { AuthContext } from "../Context/AuthContext";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link } from "react-router-dom";
import $ from "jquery"
import { LoadImageProfile } from "../Functions/Global";

export function HeaderTop() {
    const { UserInfo } = useContext(AuthContext)
    const [theme, setTheme] = useState('dark')

    function changeTheme() {

        switch (theme) {
            case 'ligth':
                setTheme("dark")
                break;

            case 'dark':
                setTheme("ligth")
                break;

            default:
                setTheme("ligth")
                break;
        }
    }

    useEffect(() => {
        $(document.body).attr("theme", theme)
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
                                        <img src={UserInfo?.company?.photo !== undefined ? LoadImageProfile(UserInfo) : "img/icons/default_profile.png"} alt="" />
                                        <span>{UserInfo?.company?.name}</span>
                                    </div>
                                </>
                                :
                                <Link to="/companys" className="select-company">Seleccionar Empresa</Link>
                        }
                    </div>
                    <button className="option"><IoHelpCircleOutline /></button>
                    <button className="option" onClick={changeTheme} >
                        {theme == "dark" ? <IoMoonOutline /> : ""}
                        {theme == "ligth" ? <IoSunnyOutline /> : ""}

                    </button>
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