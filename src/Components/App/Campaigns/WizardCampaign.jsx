import { useContext, useEffect, useState } from "react"
import { IoCheckmarkSharp, IoChevronBackOutline } from "react-icons/io5"
import { randomId } from "../../../Functions/Global"
import $, { data, type } from "jquery"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../../Context/AuthContext"

export default function WizardCampaign({ Visible, Close }) {

    const { UserInfo } = useContext(AuthContext)

    const [count, setCount] = useState(0)
    const [idOptions, setIdOptions] = useState([randomId()])
    const [form, setForm] = useState({ type: "", name: "", ocation: "" })

    const Navigate = useNavigate()


    function selectOption(ev) {
        ev.stopPropagation()
        ev.preventDefault()

        let target = $(ev.target)

        target.parents(".options").find(".active").removeClass("active")
        target.addClass("active")
        let value = target.attr("value")

        setForm(prevData => ({ ...prevData, type: value }))
    }

    function Next(ev) {
        let approve = false
        let target = $(ev.target)

        if (count === 0 && form.type == "em" || form.type == "sms") {
            approve = true
        }

        if (count == 1 && form.type !== "" && form.name !== "") {
            target.addClass('await')

            let formData = new FormData()

            formData.append("name", form.name)
            formData.append("ocation", form.ocation)
            formData.append("type_c", form.type)
            formData.append("id_company", UserInfo?.company?.id_company)

            axios.post(API_URL + "/api/upload/campaign", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {

                if (data.status) {
                    Navigate("/campaigns/detail/" + data.id_campaign)
                }

                target.removeClass('await')
            }).catch((err) => {
                target.removeClass('await')
            })
        }

        if (approve) {
            setCount(prevData => (prevData + 1))
        }

    }

    function setNewForm(ev) {
        let name = ev.target.name
        let value = ev.target.value

        setForm(prevData => ({ ...prevData, [name]: value }))
    }

    useEffect(() => {
        $(".case.active").removeClass('active')
        $(".case").eq(count).addClass("active")


    }, [count])

    return (
        <>
            <div className={`wizard-home ${Visible ? 'open' : 'close'}`} >

                <div className="top-actions">

                    {count > 0 ? <button className="return" onClick={(ev) => { setCount(prevData => (prevData - 1)) }}><IoChevronBackOutline /> <span>Volver</span> </button> : ''}


                    <button className="closed" onClick={(ev) => { Close(false) }}>X</button>
                </div>
                <div className="body">
                    <div className="case">
                        <div className="top">
                            <p className="title">Crear una nueva campaña</p>
                            <span className="desc">Selecciona el tipo de campaña que te gustaría enviar</span>
                        </div>

                        <div className="options flex" id={`options-${idOptions[0]}`}>
                            <div className="selector" onClick={selectOption} value={"em"}>
                                <div className="check">
                                    <IoCheckmarkSharp />
                                </div>
                                <div className="info">
                                    <p>CAMPAÑA EMAIL REGULAR</p>
                                    <span>Crea tu campaña de email con uno de nuestros editores para que la envíes inmediatamente o programes para enviar más tarde.</span>
                                </div>
                            </div>

                            <div className="selector" onClick={selectOption} value={"sms"}>
                                <div className="check">
                                    <IoCheckmarkSharp />
                                </div>
                                <div className="info">
                                    <p>CAMPAÑA SMS REGULAR</p>
                                    <span>Envía mensajes de texto rápidos y confiables a cualquier país con nuestras herramientas de campaña de SMS.</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="case">
                        <div className="top">
                            <p className="title">Personalizar campaña</p>
                            <span className="desc">Selecciona el tipo de campaña que te gustaría enviar</span>
                        </div>

                        <div className="form">
                            <div className="form-input">
                                <label>Nombre de campaña</label>
                                <input type="text" name="name" onChange={setNewForm} placeholder="Nombre" />
                            </div>

                            <div className="form-input">
                                <label>Selecciona tipo</label>
                                <select name="ocation" id="" onChange={setNewForm}>
                                    <option value={""} selected> Por defecto</option>
                                    <option value={"birthday"}>Cumpleaños</option>
                                </select>
                            </div>

                            {form.ocation == "birthday" ? '' : ''}
                        </div>
                    </div>

                    <div className="actions">
                        <button className="next" onClick={Next}>Siguiente <div className="loading"></div></button>
                    </div>
                </div>
            </div >
        </>
    )
}