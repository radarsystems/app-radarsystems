import { IoArrowBackOutline, IoEyeOutline } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import LoadingCircleApp from "../../../Components/App/LoadingCircle"
import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { useContext } from "react"
import { AuthContext } from "../../../Context/AuthContext"
import { PreviewTemplate, Time } from "../../../Functions/Global"

export default function Templates() {

    const Navigator = useNavigate()
    const [loading, setLoading] = useState(false)
    const [templates, setTemplates] = useState([])
    const { UserInfo } = useContext(AuthContext)

    function getTemplates() {

        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/templatesall", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setTemplates(data)
            })
    }


    useEffect(() => {
        getTemplates()
    }, [])

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">BOLETINES ELECTRONICOS</p>
                    <span>Estadisticas de campaña visualiza las estadisticas generalmente de cada una y comparalas</span>
                </div>

                <div className="right">
                    <button className="add" onClick={(ev) => { Navigator("/editor/canvas") }}>Crear Nuevo Boletin</button>

                </div>
            </div>

            <div className="row">

                {loading == false ?
                    templates.map((element, key) =>
                        <div className="col-md-3" key={key}>
                            <div className="box survey-b">
                                <div className="preview" style={{ background: `url(${PreviewTemplate(UserInfo?.company?.folder_sftp, element.preview_image)})` }}>
                                    <div className="right-top">
                                        <button onClick={(ev) => { Navigator(`/landing/${element.token}`) }}><IoEyeOutline /></button>
                                    </div>
                                </div>

                                <div className="top" style={{ padding: "10px" }}>
                                    <p>{element?.title}</p>
                                    <span>Boletin agregado el: {Time(element.time_add)}</span>
                                </div>
                            </div>
                        </div>
                    )
                    : <div className="col-md-12">
                        <div className="box box-padding">
                            <LoadingCircleApp />
                        </div>
                    </div>
                }

            </div>
        </>
    )
}