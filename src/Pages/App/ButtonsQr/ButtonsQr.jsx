import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { API_URL } from "../../../ExportUrl"
import { Carousel } from "react-responsive-carousel"
import "../../../Styles/css/app.css"
import "../../../Styles/css/Home.css"
import ModalSmall from "../../../Components/App/ModalSmall"
import { GetParams } from "../../../Functions/Global"

export default function ButtonsQr() {
    let params = useParams()
    const [install, setInstall] = useState(false)
    const [buttons, setButtons] = useState({ elements: [] })

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

            const linkElement = document.createElement('link');
            linkElement.rel = 'manifest';
            linkElement.href = '/manifest.json';

            //document.head.appendChild(linkElement);
        }

    }, [])

    return (
        <>


            {install ?
                <ModalSmall visible={true} maxWidth={250} next={`Listo`}>
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
                        </Carousel>
                    </div>
                </ModalSmall>
                : ""}

            <div className="editor-surveys prodbuttonsqr">

                <div className="center" style={{ background: buttons?.header?.background }}>
                    <div className="background2" style={{ backdropFilter: `blur(${buttons?.header?.blur}px)brightness(${buttons?.header?.brightness})`, background: buttons?.header?.background2 }}>
                    </div>

                    <div className={`${"page buttonsbody buttonsqr " + buttons?.header?.theme}`}>
                        <div className="center-top">

                            <img className="logo" type="logo" src={buttons?.header?.logo ? buttons?.header?.logo : "/img/icons/default-img.jpg"} alt="" />
                            <p type="title">{buttons?.header?.title ? buttons?.header?.title : ""}</p>
                            <span type="desc">{buttons?.header?.desc ? buttons?.header?.desc : ""}</span>

                            <br />
                            <br />

                            {buttons.elements.map((element, key) => (
                                <div className="boxqr">

                                    <div className="top">
                                        <div className="top-left">
                                            <p id={key} type="titlespace">{element.title ? element.title : ''}</p>
                                        </div>


                                    </div>


                                    <Carousel showThumbs={false} showIndicators={false} showStatus={false}>
                                        {element.qrs.map((element, key2) => (


                                            <div className="qr">
                                                <img src={element.image} />
                                                <p>{element.title}</p>
                                            </div>


                                        ))}
                                    </Carousel>
                                    {element.qrs.length == 0 ? <div className="add-qr">+</div> : ''}
                                </div>
                            ))}



                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}