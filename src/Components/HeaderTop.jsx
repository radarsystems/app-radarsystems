import { useContext, useEffect, useState } from "react";
import { IoHelpCircleOutline, IoMoonOutline, IoNotificationsOutline, IoSunnyOutline } from "react-icons/io5";
import { AuthContext } from "../Context/AuthContext";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import $ from "jquery"
import { LoadImageProfile } from "../Functions/Global";
import { Icon } from "@iconify/react";

export function HeaderTop({ MenuLeft, MenuLeftAction }) {
    const { UserInfo } = useContext(AuthContext)
    const [theme, setTheme] = useState('dark')
    const Navigator = useNavigate()

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

                <div className="left mb">
                    <button className="open" onClick={(ev) => { MenuLeftAction() }}>
                        <Icon icon="iconoir:nav-arrow-right" />
                    </button>
                </div>
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
                                <Link to="/companys" className="select-company">Seleccionar Cuenta</Link>
                        }
                    </div>
                    <button className="option" onClick={changeTheme} >
                        {theme == "dark" ? <IoMoonOutline /> : ""}
                        {theme == "ligth" ? <IoSunnyOutline /> : ""}

                    </button>
                    <button className="option"><IoNotificationsOutline /></button>
                    <div className="user">
                        <img src="img/icons/default-user.jpg" alt="" />
                    </div>
                </div>
            </div>

            <div className="menu-top-user">
                <ul>
                    <li><button onClick={(ev) => { Navigator("") }}><Icon icon="material-symbols:report-outline" /> Reportar</button></li>
                    <li><button onClick={(ev) => { Navigator("/logout") }}><Icon icon="ic:outline-no-meeting-room" /> Cerrar sesión</button></li>
                </ul>
            </div>
        </>
    )
}