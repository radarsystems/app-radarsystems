import { useState } from "react"
import { useEffect } from "react"
import LoadingCircleApp from "../../../Components/App/LoadingCircle"
import NotFoundItems from "../../../Components/App/NotFoundItems"
import ModalSmall from "../../../Components/App/ModalSmall"
import axios from "axios"
import { API_SHORT, API_URL } from "../../../ExportUrl"
import toast from "react-hot-toast"
import { Time, validateDomain } from "../../../Functions/Global"
import { useContext } from "react"
import { AuthContext } from "../../../Context/AuthContext"
import { IoDocumentTextOutline, IoTrashOutline } from "react-icons/io5"

export default function MyDomains() {

    const [loading, setLoading] = useState(false)
    const [domains, setDomains] = useState([])
    const [pending, setPending] = useState(false);
    const [modalView, setModalView] = useState(false)
    const [form, setForm] = useState({ domain: null })

    const { UserInfo } = useContext(AuthContext)

    function SearchDomains() {

        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)

        setDomains([])
        setLoading(true)
        setPending(true)

        axios.post(API_URL + "/api/get/domains", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setDomains(data)
                setLoading(false)
                setPending(false)
                setModalView(false)

            }).catch((err) => {
                setLoading(false)
            })
    }

    function uploadDomain() {
        let formData = new FormData()
        formData.append("domain", form.domain)
        formData.append("id_company", UserInfo?.company?.id_company)

        if (validateDomain(form.domain)) {
            axios.post(API_URL + "/api/upload/domain", formData, { withCredentials: true })
                .then((response) => { return response.data })
                .then((data) => {
                    if (data.status) {
                        SearchDomains();
                    }
                })
        } else {
            toast.error("Opps este dominio no es veridico.")
        }



    }

    function setNewForm(ev) {
        let value = ev.target.value
        let name = ev.target.name

        setForm({ ...form, [name]: value })
    }

    useEffect(() => {
        SearchDomains()
    }, [])


    return (
        <>

            <ModalSmall key={modalView ? 'xd' : 'xd2'}  visible={modalView} Pending={pending} callback={setModalView} maxWidth={"450px"} onClick={uploadDomain} next={"Subir"}>
                <div className="top">
                    <p>Ingresar dominio</p>
                    <span>integra un nuevo dominio para utilizarlo en los envios de correo, recuerda que durara un tiempo en verificarse el dominio en nuestro servidor.</span>
                </div>
                <br />
                <div className="form-input">
                    <label htmlFor="">Dominio:</label>
                    <input type="url" onChange={setNewForm} name="domain" placeholder="mail.radarsystems.net" />
                </div>
                <br />
            </ModalSmall>
            <div className="page-info">
                <div className="">
                    <p className="title">Mis Dominios</p>
                    <span>Esta es tu lista de dominios que puedes utilizar en el envio de correos</span>
                </div>

                <div className="right">
                    <button className="add" onClick={(ev) => { setModalView(true) }}>Subir nuevo dominio</button>
                </div>
            </div>

            <div className="box box-padding">
                {domains.map((element, key) => (
                    <div className="item flex">
                        <div className="info">
                            <div className="icon">
                                <img src="/img/icons/default_link.png" alt="" />
                            </div>
                            <div className="text">
                                <p className="title">{element.domain}</p>
                                <p className="desc">{element.status ? 'Activo' : 'En verificacion...'}</p>
                                <span className="desc">{Time(element.time_add)}</span>
                            </div>
                        </div>




                        <div className="actions">
                            <button onClick={(ev) => { "" }}><IoDocumentTextOutline /></button>
                            <button onClick={(ev) => { "" }}><IoTrashOutline /></button>
                        </div>
                    </div>
                ))}
                {loading ? <LoadingCircleApp /> : domains.length == 0 ? <div className="item"><NotFoundItems name={"dominios"} /></div> : ''}
            </div>
        </>
    )
}