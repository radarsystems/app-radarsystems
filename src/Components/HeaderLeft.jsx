import { Link } from "react-router-dom";
import { IoArrowForwardOutline, IoBusinessOutline, IoChevronForwardOutline, IoCopyOutline, IoPersonOutline, IoSendOutline, IoStatsChartOutline, IoTimerOutline } from "react-icons/io5"
import { MdArrowForwardIos, MdOutlineCampaign } from "react-icons/md"

import $ from "jquery"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { AiOutlineLink } from "react-icons/ai";
import { VscTools } from "react-icons/vsc"

export default function HeaderLeft() {

    const { UserInfo } = useContext(AuthContext)
    const [opacityMenu, setOpacity] = useState();

    useEffect(() => {

        if (UserInfo.company_default == undefined && UserInfo.company == undefined) {
            setOpacity(true)
        }

        if (UserInfo.company !== undefined) {
            setOpacity(false)
        }

    }, [UserInfo])

    function ToggleChild(ev) {
        ev.stopPropagation()
        let target = $(ev.target)
        let li = target.parents("li")

        let ul = target.parents("li").find("ul")

        let buttonActive = $(".header-left").find("button.active")
        let ulActive = $(".header-left").find("ul.active")

        if (buttonActive.parents("li").index() !== li.index()) {
            ulActive.slideToggle()
            ulActive.removeClass("active")
            buttonActive.removeClass("active")

            target.addClass("active")
            ul.addClass("active")
            ul.slideToggle()
        } else {
            buttonActive.removeClass("active")
            ulActive.removeClass("active")
            ulActive.slideToggle()
        }

    }

    return (
        <>
            <div className="header-left">
                <div className="logo">
                    <img src="/img/icons/logo.png" alt="" />
                </div>
                <ul>

                    <li>
                        <button onClick={ToggleChild}><i className="icon"><IoBusinessOutline /></i> Empresas <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li><Link to="/companys">Mis Empresas</Link></li>
                        </ul>
                    </li>
                    <li><button onClick={ToggleChild}><i className="icon"><IoPersonOutline /></i> Administracion <i className="arrow"><MdArrowForwardIos /></i></button>

                        <ul>
                            <li><Link to="/contacts/me">Mis Contactos</Link></li>
                            <li><Link to="/contacts/upload">Subir Nuevos</Link></li>
                            <li><Link to="/contacts/segment">Segmentos</Link></li>
                        </ul>
                    </li>
                    <li className={opacityMenu ? 'opacity' : ''}>
                        <button onClick={ToggleChild}><i className="icon"><IoSendOutline /></i> Campañas <i className="arrow"><MdArrowForwardIos /></i></button>

                        <ul>
                            <li><Link to="/campaigns">Mis Campañas</Link></li>
                            <li><Link to="/campaigns/new">Crear Nueva</Link></li>
                        </ul>
                    </li>
                    <li className={opacityMenu ? 'opacity' : ''}><button onClick={ToggleChild}><i className="icon"><IoPersonOutline /></i> Contactos <i className="arrow"><MdArrowForwardIos /></i></button>

                        <ul>
                            <li><Link to="/contacts/lists">Mis Listas</Link></li>
                            <li><Link to="/contacts/segment">Segmentos</Link></li>
                        </ul>
                    </li>
                    <li className={opacityMenu ? 'opacity' : ''}><button onClick={ToggleChild}><i className="icon"><IoTimerOutline /></i> Automatizacion <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li><Link>WorkFlow</Link></li>
                            <li><Link>Programacion</Link></li>
                        </ul>
                    </li>

                    <li className={opacityMenu ? 'opacity' : ''}>
                        <button onClick={ToggleChild}><i className="icon"><IoStatsChartOutline /></i> Estadisticas <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li to="/stats/campaign"><Link>Campañas</Link></li>
                            <li to="/stats/quests"><Link>Encuestas</Link></li>

                        </ul>
                    </li>

                    <li className={opacityMenu ? 'opacity' : ''}>
                        <button onClick={ToggleChild}><i className="icon"><VscTools /></i> Herramientas <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li><Link to="/editor/canvas">Editor Canvas</Link></li>
                            <li to="/stats/quests"><Link>Encuestas</Link></li>

                        </ul>
                    </li>


                    <li className={""}>
                        <button onClick={ToggleChild}><i className="icon"><IoCopyOutline /></i> Encuestas <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li><Link to="/surveys">Mis encuestas</Link></li>
                        </ul>
                    </li>

                    <li className={""}>
                        <button onClick={ToggleChild}><i className="icon"><AiOutlineLink /></i> Acortador <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li><Link to="/shorturls">Mis URLS</Link></li>
                            <li><Link to="/shorturls/campaigns">Campañas</Link></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </>
    )
}