import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../ExportUrl";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Recovery() {


    const [page, setPage] = useState(0);
    const Navigate = useNavigate()
    const [moment, setMoment] = useState({ user: null, existsAccount: null, code: null, intent: 0 })
    const [pending, setPending] = useState(false)

    function checkExists() {

        let formData = new FormData()

        formData.append("user", moment.user)

        if (moment.user) {

            setPending(true)
            axios.post(API_URL + "/api/recovery/existsuser", formData)
                .then((response) => { return response.data })
                .then(async (data) => {
                    if (data.status) {
                        await requestCode()
                        setPending(false)
                        setPage(1)
                        toast.success(`Tu codigo ha sido enviado al correo electronico`)
                    } else {
                        toast.error("Opps no se ha conseguido este usuario")
                        setPending(false)
                    }
                })
                .catch((err) => {
                    toast.error("Opps error al enviar la peticion.")
                    setPending(false)
                })
        } else {
            toast.error("Has dejado el usuario vacido")
        }


    }

    function checkCode() {
        let formData = new FormData()

        formData.append("user", moment?.user)
        formData.append("code", moment?.code)

        axios.post(API_URL + "/api/recovery/checkcode", formData)
            .then((response) => { return response.data })
            .then((data) => {
                if (data.status) {
                    setPage(2)
                    toast.success("Has ingresado el codigo correctamente")
                } else {

                    setMoment({ ...moment, intent: moment.intent + 1 })
                    toast.error("Error con tu codigo de seguridad")
                }
            })
    }

    function setNewForm(ev) {
        let name = ev.target.name
        let value = ev.target.value

        setMoment({ ...moment, [name]: value })
    }


    async function requestCode() {
        let formData = new FormData()
        formData.append("user", moment?.user)

        setPending(true)

        axios.post(API_URL + "/api/recovery/requestcode", formData)
            .then((response) => { return response.data })
            .then((data) => {
                setPending(false)

                if (data.status) {
                    toast.success("Codigo enviado correctamente.")
                } else {
                    toast.error("Opps error al obtener un nuevo codigo, espera un momento...")
                }
            })
            .catch((err) => {
                setPending(false)
            })
    }

    function changePassword() {
        let formData = new FormData()

        formData.append("user", moment.user)
        formData.append("password", moment.password)
        formData.append("password2", moment.password2)
        formData.append("code", moment.code)

        if (moment.password && moment.password2) {
            if (moment.password == moment.password2) {
                axios.post(API_URL + "/api/recovery/changepassword", formData)
                    .then((response) => { return response.data })
                    .then((data) => {
                        if (data.status) {
                            toast.success("Has cambiado la password correctamente")
                            Navigate("/")
                        } else {
                            toast.error("Opps error al cambiar la password")
                        }
                    })
            } else {
                toast.error("Las passwords no coiciden")
            }
        } else {
            toast.error("Has dejado campos vacios")
        }



    }


    return (<>
        <div className="recovery">
            <div className="top">
                <p>Recupera tu cuenta</p>
                <span>Recupera tu cuenta con un correo o el nombre de usuario</span>
            </div>

            <br />

            {
                page == 0
                    ?
                    <div className="form">
                        <div className="form-input">
                            <label htmlFor="">Usuario / email</label>
                            <input type="text" name="user" onChange={setNewForm} placeholder="guest@gmail.com" />
                        </div>
                        <button className={`go ${pending ? 'await' : ''}`} onClick={checkExists}>Buscar cuenta... <div className="loading"></div></button>
                    </div>

                    : ''
            }

            {
                page == 1
                    ?
                    <div className="form">
                        <div className="form-input">
                            <label htmlFor="">Ingresa el codigo enviado a (<b>{moment.user}</b>) </label>
                            <input type="password" name="code" onChange={setNewForm} placeholder="Codigo" style={{ textAlign: "center" }} />
                        </div>

                        {moment.intent ? <>
                            <button className={`transparent ${pending ? 'await' : ''}`} onClick={requestCode}>Pedir nuevo codigo <div className="loading"></div></button>
                        </> : ''}
                        <button className={`go ${pending ? 'await' : ''}`} onClick={checkCode}>Confirmar Codigo<div className="loading"></div></button>
                    </div>

                    : ''
            }

            {
                page == 2
                    ?
                    <div className="form">
                        <div className="form-input">
                            <label htmlFor="">Contraseña Nueva</label>
                            <input type="password" name="password" onChange={setNewForm} placeholder="••••••••" />
                        </div>

                        <div className="form-input">
                            <label htmlFor="">Repita contraseña nueva</label>
                            <input type="password" name="password2" onChange={setNewForm} placeholder="••••••••" />
                        </div>
                        <button className={`go ${pending ? 'await' : ''}`} onClick={changePassword}>Actualizar Contraseña<div className="loading"></div></button>
                    </div>

                    : ''
            }

        </div>
    </>)
}