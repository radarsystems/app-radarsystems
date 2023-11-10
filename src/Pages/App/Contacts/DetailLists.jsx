import { useContext, useEffect, useState } from "react"
import { IoArrowBackOutline, IoCheckmarkSharp, IoCloudUploadOutline, IoColorWandOutline, IoDocumentTextOutline, IoSunnyOutline, IoTrashOutline } from "react-icons/io5"
import { FaCheck } from "react-icons/fa"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { AuthContext } from "../../../Context/AuthContext"
import ListStatus from "../../../Components/App/Contacts/ListsStatus"

export default function DetailLists() {

    const { UserInfo } = useContext(AuthContext)
    const params = useParams()

    const [list, setList] = useState({})
    const Navigator = useNavigate()
    const [editMode, setEditMode] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let formData = new FormData()
        formData.append("id_list", params.id)
        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/list", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
            setList(data)
        })
    }, [])


    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Detalles de lista</p>
                    <span>Ve los detalle de tus listas y ve si estan listas para ser utilizadas.</span>

                </div>

                <div className="right">
                    <button className="go-wizard" onClick={(ev) => { Navigator("/contacts/lists") }}><IoArrowBackOutline /></button>
                </div>
            </div>

            <div className="menu-top-right">
                <button className="programming" onClick={(ev) => { "" }}>Logs</button>
            </div>

            <div className="box steps">
                <div className="item flex">
                    <div className="info">
                        <div className="icon">
                            <img src="/img/icons/default_profile.png" alt="" />
                        </div>

                        <div className="text">
                            <p className="title">{list.name}</p>
                            <span className="desc">Creado el: 29 de may de 2023</span>
                        </div>
                    </div>

                    <div>
                        <p>Contactos</p>
                        <span>{list.contacts}</span>
                    </div>
                    <div>
                        <p>Estatus</p>

                        <ListStatus Status={list.status} />

                    </div>

                    <div className="actions">
                        <button><IoDocumentTextOutline /></button>
                        <button onClick={(ev) => { Navigator("/contacts/upload/" + params.id) }}><IoCloudUploadOutline /></button>
                        <button><IoTrashOutline /></button>
                    </div>

                </div>


                <div className="item">

                    <div className="top">
                        <div className="check active">
                            <FaCheck />
                        </div>

                        <div className="information">
                            <p className="title">Crear Lista</p>
                            <span className="desc approve"><span className="ready-list">Completado !</span></span>
                        </div>

                    </div>

                </div>

                <div className="item">

                    <div className="top">
                        <div className="check active">
                            <FaCheck />
                        </div>

                        <div className="information">
                            <p className="title">Elegir Tipo</p>
                            <span className="desc approve"><span className="ready-list">Completado !</span></span>
                        </div>
                    </div>

                </div>

                <div className="item">

                    <div className="top">
                        <div className={`check ${list.contacts > 0 ? 'active' : ''}`}>
                            <FaCheck />
                        </div>

                        <div className="information">
                            <p className="title">Subir Contactos</p>
                            <span className="desc">{list.contacts == 0 ? <span className="wait-list">Pendiente</span> : <span className="ready-list">Completado !</span>}</span>
                        </div>

                        <div className="right">
                            <button onClick={(ev) => { Navigator("/contacts/upload/" + params.id) }}>Subir</button>
                        </div>
                    </div>

                </div>



            </div>
        </>
    )
}