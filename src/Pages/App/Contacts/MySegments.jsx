import axios from "axios"
import { useEffect } from "react"
import { IoArrowBackOutline } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../../../ExportUrl"

export default function MySegments() {

    const Navigator = useNavigate()

    function Segments() {
        axios.post(API_URL + "/api/get/list", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {

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
        </>
    )
}