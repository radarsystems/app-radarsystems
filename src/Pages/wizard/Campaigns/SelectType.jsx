import { useContext, useEffect, useState } from "react"
import BottomAction from "../../../Components/Wizard/BottomActions"
import { WizardContext } from "../../../Context/WizardContext"
import { toast } from "react-hot-toast"
import SelectContacts from "./SelectContacts"
import SelectBody from "./SelectBody"
import Body from "./Body"

export default function SelectType() {

    const { Selector, setWizard, setPosition, position } = useContext(WizardContext)
    const [type, setType] = useState()

    function Next() {
        if (type !== undefined || type !== "") {
            setPosition(position + 1)
        } else {
            toast.error("!Opps no has seleccionado el tipo de envio")
        }
    }

    function CampaignSendType(value) {
        setType(value)
        setWizard(prevState => ({ ...prevState, process: { ...prevState.process, type_send: value } }))

    }



    return (<>
        <div className="option">
            <div className="left">
                <div className="img-center">
                    <p>Selecciona el tipo</p>
                    <img src="img/icons/send-type.png" alt="" />
                </div>
            </div>

            <div className="right">
                <div className="info">
                    <p className="title">Elige el tipo de envio</p>
                    <span className="desc">Aca tienes que elegir que tipo de envio quieres que sea. Es decir, puedes elegir entre un envio </span>
                </div>

                <div className="buttons selector">
                    <button value={"masive"} onClick={(ev) => { Selector(ev, CampaignSendType) }}>Envíos de campañas masivas</button>
                    <button value={"ind"} onClick={(ev) => { Selector(ev, CampaignSendType) }}>Envio Individual</button>
                </div>

                <BottomAction Next={Next} />
            </div>
        </div>

        {type == "ind" ? <Body /> : type == "masive" ? <SelectContacts /> : ''}
    </>)
}