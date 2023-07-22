import { useContext, useState } from "react"
import { WizardContext } from "../../../Context/WizardContext"
import BottomAction from "../../../Components/Wizard/BottomActions"
import SendCampaign from "./Send"
import { toast } from "react-hot-toast"

export default function AsignContact() {

    const { setWizard, setPosition } = useContext(WizardContext)
    const [contact, setContact] = useState()
    const [status, setStatus] = useState(false)

    function Next() {
        if (contact) {
            setPosition(position => (position + 1))
            setWizard(prevState => ({ ...prevState, process: { ...prevState.process, "email": contact } }))
            setStatus(true)
        } else {
            toast.error("Opps! No has proporcionado un correo valido")
        }
    }

    return (
        <>
            <div className="option">
                <div className="left">
                    <div className="img-center">
                        <p>Elegir correo</p>

                        <img src={"img/icons/email-2.png"} />
                    </div>
                </div>

                <div className="right">
                    <div className="info">
                        <p className="title">Asignar el correo</p>
                        <span className="info">Elige el correo al cual se le enviara este email.</span>
                    </div>

                    <div className="form">
                        <div className="form-input">
                            <input placeholder="Correo electronico" type="email" onChange={(ev) => { setContact(ev.target.value) }} />
                        </div>
                    </div>

                    <BottomAction Next={Next} />
                </div>
            </div>


            {status == true ? <SendCampaign /> : ''}
        </>
    )
}