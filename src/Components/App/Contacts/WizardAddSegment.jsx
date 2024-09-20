import { useContext, useEffect, useState } from "react"
import { IoCheckmarkSharp, IoChevronBackOutline } from "react-icons/io5"
import { randomId } from "../../../Functions/Global"
import $, { data, type } from "jquery"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../../Context/AuthContext"
import toast from "react-hot-toast"
import { Icon } from "@iconify/react/dist/iconify.js"

export default function WizardAddSegment({ Visible = true, Close }) {

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

        if (count === 0) {
            approve = true
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
                            <p className="title">CREA UN NUEVO SEGMENTO</p>
                            <span className="desc">Selecciona el tipo de campaña que te gustaría enviar</span>
                        </div>

                        <div className="form-input">
                            <label htmlFor="">Nombre del Segmento</label>
                            <input type="text" placeholder="Mi segmento 1" />
                        </div>
                    </div>



                    <div className="actions">
                        <button className="next" onClick={Next}>Siguiente <div className="loading"></div></button>
                        <button className="return"><Icon icon="teenyicons:left-outline" /></button>
                    </div>
                </div>
            </div >
        </>
    )
}