import { useContext, useState } from "react"
import NotFoundItems from "../../../Components/App/NotFoundItems"
import ModalSmall from "../../../Components/App/ModalSmall"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { AuthContext } from "../../../Context/AuthContext"
import toast from "react-hot-toast"
import { useEffect } from "react"
import { FaLink } from "react-icons/fa"
import { BsCheckCircleFill } from "react-icons/bs"
import { BiTime } from "react-icons/bi"
import { IoStatsChartOutline, IoTrashOutline } from "react-icons/io5"
import { MdAlternateEmail } from "react-icons/md"
import ModalDelete from "../../../Components/App/ModalDelete"
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"

export default function CompanyDomains() {

    const [domains, setDomains] = useState([])
    const [formDomain, setFormDomain] = useState({ domain: "", domain_email: "" })
    const [loading, setLoading] = useState(false)
    const { UserInfo } = useContext(AuthContext)
    const [viewModal, setViewModal] = useState(false)
    const [viewModalDelete, setViewModalDelete] = useState(false)

    const Navigator = useNavigate()

    function setChange(ev) {
        let name = ev.target.name
        let value = ev.target.value
        setFormDomain({ ...formDomain, [name]: value })
    }


    function UploadDomain() {
        let formData = new FormData()

        setLoading(true)
        formData.append("domain", formDomain.domain)
        formData.append("domain_email", formDomain.domain_email)
        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/upload/domain", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setLoading(false)
                if (data.status) {
                    setViewModal(false)
                }

                if (data.msg) {
                    toast.error(data.msg)
                }

            }).catch((err) => {
                setLoading(false)

            })
    }

    function getMyDomains() {
        let formData = new FormData()

        formData.append("id_company", UserInfo?.company?.id_company)

        axios.post(API_URL + "/api/get/domains", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setDomains(data)
            })
    }

    useEffect(() => {
        getMyDomains()
    }, [])

    return (
        <>

            <ModalSmall visible={viewModal} callback={setViewModal} maxWidth={"300px"} onClick={UploadDomain} Pending={loading}>
                <div className="top">
                    <p>Agregar</p>
                    <span>agrega un nuevo dominio, el dominio quedara en verificacion para poder ser utilizado</span>
                </div>
                <br />

                <div className="form-input">
                    <label>Dominio destinatario</label>
                    <input type="text" name="domain" onChange={setChange} placeholder="dominio.com" />
                </div>

                <div className="form-input">
                    <label>Correo del dominio</label>
                    <input type="text" name="domain_email" onChange={setChange} placeholder="example@dominio.com" />
                </div>
            </ModalSmall>

            <ModalDelete visible={viewModalDelete} callback={setViewModalDelete} onClick={""} Pending={""}>

            </ModalDelete>


            <div className="settings-account">
                <div className="case active">
                    <div className="info">
                        <p>Dominios</p>
                        <span>Estos dominios son los que has configurado para ser manejados en tu campanas de envios email</span>
                        <button onClick={(ev) => { setViewModal(true) }}>Agregar Dominio</button>
                    </div>

                    <div className="action">

                        <div className="row domains">
                            {domains.map((element, key) => (
                                <div className="col-md-4">
                                    <div className="domain">
                                        <p><FaLink />  {element.domain}</p>
                                        <span>{element.domain_email}</span><br />
                                        <span>Estatus: {element.status ? <BsCheckCircleFill /> : <BiTime />}</span>

                                        <div className="buttons">
                                            <button onClick={(ev) => { Navigator(`/settings-account/domain/${element.id_domain}`) }}><Icon icon="icon-park-outline:config" /></button>
                                            <button><IoTrashOutline /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {domains.length == 0 ? <NotFoundItems name={"dominios"} /> : ''}
                    </div>
                </div>
            </div>
        </>
    )
}