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
import { Icon } from "@iconify/react/dist/iconify.js"
import ModalDelete from "../../../Components/App/ModalDelete"
import toast from "react-hot-toast"
import ModalSmall from "../../../Components/App/ModalSmall"

export default function Templates() {

    const Navigator = useNavigate()
    const [loading, setLoading] = useState(false)
    const [templates, setTemplates] = useState([])
    const { UserInfo } = useContext(AuthContext)
    const [deleteId, setDeleteId] = useState(null)
    const [modalDelete, setModalDelete] = useState(false)
    const [pendingDelete, setPendingDelete] = useState(false)
    const [uploadFile, setUploadFile] = useState({})
    const [modalUpload, setModalUpload] = useState(false)

    function getTemplates() {

        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/templatesall", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setTemplates(data)
            })
    }

    function deleteNow() {
        let formData = new FormData()

        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_template", deleteId)

        setPendingDelete(true)

        axios.post(API_URL + "/api/delete/template", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                if (data.status) {
                    toast.success("Has eliminado correctamente")
                    setModalDelete(false)
                    setDeleteId(null)
                    getTemplates()
                }
            })
            .catch((err) => {
                toast.error("Opps ha ocurrido un error")
            })
            .finally(() => {
                setPendingDelete(false)
            })
    }

    function uploadHtml() {
        let formData = new FormData()

        setPendingDelete(true)
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("file", uploadFile)
        formData.append("title", uploadFile?.name)
        formData.append("type", "email")

        axios.post(API_URL + "/api/upload/bodycampaign", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                if (data.status) {
                    toast.success("Has subido correctamente tu archivo html")
                    getTemplates()
                    setModalUpload(false)
                }
            })
            .finally(() => {
                setPendingDelete(false)
            })
    }

    function onChangeFile(ev) {
        let file = ev.target.files[0]
        setUploadFile(file)
    }


    useEffect(() => {
        getTemplates()
    }, [])

    return (
        <>

            <ModalSmall visible={modalUpload} Pending={pendingDelete} onClick={uploadHtml} close={setModalUpload}>
                <div className="top">
                    <p>Archivo</p>
                    <span>Selecciona tu archivo html</span>
                </div>


                <br />

                <div className="form-input">
                    <input onChange={onChangeFile} type="file" accept=".html" />
                </div>

                <br />
            </ModalSmall>

            <ModalDelete visible={modalDelete} Pending={pendingDelete} onClick={deleteNow} />


            <div className="page-info">
                <div className="">
                    <p className="title">BOLETINES ELECTRONICOS</p>
                    <span>Estadisticas de campaña visualiza las estadisticas generalmente de cada una y comparalas</span>
                </div>

                <div className="right">
                    <button className="go-wizard" onClick={(ev) => { Navigator("/editor/canvas") }}><Icon icon="gg:add" /> Crear Nuevo Boletin</button>
                    <button className="adxd" onClick={(ev) => { setModalUpload(true) }}><Icon icon="mynaui:upload" /> Subir Boletin</button>
                </div>
            </div>

            <div className="row">

                {loading == false ?
                    templates.map((element, key) =>
                        <div className="col-md-3" key={key}>
                            <div className="box survey-b">
                                <div className="preview" style={{ background: `url(${PreviewTemplate(UserInfo?.company?.folder_sftp, element.preview_image)})` }}>
                                    <div className="right-top">
                                        <button onClick={(ev) => { Navigator(`/template/${element.token}`) }}><IoEyeOutline /></button>
                                        {element.json && <>
                                            <button><Icon icon="tabler:edit" /></button>
                                        </>}

                                        <button onClick={(ev) => { setModalDelete(true); setDeleteId(element.id_template) }}><Icon icon="iconamoon:trash" /></button>
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