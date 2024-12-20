import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { API_URL } from "../../../ExportUrl"
import { Carousel } from "react-responsive-carousel"
import "../../../Styles/css/app.css"
import "../../../Styles/css/Home.css"
import ModalSmall from "../../../Components/App/ModalSmall"
import { GetParams, getDevice } from "../../../Functions/Global"
import ModalShare from "../../../Components/App/ModalShare"
import toast from "react-hot-toast"
import { Icon } from "@iconify/react"

export default function ButtonsQr() {
    let params = useParams()
    const [install, setInstall] = useState(false)
    const [buttons, setButtons] = useState({ elements: [] })
    const [visible, setVisible] = useState(false)
    const [linkShare, setLinkShare] = useState(null)
    const Navigator = useNavigate()

    function searchButtons() {

        let formData = new FormData()

        formData.append("token", params.id)
        axios.post(API_URL + "/api/get/buttonsqr", formData)
            .then((response) => { return response.data })
            .then((data) => {
                setButtons(data)
            })
    }

    useEffect(() => {
        searchButtons()

        if (GetParams('install') == "true") {
            setInstall(true)
        }

    }, [])

    function shareQr(image) {

        let formData = new FormData()
        let url = new URL(image)
        image = url.searchParams.get("url")
        formData.append("img", image)
        axios.post(API_URL + "/api/get/dataqr", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then(async (data) => {
                if (data.length) {
                    let element = data[0]
                    if (element.data_qr) {

                        if (getDevice() == "Desktop") {
                            setLinkShare(element.data_qr)
                            setVisible(true)
                        } else {
                            await navigator.share({
                                title: "Compartir",
                                text: "test",
                                url: element.data_qr
                            })

                        }



                    } else {
                        toast.error("Opps este QR no tiene datos para compartir.")
                    }
                } else {
                    toast.error("Opps error al localizar el qr")
                }
            })
    }

    useEffect(() => {
        if (!visible) {
            setLinkShare(null)
        }
    }, [visible])

    return (
        <>

            <ModalShare Visible={visible} CallbackVisible={setVisible} value={linkShare} />
            {install ?
                <ModalSmall visible={true} maxWidth={250} next={`Listo`} onClick={(ev) => { setInstall(false); Navigator("/buttonsqr/" + params.id) }}>
                    <div className="top">
                        <p>Instalar</p>
                        <span>instalar acceso directo rapidamente en iphone.</span>
                        <br />
                        <br />


                    </div>

                    <div className="img-tuto-buttonsqr">
                        <Carousel showThumbs={false}>
                            <div>
                                <img src="/img/icons/tuto/buttonsqr/iphone1.png" alt="" />
                                <span>Preciona el boton de compartir en la parte de abajo</span>
                            </div>
                            <div>
                                <img src="/img/icons/tuto/buttonsqr/iphone2.png" alt="" />
                                <span>Luego ve al final con el scroll</span>
                            </div>
                            <div>
                                <img src="/img/icons/tuto/buttonsqr/iphone3.png" alt="" />
                                <span>Agrega a inicio</span>
                            </div>
                            <div>
                                <img src="/img/icons/tuto/buttonsqr/iphone4.png" alt="" />
                                <span>Ahora configura y guarda</span>
                            </div>

                            <div>
                                <img src="/img/icons/tuto/buttonsqr/iphone5.png" alt="" />
                                <span>Listo ya tienes tu acceso directo.</span>
                            </div>
                        </Carousel>
                    </div>
                </ModalSmall>
                : ""}

            <div className="editor-surveys prodbuttonsqr">

                <div className="center" style={{ background: buttons?.header?.background }}>
                    <div className="background2" style={{ backdropFilter: `blur(${buttons?.header?.blur}px)brightness(${buttons?.header?.brightness})`, background: buttons?.header?.background2 }}>
                    </div>

                    <div className="header" style={{ background: buttons?.header?.backgroundHeader }}></div>


                    <div className={`${"page buttonsbody buttonsqr " + buttons?.header?.theme}`}>
                        <div className="center-top">

                            <img className="logo" type="logo" src={buttons?.header?.logo ? buttons?.header?.logo : "/img/icons/default-img.jpg"} alt="" />
                            <p type="title">{buttons?.header?.title ? buttons?.header?.title : ""}</p>
                            <span type="desc">{buttons?.header?.desc ? buttons?.header?.desc : ""}</span>

                            <br />
                            <br />

                            <div className="share">
                                <button onClick={(ev) => { Navigator("/") }}>Home</button>
                                <button onClick={(ev) => { setVisible(true) }}>Recomendar</button>
                                <button className="update" onClick={(ev) => { window.location.href = window.location.href }}>Actualizar</button>
                            </div>


                            {buttons.elements.map((element, key) => (
                                <>

                                    {element?.qrs?.length ?
                                        <div className="boxqr">

                                            <div className="top">
                                                <div className="top-left">
                                                    <p id={key} type="titlespace">{element.title ? element.title : ''}</p>
                                                </div>


                                            </div>


                                            <Carousel showThumbs={false} showIndicators={false} showStatus={false}>
                                                {element.qrs.map((element, key2) => (

                                                    <>
                                                        <div className="qr">
                                                            <p style={{ textTransform: "uppercase", fontSize: "13px" }}>{element.title}</p>
                                                            <img src={element.image} />
                                                        </div>

                                                        <div className="buttons-qrs">
                                                            <button onClick={(ev) => { shareQr(element.image) }}>Compartir</button>
                                                            <button className="info" onClick={(ev) => { alert("Si dejas presionada el QR podras habilitar funciones especiales de tu sistema operativo") }}><Icon icon="carbon:information-filled" /></button>
                                                        </div>
                                                    </>


                                                ))}
                                            </Carousel>
                                        </div>
                                        : ""}
                                </>

                            ))}



                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}