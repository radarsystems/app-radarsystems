import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../../Context/AuthContext"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { IoColorWandOutline, IoDocumentTextOutline, IoEyeOutline } from "react-icons/io5"
import { Time } from "../../../Functions/Global"

export default function MyButtons() {

    const Navigator = useNavigate()
    const { UserInfo } = useContext(AuthContext)
    const [buttons, setButton] = useState([])


    function getButtons() {
        let formData = new FormData()

        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/buttons", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setButton(data)
            })
    }

    useEffect(() => {
        getButtons()
    }, [])

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">BOTONERAS URL</p>
                    <span>Gestiona tus botoneras estandares</span>

                </div>

                <div className="right">
                    <button className="add" onClick={(ev) => { Navigate("/editor/buttons") }}>Crear nueva botonera</button>
                </div>
            </div>

            <div className="row">
                {buttons.map((element, key) => (
                    <div className="col-md-3" key={key}>
                        <div className="box survey-b">
                            <div className="preview" style={{ background: `url(${API_URL}/api/get/previewbuttons?hash=${element.preview}&w=buttons)` }}>
                                <div className="right-top">
                                    <button onClick={(ev) => { Navigator("/editor/buttons/" + element.id_buttons) }}><IoColorWandOutline /></button>
                                    <button onClick={(ev) => { Navigator(`/stats/buttons/${element.token}`) }}><IoDocumentTextOutline /></button>
                                    <button onClick={(ev) => { Navigator(`/buttons/${element.token}`) }}><IoEyeOutline /></button>
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