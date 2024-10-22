import { useContext, useEffect, useState } from "react"
import { IoArrowBackOutline, IoCheckmarkSharp, IoCloudUploadOutline, IoColorWandOutline, IoDocumentTextOutline, IoSunnyOutline, IoTrashOutline } from "react-icons/io5"
import { FaCheck } from "react-icons/fa"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { AuthContext } from "../../../Context/AuthContext"
import ListStatus from "../../../Components/App/Contacts/ListsStatus"
import { CampaignType, HistoryBack, Time } from "../../../Functions/Global"
import FooterConvertion from "../Global/FooterConvertion/FooterConvertion"
import { Icon } from "@iconify/react/dist/iconify.js"
import ModalDelete from "../../../Components/App/ModalDelete"
import toast from "react-hot-toast"

export default function DetailLists() {

    const { UserInfo } = useContext(AuthContext)
    const params = useParams()
    const [viewModalD, setViewModalD] = useState(false)
    const [pendingD, setPendingD] = useState(false)
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

    function deleteList() {
        let formData = new FormData()

        setPendingD(true)
        formData.append("id_list", params.id)
        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/delete/list", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                if (data.status) {
                    Navigator("/contacts/lists")
                    toast.success("Lista eliminada")
                }
            })
            .finally(() => {
                setPendingD(false)
            })
    }


    return (
        <>

            <ModalDelete Pending={pendingD} onClick={deleteList} visible={viewModalD} name={"lista"} callback={setViewModalD} />
            <div className="page-info">
                <div className="">
                    <p className="title">Detalles de lista</p>
                    <span>Ve los detalle de tus listas y ve si estan listas para ser utilizadas.</span>

                </div>

                <div className="right">
                    <button className="go-wizard" onClick={HistoryBack}><IoArrowBackOutline /></button>
                </div>
            </div>


            <div className="menu-top-right">
                <button className="prograxmming" onClick={(ev) => { Navigator("/contacts/lists/contacts/" + params.id) }}><Icon icon="material-symbols:contacts-sharp" /> Contactos</button>
                <button className="prograxmming" onClick={(ev) => { Navigator("/contacts/lists/logs/" + params.id) }}><Icon icon="f7:doc-fill" /> Detalles</button>
            </div>

            <div className="box steps">
                <div className="item flex">
                    <div className="info">
                        <div style={{ fontSize: "50px" }} className="icon-i">
                            <Icon icon="ep:document" />
                        </div>

                        <div className="text">
                            <b>  <p>LISTA:</p></b>
                            <p className="title" style={{ textTransform: "uppercase" }}>{list.name}</p>
                            <span className="desc">Creado el: {Time(list.time_add)}</span>
                        </div>
                    </div>

                    <div className="center">
                        <b><p>CONTACTOS</p> </b>
                        <span>{list.contacts}</span>
                    </div>


                    <div className="center">
                        <b>  <p>TIPO</p></b>
                        <span>{CampaignType(list.type)}</span>
                    </div>

                    <div className="center">
                        <b>  <p>ESTATUS</p></b>

                        <ListStatus Status={list.status} />

                    </div>

                    <div className="actions">
                        <button className="blue" onClick={(ev) => { Navigator("/contacts/upload/" + params.id) }}><IoCloudUploadOutline /></button>
                        <button className="red" onClick={(ev) => { setViewModalD(true) }}><IoTrashOutline /></button>
                    </div>

                </div>


                <div className="item">

                    <div className="top">
                        <div className="check active">
                            <FaCheck />
                        </div>

                        <div className="information">
                            <p className="title">Crear Lista</p>
                            <span className="desc approve"><span className="left-ready-list"><Icon icon="hugeicons:task-done-01" /> Completado</span></span>
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
                            <span className="desc approve"><span className="left-ready-list"><Icon icon="hugeicons:task-done-01" /> Completado</span></span>
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
                            <span className="desc">{list.contacts == 0 ? <span className="left-wait-list"><Icon icon="hugeicons:task-remove-01" /> Pendiente</span> : <span className="left-ready-list"><Icon icon="hugeicons:task-done-01" /> Completado</span>}</span>
                        </div>

                        <div className="right">
                            <button onClick={(ev) => { Navigator("/contacts/upload/" + params.id) }}>Subir</button>
                        </div>
                    </div>

                </div>



            </div>

            <FooterConvertion type="lists" id_company={UserInfo?.company?.id_company} id_list={params.id} />

        </>
    )
}