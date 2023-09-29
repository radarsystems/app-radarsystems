import { IoAdd, IoEllipsisHorizontalSharp, IoLogoDiscord, IoLogoFacebook, IoLogoInstagram, IoLogoLinkedin, IoLogoTiktok, IoLogoTwitter, IoLogoWhatsapp, IoMailOpenOutline, IoTrashOutline } from "react-icons/io5";
import { BsSpotify, BsTelegram } from "react-icons/bs"
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../ExportUrl";
import { useParams } from "react-router-dom";
import ModalSmall from "../../../Components/App/ModalSmall";




export default function ButtonsBody() {
    const [buttons, setButtons] = useState({})

    const [click, setClick] = useState(true)

    const params = useParams()

    function searchButtons() {
        let formData = new FormData()

        formData.append("token", params.id)
        axios.post(API_URL + "/api/get/buttons", formData)
            .then((response) => { return response.data })
            .then((data) => {
                setButtons(data)

                if (data) {
                    let formStat = new FormData()

                    formStat.append("type_stat", "visit");
                    formStat.append("type", "buttons")
                    formStat.append("token", params.id)

                    axios.post(API_URL + "/api/get/capturestatsbuttons", formStat)
                }
            })
    }

    useEffect(() => {
        searchButtons();
    }, [])

    function GoToPage(ev) {
        ev.preventDefault()
        ev.stopPropagation()

        let href = ev.target.href

        if (click) {
            setClick(false)

            let formData = new FormData()
            formData.append("type", 'buttons')
            formData.append("type_stat", "click")
            formData.append("data", href)
            formData.append("token", params.id)

            axios.post(API_URL + "/api/get/capturestatsbuttons", formData)
                .then((response) => { return response.data })
                .then((data) => {
                    setClick(true)
                    window.open(href)
                })
                .catch((err) => {
                    setClick(true)
                })
        }

    }

    return (
        <>

            <div className="editor-surveys btnactive prod-buttons">
                <div className="rows">

                    <div className="center" style={{ background: buttons?.header?.background }}>


                        <div className="background2" style={{ backdropFilter: `blur(${buttons?.header?.blur}px)brightness(${buttons?.header?.brightness})`, background: buttons?.header?.background2 }}>
                        </div>

                        <div className={`${"page buttonsbody " + buttons?.header?.colorBox}`}>

                            <div className="share-now">
                                <button>
                                    <IoEllipsisHorizontalSharp />

                                </button>
                            </div>
                            <div className="center-top">
                                <img className="logo" type="logo" src={buttons?.header?.logo ? buttons?.header?.logo : "/img/icons/default-img.jpg"} alt="" />
                                <p type="title">{buttons?.header?.title ? buttons?.header?.title : ""}</p>
                                <span type="desc">{buttons?.header?.desc ? buttons?.header?.desc : ""}</span>
                            </div>


                            <div className="buttons">
                                {buttons?.buttons?.map((element, key) => (
                                    <div key={key}>

                                        <a onClick={GoToPage} style={{ borderRadius: buttons?.header?.radius + "px" }} key={key} type="buttons" id={key} href={element.url} > {element?.name ? element?.name : 'Elegir nombre...'}</a>
                                    </div>
                                ))}
                            </div >

                            <div className="rs">
                                {buttons?.rs?.map((element, key) => (
                                    <div className="r" key={key}>

                                        <a href="" id={key} type="rs">
                                            {
                                                element.type == "in" ? <IoLogoInstagram /> : ''
                                            }
                                            {
                                                element.type == "tik" ? <IoLogoTiktok /> : ''
                                            }
                                            {
                                                element.type == "disc" ? <IoLogoDiscord /> : ''
                                            }
                                            {
                                                element.type == "spot" ? <BsSpotify /> : ''
                                            }

                                            {
                                                element.type == "tele" ? <BsTelegram /> : ''
                                            }

                                            {
                                                element.type == "ws" ? <IoLogoWhatsapp /> : ''
                                            }

                                            {
                                                element.type == "email" ? <IoMailOpenOutline /> : ''
                                            }

                                            {
                                                element.type == "fb" ? <IoLogoFacebook /> : ''
                                            }

                                            {
                                                element.type == "x" ? <IoLogoTwitter /> : ''
                                            }

                                            {
                                                element.type == "link" ? <IoLogoLinkedin /> : ''
                                            }
                                        </a>

                                    </div>
                                ))}
                            </div>

                            <div className="footer">
                                <br />
                                <hr />
                                <p>Powered by RadarSystems. ​​​​​​​Copyright © 1998 - 2022 Todos los derechos reservados.</p>
                            </div>

                        </div>
                    </div>
                </div>

            </div >
        </>
    )
}