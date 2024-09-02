import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { IoArrowBackOutline } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../../../ExportUrl"
import { AuthContext } from "../../../Context/AuthContext"
import RequireLists from "../../../Components/App/Lists/RequireLists"

export default function MySegments() {

    const { UserInfo } = useContext(AuthContext)
    const [segs, setSegs] = useState([])

    const Navigator = useNavigate()

    function Segments() {
        let formData = new FormData()

        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("is_segment", 1);

        axios.post(API_URL + "/api/get/list", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setSegs(data)
            })
    }

    useEffect(() => {
        Segments()
    }, [])

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Mis Segmentos</p>
                    <span>Esta es tu lista de contactos, puedes revisarlo y exportarlos</span>
                </div>

                <div className="right">
                    <button className="add" onClick={(ev) => { Navigator("/contacts/segments/add") }}>Crear nuevo segmento</button>
                </div>
            </div>

            <RequireLists lists={segs} />
        </>
    )
}