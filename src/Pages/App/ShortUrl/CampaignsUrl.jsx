import { useContext, useEffect } from "react"
import { useState } from "react"
import NotFoundItems from "../../../Components/App/NotFoundItems"
import LoadingCircleApp from "../../../Components/App/LoadingCircle"
import ModalSmall from "../../../Components/App/ModalSmall"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { AuthContext } from "../../../Context/AuthContext"
import { IoDocumentTextOutline, IoTrashOutline } from "react-icons/io5"
import { useLocation, useNavigate } from "react-router-dom"
import { existsStringInPath } from "../../../Functions/Global"
import ModalDelete from "../../../Components/App/ModalDelete"
import toast from "react-hot-toast"
import { Icon } from "@iconify/react/dist/iconify.js"

export default function CampaignsUrl() {

    const [loading, setLoading] = useState()
    const Navigator = useNavigate()
    const [viewModal, setModalView] = useState(false)
    const [campaings, setCampaigns] = useState([])
    const [pending, setPending] = useState(false)
    const [form, setForm] = useState({ name: "" })
    const { UserInfo } = useContext(AuthContext)
    const [modalDelete, setModalDelete] = useState(false)
    const [deleteId, setDeleteId] = useState(null)

    const location = useLocation()

    useEffect(() => {
        if (existsStringInPath("/add")) {
            setModalView(true)
        }
    }, [location])


    function LoadCampaigns() {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company);
        setLoading(true)
        axios.post(API_URL + "/api/get/shortlinkcampaigns", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setLoading(false)
                setCampaigns(data)
            }).catch((err) => {
                setLoading(false)
            })
    }

    function AddNewCampaign() {
        const formData = new FormData()
        setPending(true)
        formData.append("name", form.name)
        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/upload/shortlinkcampaign", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setPending(false)
                if (data.status) {
                    LoadCampaigns()
                    setModalView(false)
                }
            }).catch((err) => {
                setPending(false)
            })
    }

    function deleteCampaign() {
        setPending(true)

        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        formData.append("id_campaign", deleteId)

        axios.post(API_URL + "/api/delete/shortlinks/campaign", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                if (data.status) {
                    toast.success("Has eliminado correctamente esta campana");
                    LoadCampaigns()
                    setModalDelete(false)
                }
            })
    }

    useEffect(() => {
        LoadCampaigns()
    }, [])

    return (
        <>

            <ModalDelete onClick={deleteCampaign} Pending={pending} visible={modalDelete} callback={setModalDelete} />

            <ModalSmall key={viewModal} visible={viewModal} onClick={AddNewCampaign} callback={setModalView} maxWidth={"250px"} Pending={pending} next={"Agregar"}>
                <div className="top">
                    <p>Nueva campaña</p>
                    <span>Crea tu nueva campaña rapidamente para analizar tus multiples enlaces</span>
                </div>

                <br />
                <div className="form-input">
                    <input type="text" placeholder="Nombre de campaña" name="name" onChange={(ev) => { setForm({ ...form, name: ev.target.value }) }} />
                </div >
            </ModalSmall>
            <div className="page-info">
                <div className="">
                    <p className="title">Campañas</p>
                    <span>Aca puedes visualizar o crear campañas para enlaces multiples sobre una campaña</span>
                </div>

                <div className="right">
                    <button className="go-wizard" onClick={(ev) => { setModalView(true) }}><Icon icon="gg:add" /> Crear nueva campaña</button>
                </div>
            </div>

            <div className="body-stats">

                <div className="row">
                    <div className="col-md-12">
                        <div className="box box-padding">
                            {campaings.map((element, key) => (
                                <div className="item flex">
                                    <div className="info">
                                        <div className="icon">
                                            <img src="/img/icons/campaign_profile.png" alt="" />
                                        </div>

                                        <div className="text">
                                            <p className="title">{element.name}</p>
                                            <span className="desc">Creado el: 29 de may de 2023</span>
                                        </div>
                                    </div>

                                    <div className="actions">
                                        <button onClick={(ev) => { setDeleteId(element.id_campaign); setModalDelete(true) }}><IoTrashOutline /></button>
                                        <button onClick={(ev) => { Navigator("/shorturls/campaigns/" + element.id_campaign) }}><IoDocumentTextOutline /></button>
                                    </div>
                                </div>
                            ))}
                            {loading ? <LoadingCircleApp /> : campaings.length == 0 ? <NotFoundItems name={"campañas"} /> : ''}

                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}