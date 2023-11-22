import { IoCheckmarkDone, IoPause, IoTimerOutline } from "react-icons/io5";
import { FiLoader } from "react-icons/fi"

export default function CampaignStatus({ status, PauseCampaign }) {

    return (
        <>

            {status == "prepare" ?
                <>
                    <span><FiLoader /> En espera...</span>
                </>
                : ""}

            {status == "programmed" ?
                <>
                    <span className="wait-list"><IoTimerOutline /> Programada </span>
                </>
                : ""}

            {status == "sent" ?
                <>
                    <span className="ready-list"><IoCheckmarkDone /> Enviado</span>
                </>
                : ""}


            {status == "sending" ?
                <>
                    <span className="ready-list"><FiLoader /> Enviando...</span>
                    <button onClick={PauseCampaign}><IoPause /></button>
                </>
                : ""}
        </>
    )
}