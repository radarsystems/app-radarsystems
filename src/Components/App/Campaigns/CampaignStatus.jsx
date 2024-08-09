import { IoCheckmarkDone, IoPause, IoTimerOutline } from "react-icons/io5";
import { FiLoader } from "react-icons/fi"
import { Icon } from "@iconify/react";

export default function CampaignStatus({ status, PauseCampaign, style }) {

    return (
        <>

            {status == "prepare" ?
                <>
                    <span style={style} className="wait">En espera... <Icon icon="mdi:check" /></span>
                </>
                : ""}

            {status == "programmed" ?
                <>
                    <span style={style} className="programmed"> Programada <Icon icon="fa-solid:check" /></span>
                </>
                : ""}

            {status == "sent" ?
                <>
                    <span style={style} className="ready-list">Enviado <Icon icon="mdi:check-all" /> </span>
                </>
                : ""}


            {status == "sending" ?
                <>
                    <span style={style} className="ready-list"> Enviando... <FiLoader /></span>
                    <button onClick={PauseCampaign}><IoPause /></button>
                </>
                : ""}
        </>
    )
}