import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../../Context/AuthContext"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { IoColorWandOutline, IoDocumentTextOutline, IoEyeOutline } from "react-icons/io5"
import { Time } from "../../../Functions/Global"
import { Icon } from "@iconify/react"
import ModalDelete from "../../../Components/App/ModalDelete"

export default function MyButtons() {

    const Navigator = useNavigate()
    const { UserInfo } = useContext(AuthContext)
    const [buttons, setButton] = useState([])
    const [deleteB, setDelete] = useState({ id_delete: null, pending: false })
    const [deleteVisible, setDeleteVisible] = useState(false)


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

            <ModalDelete visible={deleteVisible} callback={setDeleteVisible} Pending={deleteB.pending}>

            </ModalDelete>

            <div className="page-info">
                <div className="">
                    <p className="title">MIS BOTONERAS URL</p>
                    <span>Previsualiza, edita, elimina y visualiza las estadisticas de tus botoneras de URL.</span>
                </div>

                <div className="right">
                    <button className="add" onClick={(ev) => { Navigator("/editor/buttons") }}>Crear nueva botonera</button>
                </div>
            </div>

            <div className="row">
                {buttons.map((element, key) => (
                    <div className="col-md-3" key={key}>
                        <div className="box survey-b">
                            <div className="preview" style={{ background: `url(${API_URL}/api/get/previewbuttons?hash=${element.preview}&w=buttons)` }}>
                                <div className="right-top">
                                    <button title="Editar" onClick={(ev) => { Navigator("/editor/buttons/" + element.id_buttons) }}><Icon icon="carbon:edit" /></button>
                                    <button title="Previsualizar" onClick={(ev) => { Navigator(`/stats/buttons/${element.token}`) }}><Icon icon="mingcute:eye-line" /></button>
                                    <button title="Estadisticas" onClick={(ev) => { Navigator(`/buttons/${element.token}`) }}><Icon icon="ps:stats" /></button>
                                    <button title="Eliminar" onClick={(ev) => { setDeleteVisible(true) }}><Icon icon="ph:trash" /></button>
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