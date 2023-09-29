import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { API_URL } from "../../../ExportUrl"
import { Carousel } from "react-responsive-carousel"
import "../../../Styles/css/Home.css"

export default function ButtonsQr() {
    let params = useParams()
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
    }, [])

    return (
        <>

            <div className="editor-surveys prodbuttonsqr">

                <div className="center" style={{ background: buttons?.header?.background }}>
                    <div className="background2" style={{ backdropFilter: `blur(${buttons?.header?.blur}px)brightness(${buttons?.header?.brightness})`, background: buttons?.header?.background2 }}>
                    </div>

                    <div className={`${"page buttonsbody buttonsqr " + buttons?.header?.colorBox}`}>
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