import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../Context/AuthContext"
import { Icon } from "@iconify/react/dist/iconify.js"
import toast from "react-hot-toast"

export default function Credentials() {

    const { UserInfo } = useContext(AuthContext)
    const [form, setForm] = useState({})
    const [visible, setVisible] = useState(false);

    function getCredentials() {
        let formData = new FormData()
        formData.append("id_company", UserInfo?.company?.id_company)
        axios.post(API_URL + "/api/get/api/credentials", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                setForm(data)
            })
    }

    function copy(what) {
        navigator.clipboard.writeText(form?.[what])

        if (what == "client_id") {
            toast.success("Has copiado tu Client ID")
        } else {
            toast.success("Has copiado tu Secret Key")
        }
    }

    function updateCredentials() {
        let formData = new FormData()
        formData.append("client_id", form.client_id)

        axios.post(API_URL + "/api/auth/newkey", formData, { withCredentials: true })
            .then((response) => { return response.data })
            .then((data) => {
                if (data.status) {
                    toast.success("Secret Key actualizada con exito")
                    getCredentials()
                }
            })
    }

    useEffect(() => {
        getCredentials()
    }, [])

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                setVisible(false)
                toast.success("Se oculto automaticamente por seguridad")
            }, 2500)
        }
    }, [visible])

    return (
        <>
            <div className="page-info">
                <div className="">
                    <p className="title">Credenciales</p>
                    <span>Obten tus credenciales para poder manejarte por nuestra API</span>
                </div>

                <div className="right">
                    <button onClick={updateCredentials} className="add">Actualizar Secret</button>
                </div>
            </div>


            <div className="row">
                <div className="col-md-6">
                    <div className="box stat box-padding">
                        <div className="top">
                            <p className="title">Client ID</p>
                            <span>Este es tu indentificador de cliente es el ID unico que te identificara.</span>
                        </div>

                        <div className="form-credentials">
                            <input className="client" type="text" value={form.client_id} disabled />
                            <button onClick={(ev) => { copy("client_id") }}><Icon icon="material-symbols:copy-all-outline" /></button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="box stat box-padding">
                        <div className="top">
                            <p className="title">Secret Key</p>
                            <span>Esta es la clave secreta, que funciona para indentificarte junto tu <b>CLIENT ID</b></span>
                        </div>
                        {visible ?
                            <div className="form-credentials">
                                <input className="secret" type="text" value={form.secret_key} disabled />
                                <button onClick={(ev) => { copy("secret_key") }}><Icon icon="material-symbols:copy-all-outline" /></button>
                            </div>
                            :
                            <div className="form-credentials">
                                <input className="secret" type="text" value={"- - - - - - - - - - - - - -"} disabled />
                                <button onClick={(ev) => { setVisible(true) }}><Icon icon="ph:eye-closed" /></button>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </>
    )
}