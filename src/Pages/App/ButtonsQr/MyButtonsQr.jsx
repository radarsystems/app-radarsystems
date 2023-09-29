import axios from "axios"
import { useContext } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../../Context/AuthContext"
import { API_URL } from "../../../ExportUrl"
import { useState } from "react"
import { IoColorWandOutline, IoDocumentTextOutline, IoEyeOutline } from "react-icons/io5"
import { Time } from "../../../Functions/Global"

export default function MyButtonsQr() {

    const Navigate = useNavigate()
    const { UserInfo } = useContext(AuthContext)
    const [Buttons, setButtons] = useState([])
    const Navigator = useNavigate()

    function LoadButtonsQr() {
        let formData = new FormData()

        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/buttonsqr", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setButtons(data)
            }).catch((err) => {

            })
    }

    useEffect(() => {
        LoadButtonsQr()
    }, [])

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">BOTONERAS QR</p>
                    <span>Gestiona tus botoneras estandares</span>

                </div>

                <div className="right">
                    <button className="add" onClick={(ev) => { Navigate("/editor/buttonsqr") }}>Crear nueva botoneraQR</button>
                </div>
            </div>


            <div className="row">
                {Buttons.map((element, key) => (
                    <div className="col-md-3" key={key}>
                        <div className="box survey-b">
                            <div className="preview" style={{ background: `url(${API_URL}/api/get/previewbuttons?hash=${element.preview}&w=buttonsqr)` }}>
                                <div className="right-top">
                                    <button onClick={(ev) => { Navigator("/editor/buttonsqr/" + element.id_buttonsqr) }}><IoColorWandOutline /></button>
                                    <button onClick={(ev) => { Navigator(`/stats/survey/${element.id_survey}`) }}><IoDocumentTextOutline /></button>
                                    <button onClick={(ev) => { Navigator(`/buttonsqr/${element.token}`) }}><IoEyeOutline /></button>
                                </div>
                            </div>

                            <div className="top" style={{ padding: "10px" }}>
                                <p>{element?.title}</p>
                                <span>Encuesta agregada el: {Time(element.time_add)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </>
    )
}