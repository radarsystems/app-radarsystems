import axios from "axios"
import { useContext } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../../Context/AuthContext"
import { API_URL } from "../../../ExportUrl"
import { useState } from "react"
import { IoColorWandOutline, IoDocumentTextOutline, IoEyeOutline } from "react-icons/io5"
import { Time } from "../../../Functions/Global"
import { Icon } from "@iconify/react"
import ModalDelete from "../../../Components/App/ModalDelete"
import toast from "react-hot-toast"
import LoadingCircleApp from "../../../Components/App/LoadingCircle"
import NotFoundItems from "../../../Components/App/NotFoundItems"

export default function MyButtonsQr() {

    const Navigate = useNavigate()
    const { UserInfo } = useContext(AuthContext)
    const [Buttons, setButtons] = useState([])
    const [idDelete, setIdDelete] = useState(null)
    const [pendingDelete, setPendingDelete] = useState(false)
    const [modalDelete, setModalDelete] = useState(false)
    const Navigator = useNavigate()
    const [loading, setLoading] = useState(false)

    function LoadButtonsQr() {
        let formData = new FormData()

        setLoading(true)

        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/buttonsqr", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setButtons(data)
                setLoading(false)
            }).catch((err) => {
                setLoading(false)
            })
    }

    function deleteNow() {
        if (idDelete) {
            setPendingDelete(true)

            let formData = new FormData()

            formData.append("id_company", UserInfo?.company?.id_company)
            formData.append("id_buttonqr", idDelete)

            axios.post(API_URL + "/api/delete/buttonsqr", formData, { withCredentials: true })
                .then((response) => { return response.data })
                .then((data) => {
                    if (data.status) {
                        setModalDelete(false)
                        toast.success("Se ha borrado con exito!")
                        LoadButtonsQr()
                    }

                    setPendingDelete(false)
                })
                .catch((err) => {
                    setPendingDelete(false)
                })
        }
    }

    useEffect(() => {
        LoadButtonsQr()
    }, [])

    return (
        <>


            <ModalDelete visible={modalDelete} onClick={deleteNow} Pending={pendingDelete} callback={setModalDelete}>

            </ModalDelete>

            <div className="page-info">
                <div className="">
                    <p className="title">MIS BOTONERAS QR</p>
                    <span>Previsualiza, edita, elimina y visualiza las estadisticas de tus QR's.</span>
                </div>

                <div className="right">
                    <button className="add" onClick={(ev) => { Navigate("/editor/buttonsqr") }}>Crear nueva botoneraQR</button>
                </div>
            </div>

            <div className="loading-box">
                {loading ? <LoadingCircleApp /> : Buttons.length == 0 ? <NotFoundItems addNew={true} name={"botoneras"} callback={(ev) => { Navigator("/editor/buttonsqr") }} /> : ""}
            </div>

            <div className="row">

                {Buttons.map((element, key) => (
                    <div className="col-md-3" key={key}>
                        <div className="box survey-b">
                            <div className="preview" >
                                <div className="right-top">
                                    <button title="editar" onClick={(ev) => { Navigator("/editor/buttonsqr/" + element.id_buttonsqr) }}><Icon icon="carbon:edit" /></button>
                                    <button title="previsualizar" onClick={(ev) => { Navigator(`/buttonsqr/${element.token}`) }}><Icon icon="mingcute:eye-line" /></button>
                                    <button title="eliminar" onClick={(ev) => { setModalDelete(true); setIdDelete(element.id_buttonsqr) }}><Icon icon="ph:trash" /></button>
                                </div>
                            </div>

                            <div className="top" style={{ padding: "10px" }}>
                                <p>{element?.title}</p>
                                <span>Botonera agregada el: {Time(element.time_add)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </>
    )
}