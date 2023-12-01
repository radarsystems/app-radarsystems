import { useContext, useEffect, useState } from "react"
import { IoCheckmarkSharp, IoChevronBackOutline } from "react-icons/io5"
import { randomId } from "../../../Functions/Global"
import $, { data, type } from "jquery"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../../Context/AuthContext"

export default function WizardButtonsQr({ Visible, Close, Callback, setType, TypeSelect }) {

    const { UserInfo } = useContext(AuthContext)

    const [count, setCount] = useState(0)
    const [idOptions, setIdOptions] = useState([randomId()])
    const [form, setForm] = useState({ type: "", name: "" })

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

        if (count === 0 && form.type == "company" || form.type == "personal") {
            approve = true
        }


        if (approve) {
            if (form.type) {
                setType(form.type)
                Callback(false)
            }
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


                    {TypeSelect ? <button className="closed" onClick={(ev) => { Callback(false) }}>X</button> : ""}

                </div>
                <div className="body">
                    <div className="case">
                        <div className="top">
                            <p className="title">Crea tu botonera QR</p>
                            <span className="desc">Selecciona el tipo de botonera QR que deseas crear</span>
                        </div>

                        <div className="options flex" id={`options-${idOptions[0]}`}>
                            <div className="selector" onClick={selectOption} value={"personal"}>
                                <div className="check">
                                    <IoCheckmarkSharp />
                                </div>
                                <div className="info">
                                    <p>Botonera Personal</p>
                                    <span>
                                        Crea tu botonera y unifica toda tu presencia personal / online de manera sencilla, rápida y gratuita.
                                    </span>
                                </div>
                            </div>

                            <div className="selector" onClick={selectOption} value={"company"}>
                                <div className="check">
                                    <IoCheckmarkSharp />
                                </div>
                                <div className="info">
                                    <p>Botonera Empresarial</p>
                                    <span>
                                        La botonera empresarial viene con una plantilla predeterminada, donde podras generar multiples QR's y donde puedes crear a tu estilo, fondos y colores.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="case">
                        <div className="top">
                            <p className="title">Personalizar Lista</p>
                            <span className="desc">Asignale un nombre a tu nueva lista.</span>
                        </div>

                        <div className="form">
                            <div className="form-input">
                                <label>Nombre de lista</label>
                                <input type="text" name="name" onChange={setNewForm} placeholder="Nombre" />
                            </div>
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