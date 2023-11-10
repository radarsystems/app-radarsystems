import { IoArrowUpCircleOutline, IoCheckmarkSharp, IoCogOutline } from "react-icons/io5";
import { BiErrorAlt } from "react-icons/bi"

export default function ListStatus({ Status }) {


    return (<>
        {Status == "wait" ? <span className="wait-list"><IoArrowUpCircleOutline /> Subiendo...</span> : Status == "ready" ? <span className="ready-list"><IoCheckmarkSharp />  Activa</span> : Status == "error" ? <span className="error-list"><BiErrorAlt /> Error</span> : <span className="setting-list"><IoCogOutline /> En espera...</span>}

    </>)
}