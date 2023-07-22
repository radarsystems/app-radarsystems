import { useContext, useState } from "react"
import { WizardContext } from "../../../Context/WizardContext"
import BottomActions from "./../../../Components/Wizard/BottomActions"
import axios from "axios"
import { API_URL } from "../../../ExportUrl"
import { toast } from "react-hot-toast"
import { IoCheckmarkOutline, IoSwapHorizontalOutline, IoTimerOutline } from "react-icons/io5"
import { useNavigate } from "react-router-dom"

export default function SendCampaign() {

    const { wizard, setWizard, AwaitButton } = useContext(WizardContext)
    const [status, setStatus] = useState(false)
    const Navigator = useNavigate();



    function Send(ev) {

        AwaitButton(ev.target, "active")

        let formData = new FormData();

        setStatus("pending")

        formData.append("id_campaign", wizard.process.id_campaign)
        formData.append("email", wizard.process.email)
        formData.append("str_affair", wizard.process.affair)
        formData.append("str_body", wizard.process.body)
        formData.append("id_company", wizard.company.id_company)



        axios.post(API_URL + "/api/send/mt", formData, { withCredentials: true }).then((response) => { return response.data }).then((data) => {
            AwaitButton(ev.target, "remove")

            if (data.status) {
                setStatus(true)
                if (wizard.tutorial_wizard) {
                    setTimeout(() => {

                        axios.get("/api/get/tutowizard", { withCredentials: true })
                        Navigator("/home")
                    }, 2000)
                }
            }

            if (data.msg) {
                toast.error(data.msg)
            }
        }).catch((err) => {
            AwaitButton(ev.target, "remove")
        })
    }

    function Next(ev) {
        Send(ev)
    }

    return (
        <>

            <div className="option active">
                <div className="left">
                    <div className="img-center">
                        <p>Detalles de envio</p>
                        <img src="img/icons/send-email2.png" alt="" />
                    </div>
                </div>
                <div className="right">
                    <div className="info">
                        <p className="title">Envio de campaign</p>
                        <span className="desc">Enhora buena! Has llegado al ultixmo paso.</span>
                    </div>

                    <div className="info">
                        <p className="title">
                            Previsualizacion del envio
                        </p>

                        <div className="structure">
                            <ul>
                                <li>Correo para: <b>{wizard.process.email}</b></li>
                                <li>Asunto: <b>{wizard.process.affair}</b></li>
                                <li>Bajo la compania: <b>{wizard.company.name}</b></li>
                                <li>Status de envio: {status == false ? <i className="text-yellow"><IoTimerOutline /> En espera de confirmacion...</i> : status == "pending" ? <i><IoSwapHorizontalOutline /> Enviando...</i> : status == true ? <i className="success"><IoCheckmarkOutline /> Enviado</i> : ''}</li>
                            </ul>
                        </div>
                    </div>


                    <BottomActions Next={Next} />
                </div>
            </div>
        </>
    )
}