import axios from "axios"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { API_SHORT, API_URL } from "../../../ExportUrl"
import { useContext } from "react"
import { AuthContext } from "../../../Context/AuthContext"
import { useEffect } from "react"
import { IoColorWandOutline, IoStatsChartOutline, IoTrashOutline } from "react-icons/io5"
import ModalSmall from "../../../Components/App/ModalSmall"
import LoadingCircleApp from "../../../Components/App/LoadingCircle"
import NotFoundItems from "../../../Components/App/NotFoundItems"
import { existsStringInPath } from "../../../Functions/Global"
import toast from "react-hot-toast"
import ModalDelete from "../../../Components/App/ModalDelete"

export default function MyShortUrls() {

    const Navigator = useNavigate()

    const [urls, setUrls] = useState([])
    const [loading, setLoading] = useState(true)
    const { UserInfo } = useContext(AuthContext)
    const [pending, setPending] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [form, setForm] = useState({ url: "" })

    const [viewModalD, setViewModalD] = useState(false);
    const [idDelete, setIdDelete] = useState(false)



    const location = useLocation()

    useEffect(() => {
        if (existsStringInPath("/add")) {
            setViewModal(true)
        }
    }, [location])


    function LoadUrls(scroll = false) {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)

        setLoading(true)

        if (!scroll) {
            setUrls([])
        }

        axios.post(API_URL + "/api/get/myurls", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setLoading(false)
                setUrls(data)
            })
    }

    function NewShort() {
        let formData = new FormData()
        formData.append("url", form.url)
        formData.append("name", form.name)
        formData.append("id_company", UserInfo?.company?.id_company)
        if (form.url) {
            setPending(true)
            axios.post(API_URL + "/api/upload/shortlink", formData, { withCredentials: true })
                .then((response) => { return response.data })
                .then((data) => {
                    setPending(false)
                    if (data.status) {
                        LoadUrls()
                        setViewModal(false)
                    }
                }).catch((err) => {
                    setPending(false)
                })
        } else {
            toast.error("Opps no has ingresado el enlace correctamente")
        }
    }

    function updateForm(ev) {
        let name = ev.target.name
        let value = ev.target.value

        setForm({ ...form, [name]: value })
    }

    useEffect(() => {
        LoadUrls()
    }, [])

    return (<>


        <ModalDelete visible={viewModalD} callback={setViewModalD} name={"enlace"} />

        <ModalSmall visible={viewModal} onClick={NewShort} callback={setViewModal} Pending={pending} next={'Crear'}>
            <div className="top">
                <p>Nuevo enlace</p>
                <span>Crea tu nuevo enlace rapidamente con esta herramienta</span>
            </div>
            <br />
            <div className="form-input">
                <input type="name" placeholder="Nombre de Enlace" name="name" onChange={updateForm} />
            </div>

            <div className="form-input">
                <input type="url" placeholder="Enlace" name="url" onChange={updateForm} />
            </div>
        </ModalSmall>

        <div className="page-info">
            <div className="">
                <p className="title">Tus urls </p>
                <span>Estas son tus urls cortas que has creado donde podras llevar las estadisticas de cada una.</span>
            </div>
            <div className="right">
                <button className="add" onClick={(ev) => { setViewModal(true) }}>Crear nueva URL</button>
            </div>
        </div>

        <div className="row">
            <div className="col-md-12">
                <div className="box box-padding">
                    {urls.map((element, key) => (
                        <div className="item flex" key={key}>
                            <div className="info">
                                <div className="icon">
                                    <img src="img/icons/campaign_profile.png" alt="" />
                                </div>

                                <div className="text">
                                    <p className="title">URL CORTA</p>

                                    {element.name && <><span className="desc">NOMBRE: {element.name}</span> <br /></>}
                                    <span className="desc">ENLACE CORTO: <Link target="_blank" to={`${API_SHORT}/${element.token}`}>{element.token}</Link></span>
                                </div>
                            </div>


                            <div>
                                <p>URL</p>
                                <span>{element.real_link}</span>
                            </div>

                            <div className="actions">
                                <button onClick={(ev) => { setViewModalD(true); setIdDelete(element.id_shortlink) }}><IoTrashOutline /></button>
                                <button onClick={(ev) => { Navigator("/shorturls/" + element.id_shortlink) }}><IoStatsChartOutline /> </button>
                            </div>
                        </div>
                    ))}
                    {loading == true ? <LoadingCircleApp /> : loading == false ? urls.length == 0 ? <NotFoundItems name={"urls"} /> : '' : ''}
                </div>
            </div>
        </div>


    </>)
}