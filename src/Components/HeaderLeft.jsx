import { Link, useNavigate } from "react-router-dom";
import { IoArrowForwardOutline, IoAtSharp, IoBusinessOutline, IoChevronForwardOutline, IoCopyOutline, IoHomeOutline, IoLinkOutline, IoPersonOutline, IoQrCode, IoReceiptOutline, IoSendOutline, IoStatsChartOutline, IoTimerOutline } from "react-icons/io5"
import { MdArrowForwardIos, MdOutlineCampaign } from "react-icons/md"

import $ from "jquery"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { AiOutlineLink } from "react-icons/ai";
import { VscTools } from "react-icons/vsc"
import { GetCookie } from "../Functions/Global";
import { Icon } from "@iconify/react";

export default function HeaderLeft({ MenuLeft }) {

    const { UserInfo } = useContext(AuthContext)
    const [opacityMenu, setOpacity] = useState();
    const Navigator = useNavigate()

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

    if (!GetCookie('token')) {

    }



    return (
        <>
            <div className={`header-left ${MenuLeft ? 'active' : ''}`}>
                <div className="logo">
                    <img src="/img/icons/logo.png" alt="" />
                </div>
                <ul>


                    <li className={opacityMenu ? 'opacity' : ''}>
                        <button onClick={(ev) => { Navigator("/home") }}><i className="icon"><IoHomeOutline /></i> Home <i className="arrow"></i></button>
                    </li>

                    <li>
                        <button onClick={ToggleChild}><i className="icon"><IoLinkOutline /></i> Configuracion <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li><Link to="/settings-account/account">Cuenta</Link></li>
                            <li><Link to="/settings-account/security">Seguridad</Link></li>
                            <li><Link to="/settings-account/footer">Footer</Link></li>
                            <li><Link to="/settings-account/domains">Dominios</Link></li>
                        </ul>
                    </li>


                    <li className={opacityMenu ? 'opacity' : '' + "none"}>
                        <button onClick={ToggleChild}><i className="icon"><VscTools /></i> Herramientas <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li><Link to="/editor/canvas">Editor Canvas</Link></li>
                            <li><Link to="/editor/buttons">Editor Botonera</Link></li>
                        </ul>
                    </li>

                    <li className="none">
                        <button onClick={ToggleChild}><i className="icon"><IoBusinessOutline /></i> Cuentas <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li><Link to="/companys">Mis Cuentas</Link></li>
                            <li><Link to="/companys/add">Crear Cuenta</Link></li>

                        </ul>
                    </li>



                    <li className={opacityMenu ? 'opacity' : '' + "none"}>
                        <button onClick={ToggleChild}><i className="icon"><IoSendOutline /></i> Recordatorios <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li><Link to="/campaigns">Email </Link></li>
                            <li><Link to="/campaigns">Sms</Link></li>
                            <li><Link to="/campaigns/new">Mixto</Link></li>
                        </ul>
                    </li>

                    <li className={opacityMenu ? 'opacity' : ''}>
                        <button onClick={(ev) => { ToggleChild(ev); }}><i className="icon"><IoSendOutline /></i> Campañas <i className="arrow"><MdArrowForwardIos /></i></button>

                        <ul>
                            <li><Link to="/campaigns/em">Email Marketing</Link></li>
                            <li><Link to="/campaigns/em-mt">Email MT</Link></li>
                            <li><Link to="/campaigns/sms">SMS Marketing</Link></li>
                            <li><Link to="/campaigns/sms-mt">SMS MT</Link></li>
                            <li><Link to="/campaigns/new">Crear Campana</Link></li>
                        </ul>
                    </li>
                    <li className={opacityMenu ? 'opacity' : ''}><button onClick={ToggleChild}><i className="icon"><IoPersonOutline /></i> Listas <i className="arrow"><MdArrowForwardIos /></i></button>

                        <ul>
                            <li><Link to="/contacts">Mis Contactos</Link></li>
                            <li><Link to="/contacts/lists">Mis Listas</Link></li>
                            <li><Link to="/contacts/lists/email">Listas Correo</Link></li>
                            <li><Link to="/contacts/lists/sms">Listas Mensajeria</Link></li>
                            <li><Link to="/contacts/lists/ws">Listas Whatsapp</Link></li>
                            <li><Link to="/contacts/segments">Segmentos</Link></li>
                        </ul>
                    </li>
                    <li className={opacityMenu ? 'opacity' : '' + "none"}><button onClick={ToggleChild}><i className="icon"><IoTimerOutline /></i> Automatizacion <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li><Link>WorkFlow</Link></li>
                            <li><Link>Programacion</Link></li>
                            <li><Link>Auto-Responders</Link></li>
                        </ul>
                    </li>

                    <li className={opacityMenu ? 'opacity' : '' + "none"}>
                        <button onClick={ToggleChild}><i className="icon"><IoStatsChartOutline /></i> Estadisticas <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li to="/stats/campaign"><Link>Email Marketing</Link></li>
                            <li to="/stats/campaign"><Link>Email MT</Link></li>
                            <li to="/stats/quests"><Link>Sms Marketing</Link></li>
                            <li to="/stats/quests"><Link>Sms MT</Link></li>
                            <li to="/stats/quests"><Link>Encuestas</Link></li>
                            <li to="/stats/quests"><Link>Botonera QR</Link></li>
                            <li to="/stats/quests"><Link>Botonera URL</Link></li>
                            <li to="/stats/quests"><Link>Medusa</Link></li>
                            <li to="/stats/quests"><Link>Landings</Link></li>
                            <li to="/stats/quests"><Link>Google Analytics</Link></li>
                        </ul>
                    </li>




                    <li className={"" + "none"}>
                        <button onClick={ToggleChild}><i className="icon"><IoCopyOutline /></i> Formulario <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li><Link to="/surveys/editor">Crear Formulario</Link></li>
                            <li><Link to="/surveys">Mis Formularios</Link></li>
                            <li><Link to="/surveys">Plantillas</Link></li>

                        </ul>
                    </li>
                    <li className={"" + "none"}>
                        <button onClick={ToggleChild}><i className="icon"><IoReceiptOutline /></i> Boletines Electronicos <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li><Link to="/templates">Mis Boletines</Link></li>
                            <li><Link to="/editor/canvas">Crear Boletin</Link></li>
                            <li><Link to="/landings">Plantillas</Link></li>
                            <li><Link to="/landings">Plantillas IA</Link></li>
                        </ul>
                    </li>


                    <li className={"" + "none"}>
                        <button onClick={ToggleChild}><i className="icon"><IoReceiptOutline /></i> Landings Page <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li><Link to="/landings">Mis Landings</Link></li>
                            <li><Link to="/editor/landings">Crear Landings</Link></li>
                        </ul>
                    </li>


                    <li className={"none"}>
                        <button onClick={ToggleChild}><i className="icon"><Icon icon="mdi:jellyfish-outline" /></i> Medusa <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li><Link to="/shorturls/campaigns">Mis Campañas</Link></li>
                            <li><Link to="/shorturls/campaigns/add">Crear Campana</Link></li>
                            <li><Link to="/shorturls">Mis Enlaces</Link></li>
                            <li><Link to="/shorturls/add">Crear Enlace</Link></li>
                        </ul>
                    </li>

                    <li className={""}>
                        <button onClick={ToggleChild}><i className="icon"><IoQrCode /></i> Botonera QR <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>

                            <li><Link to="/editor/buttonsqr">Crear Botonera QR</Link></li>
                            <li><Link to="/buttonsqr">Mis Botoneras QR</Link></li>
                            <li><Link to="/qr/add">Crear QR individual</Link></li>
                            <li><Link to="/qr/import">Importar QR</Link></li>
                            <li><Link to="/qr">Mis Qr's</Link></li>




                        </ul>
                    </li>

                    <li className={"" + "none"}>
                        <button onClick={ToggleChild}><i className="icon"><Icon icon="ri:links-fill" /></i> Botonera URL <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li><Link to="/editor/buttons">Crear Botonera URL</Link></li>
                            <li><Link to="/buttons">Mis Botoneras URL</Link></li>
                        </ul>
                    </li>

                    <li className={"" + "none"}>
                        <button onClick={ToggleChild}><i className="icon"><IoBusinessOutline /></i> Validador Email <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li><Link to="/companys">Mis Validaciones</Link></li>
                            <li><Link to="/companys">Crear Validacion</Link></li>
                            <li><Link to="/companys">Estadisticas</Link></li>

                        </ul>
                    </li>


                    <li className={"" + "none"}>
                        <button onClick={ToggleChild}><i className="icon"><IoBusinessOutline /></i>  API <i className="arrow"><MdArrowForwardIos /></i></button>
                        <ul>
                            <li><Link to="/companys">Mis Credenciales</Link></li>
                            <li><Link to="/companys">Crear Validacion</Link></li>
                            <li><Link to="/companys">Estadisticas</Link></li>

                        </ul>
                    </li>
                </ul>
            </div >
        </>
    )
}